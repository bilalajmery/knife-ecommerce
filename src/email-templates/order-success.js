export const generateOrderSuccessEmail = (order) => {
  const { orderId, items, total, shippingAddress, discount } = order;
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
  <title>Your KnifeMaster Order - #${orderId}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #050505;
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #0a0a0a;
      border: 1px solid #222;
    }
    .header {
      padding: 40px 20px;
      text-align: center;
      background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
      border-bottom: 2px solid #dc2626;
    }
    .logo-container {
      margin-bottom: 20px;
    }
    .logo-text {
      font-size: 32px;
      font-weight: 800;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 4px;
      text-decoration: none;
    }
    .logo-text span {
      color: #dc2626;
    }
    .content {
      padding: 40px 30px;
    }
    .hero-text {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 10px;
      text-align: center;
      color: #ffffff;
    }
    .sub-hero {
      color: #9ca3af;
      text-align: center;
      font-size: 16px;
      margin-bottom: 40px;
    }
    .order-card {
      background: #111;
      border: 1px solid #222;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .order-title {
      font-size: 14px;
      text-transform: uppercase;
      color: #6b7280;
      letter-spacing: 1px;
      margin-bottom: 15px;
      border-bottom: 1px solid #222;
      padding-bottom: 10px;
    }
    .summary-table {
      width: 100%;
      border-collapse: collapse;
    }
    .total-row td {
      padding-top: 20px;
      font-size: 18px;
      font-weight: bold;
    }
    .address-grid {
      display: table;
      width: 100%;
      margin-top: 20px;
    }
    .address-col {
      display: table-cell;
      width: 50%;
      padding-right: 10px;
      vertical-align: top;
    }
    .btn {
      background-color: #dc2626;
      color: #ffffff;
      padding: 16px 32px;
      text-decoration: none;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      border-radius: 4px;
      display: inline-block;
      margin: 30px 0;
      transition: background 0.3s;
    }
    .footer {
      background-color: #050505;
      padding: 40px 20px;
      text-align: center;
      border-top: 1px solid #222;
    }
    .social-link {
      color: #6b7280;
      text-decoration: none;
      margin: 0 10px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .tagline {
      color: #4b5563;
      font-size: 12px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-container">
        <img src="cid:logo" alt="KnifeMaster" style="width: 60px; height: 60px; margin-bottom: 10px;">
        <div class="logo-text">Blade<span>Master</span></div>
      </div>
    </div>
    
    <div class="content">
      <div class="hero-text">Order Confirmed.</div>
      <div class="sub-hero">Prep is complete. Your gear is in the queue.</div>
      
      <div class="order-card">
        <div class="order-title">Order Details: #${orderId}</div>
        <table class="summary-table">
          <thead>
            <tr style="color: #6b7280; font-size: 12px; text-transform: uppercase;">
              <th style="padding: 0 10px 10px 0; text-align: left;">Item</th>
              <th style="padding: 0 10px 10px 10px; text-align: left;">Description</th>
              <th style="padding: 0 10px 10px 10px; text-align: center;">Qty</th>
              <th style="padding: 0 0 10px 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            ${discount > 0 ? `
            <tr>
              <td colspan="3" style="padding: 15px 10px 5px 0; text-align: right; color: #9ca3af;">Discount:</td>
              <td style="padding: 15px 0 5px 10px; text-align: right; color: #dc2626;">-$${discount.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr class="total-row">
              <td colspan="3" style="text-align: right; color: #ffffff;">Order Total:</td>
              <td style="text-align: right; color: #ffffff; font-size: 24px;">$${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="order-card">
        <div class="order-title">Shipping Information</div>
        <div class="address-grid">
          <div class="address-col">
            <div style="color: #ffffff; font-weight: bold; margin-bottom: 8px;">Delivery Address</div>
            <div style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
              ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
              ${shippingAddress.address}<br>
              ${shippingAddress.city}, ${shippingAddress.zip}<br>
              ${shippingAddress.country}
            </div>
          </div>
          <div class="address-col">
            <div style="color: #ffffff; font-weight: bold; margin-bottom: 8px;">Contact Details</div>
            <div style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
              Email: ${shippingAddress.email}<br>
              Order Date: ${new Date().toLocaleDateString()}<br>
              Carrier: Standard Shipping
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order?id=${orderId}" class="btn">Track Your Shipment</a>
      </div>
    </div>
    
    <div class="footer">
      <div style="margin-bottom: 20px;">
        <a href="#" class="social-link">Instagram</a>
        <a href="#" class="social-link">Twitter</a>
        <a href="#" class="social-link">Youtube</a>
      </div>
      <p style="color: #9ca3af; font-size: 14px;">Questions? Reply to this email or visit our Help Center.</p>
      <div class="tagline">&copy; ${new Date().getFullYear()} KnifeMaster Industries. Excellence in Every Edge.</div>
    </div>
  </div>
</body>
</html>
  `;
};
