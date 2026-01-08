// export const generateOtpEmailHtml = (OTP_CODE: string) => `
// <!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="UTF-8" />
//     <title>Your OTP Code</title>
//   </head>
//   <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
//     <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
//       <tr>
//         <td style="background-color: #000000; color: white; padding: 20px; text-align: center;">
//           <h2>Elite Cash Flow Products</h2>
//         </td>
//       </tr>
//       <tr>
//         <td style="padding: 30px;">
//           <p>Hi there,</p>
//           <p>We received a request to verify your login for <strong>Elite Cash Flow Products</strong>.</p>
//           <p>Your One-Time Password (OTP) is:</p>
//           <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #000000; text-align: center;">
//             ${OTP_CODE}
//           </p>
//           <p>This OTP will expire in 5 minutes.</p>
//           <p>If you didn’t request this, please ignore this email.</p>
//           <br />
//           <p>Thanks,<br /><strong>Elite Cash Flow Products Team</strong></p>
//         </td>
//       </tr>
//       <tr>
//         <td style="background-color: #f1f5f9; color: #6b7280; font-size: 12px; text-align: center; padding: 15px;">
//           © 2025 Elite Cash Flow Products. All rights reserved.
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>

// `;

// otp-email.ts
// Redesigned OTP email (logo + Elite Cashflow Products theme)

const logoUrl = 'https://nmrwback.vuztec.com/public/elite/product_logo_color.png';

const COMPANY_NAME = 'Elite Cashflow Products';

// Theme
const ACCENT = '#C9A227'; // elegant gold
const INK = '#111827';
const MUTED = '#6B7280';
const BG = '#F3F4F6';
const CARD = '#FFFFFF';
const BORDER = '#E5E7EB';

function esc(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const generateOtpEmailSubject = () => `Your verification code • ${COMPANY_NAME}`;

export const generateOtpEmailHtml = (OTP_CODE: string, expiresMinutes = 5) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(generateOtpEmailSubject())}</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: ${BG};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
      color: ${INK};
    "
  >
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding: 18px 10px;">
      <tbody>
        <tr>
          <td align="center">
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                max-width: 640px;
                background-color: ${CARD};
                border-radius: 14px;
                overflow: hidden;
                border: 1px solid ${BORDER};
                box-shadow: 0 8px 24px rgba(17, 24, 39, 0.08);
              "
            >
              <tbody>
                <!-- Header -->
                  <tr>
                    <td style="padding: 22px 24px 16px 24px;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tbody>
                          <tr>
                            <!-- Logo -->
                            <td
                              align="left"
                              valign="middle"
                              style="width: 140px;"
                            >
                              <img
                                src="${esc(logoUrl)}"
                                alt="${esc(COMPANY_NAME)}"
                                width="110"
                                style="
                                  display:block;
                                  outline:none;
                                  border:none;
                                  text-decoration:none;
                                  height:auto;
                                "
                              />
                            </td>

                            <!-- Title -->
                            <td
                              align="right"
                              valign="middle"
                              style="padding-left: 10px;"
                            >
                              <div
                                style="
                                  font-size: 11px;
                                  letter-spacing: 0.18em;
                                  color: ${MUTED};
                                  text-transform: uppercase;
                                  margin-bottom: 4px;
                                "
                              >
                                Security Verification
                              </div>

                              <div
                                style="
                                  font-size: 17px;
                                  font-weight: 900;
                                  color: ${INK};
                                  line-height: 1.2;
                                "
                              >
                                One-Time Password (OTP)
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- Gold divider -->
                      <div
                        style="
                          margin-top: 14px;
                          height: 3px;
                          background: linear-gradient(90deg, ${ACCENT}, rgba(201,162,39,0.2));
                          border-radius: 999px;
                        "
                      ></div>
                    </td>
                  </tr>


                <!-- Body -->
                <tr>
                  <td style="padding: 10px 22px 0 22px;">
                    <div style="font-size: 15px; line-height: 22px; margin: 0; color: ${INK};">
                      Hi there,
                    </div>

                    <div style="font-size: 14px; line-height: 22px; margin-top: 10px; color: ${MUTED};">
                      We received a request to verify your login for <b style="color:${INK};">${esc(COMPANY_NAME)}</b>.
                      Use the code below to complete your verification.
                    </div>
                  </td>
                </tr>

                <!-- OTP Card -->
                <tr>
                  <td style="padding: 16px 22px 6px 22px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius: 14px; overflow: hidden;">
                      <tbody>
                        <tr>
                          <td style="background: #0B0F19; padding: 18px 16px; text-align: center;">
                            <div style="color: rgba(255,255,255,0.75); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;">
                              Your OTP code
                            </div>

                            <div
                              style="
                                margin-top: 10px;
                                display: inline-block;
                                background: rgba(255,255,255,0.06);
                                border: 1px solid rgba(255,255,255,0.14);
                                border-radius: 14px;
                                padding: 14px 18px;
                              "
                            >
                              <span
                                style="
                                  color: #FFFFFF;
                                  font-size: 30px;
                                  font-weight: 900;
                                  letter-spacing: 6px;
                                  line-height: 1;
                                "
                              >
                                ${esc(OTP_CODE)}
                              </span>
                            </div>

                            <div style="color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 12px;">
                              Expires in ${esc(expiresMinutes)} minutes
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Notes -->
                <tr>
                  <td style="padding: 10px 22px 0 22px;">
                    <div style="font-size: 13px; line-height: 20px; color: ${MUTED};">
                      If you did not request this code, you can safely ignore this email. For your security, do not share this code with anyone.
                    </div>
                    <div style="margin-top: 16px; font-size: 14px; line-height: 20px; color: ${INK};">
                      Thanks,<br />
                      <b>${esc(COMPANY_NAME)} Team</b>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 18px 22px 22px 22px;">
                    <div style="border-top: 1px solid ${BORDER}; padding-top: 14px; text-align: center;">
                      <div style="font-size: 12px; color: ${MUTED}; line-height: 18px;">
                        © 2025 ${esc(COMPANY_NAME)}. All rights reserved.
                      </div>
                      <div style="font-size: 11px; color: ${MUTED}; line-height: 16px; margin-top: 6px;">
                        This is an automated security email.
                      </div>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>

            <div style="max-width: 640px; margin: 10px auto 0 auto; font-size: 11px; color: ${MUTED}; text-align: center; line-height: 16px;">
              For security, never forward your OTP code.
            </div>

          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;
