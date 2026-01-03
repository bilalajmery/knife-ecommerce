import Agenda from "agenda";
import nodemailer from "nodemailer";
import { generateOrderSuccessEmail } from "../email-templates/order-success.js";
import { generateOrderStatusEmail } from "../email-templates/order-update.js";

const MONGODB_URI = process.env.MONGODB_URI;

let agenda = global.agenda;

const createAgenda = () => {
    if (global.agenda) return global.agenda;

    const instance = new Agenda({
        db: { address: MONGODB_URI, collection: "agendaJobs" },
        processEvery: "5 seconds", // Poll more frequently
    });

    // Define Jobs
    instance.define("sendOrderEmail", async (job) => {
        console.log("Job started: sendOrderEmail", job.attrs._id);
        const { order } = job.attrs.data;
        const { shippingAddress } = order;

        if (!shippingAddress || !shippingAddress.email) {
            console.error("No email found for order:", order.orderId);
            return;
        }

        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: `"KnifeMasters" <${process.env.EMAIL_USER}>`,
                to: shippingAddress.email,
                subject: `Order Confirmation - #${order.orderId}`,
                html: generateOrderSuccessEmail(order),
                attachments: [
                    {
                        filename: 'logo.png',
                        path: 'https://cdn-icons-png.flaticon.com/512/3218/3218579.png',
                        cid: 'logo'
                    }
                ]
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent for order ${order.orderId} to ${shippingAddress.email}`);
        } catch (error) {
            console.error("Error sending order email via Agenda:", error);
            throw error;
        }
    });

    instance.define("sendOrderStatusEmail", async (job) => {
        console.log("Job started: sendOrderStatusEmail", job.attrs._id);
        const { order, status } = job.attrs.data;
        const { shippingAddress } = order;

        if (!shippingAddress || !shippingAddress.email) {
            console.error("No email found for order update:", order.orderId);
            return;
        }

        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const statusSubject = {
                shipped: `Your order #${order.orderId} has been shipped!`,
                delivered: `Your order #${order.orderId} has been delivered!`,
                cancelled: `Your order #${order.orderId} has been cancelled`,
                processing: `We are now processing your order #${order.orderId}`
            };

            const mailOptions = {
                from: `"KnifeMasters" <${process.env.EMAIL_USER}>`,
                to: shippingAddress.email,
                subject: statusSubject[status] || `Update on your order #${order.orderId}`,
                html: generateOrderStatusEmail(order, status),
                attachments: [
                    {
                        filename: 'logo.png',
                        path: 'https://cdn-icons-png.flaticon.com/512/3218/3218579.png',
                        cid: 'logo'
                    }
                ]
            };

            await transporter.sendMail(mailOptions);
            console.log(`Status update email (${status}) sent for order ${order.orderId} to ${shippingAddress.email}`);
        } catch (error) {
            console.error("Error sending status update email via Agenda:", error);
            throw error;
        }
    });

    global.agenda = instance;
    return instance;
};

export const startAgenda = async () => {
    const instance = createAgenda();

    // Ensure the worker is started and running
    if (!global.agendaStarted) {
        await instance.start();
        console.log("Agenda background worker started successfully");
        global.agendaStarted = true;
    }

    return instance;
};

export default createAgenda;
