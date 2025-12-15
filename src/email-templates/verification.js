export const generateVerificationEmail = (otp, name) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #000000;
      font-family: 'Arial', sans-serif;
      color: #ffffff;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #111111;
      border: 1px solid #333333;
    }
    .header {
      text-align: center;
      padding-bottom: 30px;
      border-bottom: 1px solid #333333;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-decoration: none;
    }
    .logo span {
      color: #dc2626; /* Red-600 */
    }
    .content {
      padding: 40px 0;
      text-align: center;
    }
    .greeting {
      font-size: 24px;
      margin-bottom: 20px;
      color: #ffffff;
    }
    .message {
      color: #9ca3af; /* Gray-400 */
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .otp-container {
      background-color: #000000;
      border: 1px solid #dc2626;
      border-radius: 8px;
      padding: 20px;
      margin: 30px auto;
      max-width: 200px;
    }
    .otp-code {
      font-family: 'Courier New', monospace;
      font-size: 32px;
      font-weight: bold;
      color: #dc2626;
      letter-spacing: 4px;
      margin: 0;
    }
    .expiry {
      font-size: 14px;
      color: #6b7280; /* Gray-500 */
      margin-top: 15px;
    }
    .footer {
      border-top: 1px solid #333333;
      padding-top: 30px;
      text-align: center;
      color: #4b5563; /* Gray-600 */
      font-size: 12px;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-link {
      color: #9ca3af;
      text-decoration: none;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="#" class="logo">Blade<span>Master</span></a>
    </div>
    
    <div class="content">
      <h1 class="greeting">Welcome, ${name}!</h1>
      <p class="message">
        Thank you for joining the elite. To complete your registration and secure your account, please use the verification code below.
      </p>
      
      <div class="otp-container">
        <p class="otp-code">${otp}</p>
      </div>
      
      <p class="expiry">
        This code will expire in 10 minutes.<br>
        If you didn't request this, please ignore this email.
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} BladeMaster. All rights reserved.</p>
      <p>Premium Hand-Forged Knives & Tactical Gear</p>
      <div class="social-links">
        <a href="#" class="social-link">Instagram</a>
        <a href="#" class="social-link">Twitter</a>
        <a href="#" class="social-link">Facebook</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
