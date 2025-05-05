export const generateOtpEmailHtml = (OTP_CODE: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your OTP Code</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="background-color: #000000; color: white; padding: 20px; text-align: center;">
          <h2>Elite Cash Flow Products</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px;">
          <p>Hi there,</p>
          <p>We received a request to verify your login for <strong>Elite Cash Flow Products</strong>.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #000000; text-align: center;">
            ${OTP_CODE}
          </p>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <br />
          <p>Thanks,<br /><strong>Elite Cash Flow Products Team</strong></p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f1f5f9; color: #6b7280; font-size: 12px; text-align: center; padding: 15px;">
          © 2025 Elite Cash Flow Products. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
</html>

`;
