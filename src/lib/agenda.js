import Agenda from "agenda";
import nodemailer from "nodemailer";
import { generateOrderSuccessEmail } from "@/email-templates/order-success";

const MONGODB_URI = process.env.MONGODB_URI;

let agenda = global.agenda;

const createAgenda = () => {
    if (agenda) return agenda;

    agenda = new Agenda({
        db: { address: MONGODB_URI, collection: "agendaJobs" },
        processEvery: "10 seconds",
    });

    // Define Jobs
    agenda.define("sendOrderEmail", async (job) => {
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
                from: `"BladeMaster" <${process.env.EMAIL_USER}>`,
                to: shippingAddress.email,
                subject: `Order Confirmation - #${order.orderId}`,
                html: generateOrderSuccessEmail(order),
                attachments: [
                    {
                        filename: 'logo.png',
                        path: 'https://cdn-icons-png.flaticon.com/512/3218/3218579.png', // Temporary professional knife icon as logo
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

    global.agenda = agenda;
    return agenda;
};

export const startAgenda = async () => {
    const instance = createAgenda();
    if (global.agendaStarted) return instance;

    await instance.start();
    console.log("Agenda background worker started");
    global.agendaStarted = true;
    return instance;
};

export default createAgenda;
