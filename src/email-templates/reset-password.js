export const generateResetPasswordEmail = (resetUrl, name) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
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
    .btn-container {
      margin: 30px 0;
    }
    .btn {
      background-color: #dc2626;
      color: #ffffff;
      padding: 14px 28px;
      text-decoration: none;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: 4px;
      display: inline-block;
    }
    .btn:hover {
      background-color: #b91c1c;
    }
    .expiry {
      font-size: 14px;
      color: #6b7280; /* Gray-500 */
      margin-top: 30px;
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
      <h1 class="greeting">Reset Password</h1>
      <p class="message">
        Hello ${name},<br>
        We received a request to reset your password. Click the button below to create a new password.
      </p>
      
      <div class="btn-container">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </div>
      
      <p class="expiry">
        This link will expire in 1 hour.<br>
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} KnifeMaster. All rights reserved.</p>
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
