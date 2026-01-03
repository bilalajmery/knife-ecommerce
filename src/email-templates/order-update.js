export const generateOrderStatusEmail = (order, status) => {
  const { orderId, items, total, shippingAddress } = order;

  const statusTitles = {
    pending: "Order Pending",
    processing: "Order Processing",
    shipped: "Order Shipped",
    delivered: "Order Delivered",
    cancelled: "Order Cancelled"
  };

  const statusMessages = {
    pending: "Your order is currently pending and will be processed soon.",
    processing: "Great news! We've started processing your order. Our master smiths are on it.",
    shipped: "Your gear has left the forge! It's on its way to your location.",
    delivered: "Mission accomplished. Your order has been delivered successfully.",
    cancelled: "Your order has been cancelled. If this was a mistake, please contact our support."
  };

  const title = statusTitles[status] || "Order Update";
  const message = statusMessages[status] || "Your order status has been updated.";
  const accentColor = status === 'cancelled' ? '#dc2626' : (status === 'delivered' ? '#10b981' : '#dc2626');

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 15px 10px; border-bottom: 1px solid #333; width: 80px;">
        <img src="${item.image || 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=80&auto=format&fit=crop'}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; border: 1px solid #444;">
      </td>
      <td style="padding: 15px 10px; border-bottom: 1px solid #333;">
        <div style="font-weight: bold; color: #ffffff; font-size: 16px;">${item.name}</div>
        <div style="color: #9ca3af; font-size: 14px; margin-top: 4px;">Premium Crafted Blade</div>
      </td>
      <td style="padding: 15px 10px; border-bottom: 1px solid #333; text-align: center; color: #ffffff;">x${item.quantity}</td>
      <td style="padding: 15px 10px; border-bottom: 1px solid #333; text-align: right; font-weight: bold; color: #dc2626;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - #${orderId}</title>
  <style>
    body {
      margin: 0; padding: 0; background-color: #050505;
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff; -webkit-font-smoothing: antialiased;
    }
    .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #222; }
    .header { padding: 40px 20px; text-align: center; background: linear-gradient(180deg, #111 0%, #0a0a0a 100%); border-bottom: 2px solid ${accentColor}; }
    .logo-text { font-size: 32px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 4px; text-decoration: none; }
    .logo-text span { color: #dc2626; }
    .content { padding: 40px 30px; }
    .hero-text { font-size: 28px; font-weight: 700; margin-bottom: 10px; text-align: center; color: #ffffff; }
    .status-badge { display: inline-block; padding: 6px 16px; background: ${accentColor}; color: #fff; border-radius: 20px; font-weight: bold; font-size: 14px; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 1px; }
    .sub-hero { color: #9ca3af; text-align: center; font-size: 16px; margin-bottom: 40px; }
    .order-card { background: #111; border: 1px solid #222; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
    .order-title { font-size: 14px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px solid #222; padding-bottom: 10px; }
    .summary-table { width: 100%; border-collapse: collapse; }
    .btn { background-color: #dc2626; color: #ffffff; padding: 16px 32px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px; display: inline-block; margin: 30px 0; }
    .footer { background-color: #050505; padding: 40px 20px; text-align: center; border-top: 1px solid #222; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:logo" alt="KnifeMasters" style="width: 60px; height: 60px; margin-bottom: 10px;">
      <div class="logo-text">Blade<span>Master</span></div>
    </div>
    
    <div class="content" style="text-align: center;">
      <div class="status-badge">${title}</div>
      <div class="hero-text">Update on Order #${orderId}</div>
      <div class="sub-hero">${message}</div>
      
      <div class="order-card" style="text-align: left;">
        <div class="order-title">Line Items</div>
        <table class="summary-table">
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding-top: 20px; text-align: right; color: #ffffff; font-weight: bold;">Total Paid:</td>
              <td style="padding-top: 20px; text-align: right; color: #ffffff; font-size: 20px; font-weight: bold;">$${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order?id=${orderId}" class="btn">View Order Details</a>
    </div>
    
    <div class="footer">
      <p style="color: #9ca3af; font-size: 14px;">If you have any questions, simply reply to this email.</p>
      <div style="color: #4b5563; font-size: 12px; margin-top: 20px;">&copy; ${new Date().getFullYear()} KnifeMasters Industries.</div>
    </div>
  </div>
</body>
</html>
  `;
};
