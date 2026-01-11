// customer-service.ts
// Customer Service submission email (internal notification)
// HTML template only (no send function)
// Matches the same premium gold / clean card style used in your other templates.

const logoUrl = 'https://nmrwback.vuztec.com/public/elite/product_logo_color.png';

const COMPANY_NAME = 'Elite Cashflow Products';

// Theme (consistent with your other templates)
const ACCENT = '#C9A227';
const INK = '#111827';
const MUTED = '#6B7280';
const BG = '#F3F4F6';
const CARD = '#FFFFFF';
const BORDER = '#E5E7EB';

// Gold card palette (same approach used for OTP / invoice / notify highlights)
const GOLD_BG = '#FBF4D6';
const GOLD_BORDER = '#D6B24A';
const GOLD_LABEL = '#8A6E15';

export type CustomerServicePayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken?: string; // optional (you noted you may wire it later)
  createdAt?: Date | string; // optional
  source?: string; // optional (e.g., "web", "app", etc.)
};

function esc(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fmtDateTime(d?: Date | string): string {
  if (!d) return '';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  return dt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Optional helper: keep line breaks in the message
function nl2br(text: string): string {
  return esc(text).replace(/\r\n|\n|\r/g, '<br />');
}

export const customerServiceEmailSubject = (p: CustomerServicePayload) =>
  `Customer Service Request • ${p.subject || 'New message'}`;

export const customerServiceEmailHtml = (props: CustomerServicePayload) => {
  const createdAt = fmtDateTime(props.createdAt) || fmtDateTime(new Date());

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(customerServiceEmailSubject(props))}</title>
  </head>

  <body
    style="
      background-color: ${BG};
      margin: 0;
      padding: 0;
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
                max-width: 720px;
                background-color: ${CARD};
                border-radius: 14px;
                overflow: hidden;
                border: 1px solid ${BORDER};
                box-shadow: 0 8px 24px rgba(17, 24, 39, 0.08);
              "
            >
              <tbody>

                <!-- Header (same style as your other templates) -->
                <tr>
                  <td style="padding: 24px 24px 16px 24px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody>
                        <tr>
                          <!-- Logo -->
                          <td align="left" valign="middle" style="width: 160px;">
                            <img
                              alt="${esc(COMPANY_NAME)}"
                              src="${esc(logoUrl)}"
                              width="120"
                              style="display:block; outline:none; border:none; text-decoration:none; height:auto;"
                            />
                          </td>

                          <!-- Title / Meta -->
                          <td align="right" valign="middle" style="padding-left: 12px;">
                            <div
                              style="
                                font-size: 11px;
                                letter-spacing: 0.18em;
                                color: ${MUTED};
                                text-transform: uppercase;
                                margin-bottom: 4px;
                              "
                            >
                              Customer Service
                            </div>

                            <div
                              style="
                                font-size: 18px;
                                font-weight: 900;
                                color: ${INK};
                                line-height: 1.2;
                              "
                            >
                              New support request
                            </div>

                            <div style="font-size: 12px; color: ${MUTED}; margin-top: 4px;">
                              ${esc(createdAt)}
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

                <!-- Intro -->
                <tr>
                  <td style="padding: 0 24px 6px 24px;">
                    <div style="font-size: 14px; line-height: 22px; color: ${MUTED};">
                      A client submitted the Customer Service form. Details are below.
                    </div>
                  </td>
                </tr>

                <!-- Summary highlight (gold, no black) -->
                <tr>
                  <td style="padding: 14px 24px 10px 24px;">
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        background-color: ${GOLD_BG};
                        border: 1px solid ${GOLD_BORDER};
                        border-radius: 16px;
                        overflow: hidden;
                      "
                    >
                      <tbody>
                        <tr>
                          <td style="padding: 18px 18px;">
                            <div
                              style="
                                font-size: 11px;
                                letter-spacing: 0.18em;
                                text-transform: uppercase;
                                color: ${GOLD_LABEL};
                              "
                            >
                              Subject
                            </div>

                            <div style="margin-top: 8px;">
                              <span style="font-size: 18px; font-weight: 900; color: #000000;">
                                ${esc(props.subject || '—')}
                              </span>
                            </div>

                            <div style="margin-top: 10px; font-size: 13px; color: #4B5563;">
                              From <b style="color:${INK};">${esc(props.name || '—')}</b> • ${esc(props.email || '—')}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Details -->
                <tr>
                  <td style="padding: 6px 24px 0 24px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody>
                        <tr>
                          <!-- Left: Contact -->
                          <td style="vertical-align: top; padding-right: 12px;">
                            <div style="font-size: 12px; letter-spacing: 0.12em; color: ${MUTED}; text-transform: uppercase; margin-bottom: 8px;">
                              Contact details
                            </div>

                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="border: 1px solid ${BORDER}; border-radius: 12px; overflow: hidden;"
                            >
                              <tbody>
                                <tr>
                                  <td style="padding: 12px 12px; font-size: 13px; color: ${MUTED}; width: 34%;">Name</td>
                                  <td style="padding: 12px 12px; font-size: 13px; color: ${INK}; font-weight: 700;">${esc(props.name || '—')}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 12px 12px; font-size: 13px; color: ${MUTED}; width: 34%; border-top: 1px solid ${BORDER};">Email</td>
                                  <td style="padding: 12px 12px; font-size: 13px; color: ${INK}; font-weight: 700; border-top: 1px solid ${BORDER};">${esc(props.email || '—')}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 12px 12px; font-size: 13px; color: ${MUTED}; width: 34%; border-top: 1px solid ${BORDER};">Source</td>
                                  <td style="padding: 12px 12px; font-size: 13px; color: ${INK}; font-weight: 700; border-top: 1px solid ${BORDER};">${esc(props.source || 'Customer Service Dialog')}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 12px 12px; font-size: 13px; color: ${MUTED}; width: 34%; border-top: 1px solid ${BORDER};">Received</td>
                                  <td style="padding: 12px 12px; font-size: 13px; color: ${INK}; font-weight: 700; border-top: 1px solid ${BORDER};">${esc(createdAt)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>

                          <!-- Right: Message -->
                          <td style="vertical-align: top; padding-left: 12px;">
                            <div style="font-size: 12px; letter-spacing: 0.12em; color: ${MUTED}; text-transform: uppercase; margin-bottom: 8px;">
                              Message
                            </div>

                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="border: 1px solid ${BORDER}; border-radius: 12px; overflow: hidden;"
                            >
                              <tbody>
                                <tr>
                                  <td style="padding: 14px 14px; font-size: 14px; line-height: 22px; color: ${INK};">
                                    ${props.message ? nl2br(props.message) : '<span style="color:' + MUTED + ';">No message provided.</span>'}
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            ${
                              props.recaptchaToken
                                ? `
                                  <div style="margin-top: 10px; font-size: 11px; color: ${MUTED}; line-height: 16px;">
                                    reCAPTCHA token received (store/verify server-side):
                                    <span style="word-break: break-all;">${esc(props.recaptchaToken)}</span>
                                  </div>
                                `
                                : `
                                  <div style="margin-top: 10px; font-size: 11px; color: ${MUTED}; line-height: 16px;">
                                    reCAPTCHA token: <span style="color:${INK}; font-weight:600;">not provided</span>
                                  </div>
                                `
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 18px 24px 22px 24px;">
                    <div style="border-top: 1px solid ${BORDER}; padding-top: 14px; text-align: center;">
                      <div style="font-size: 12px; color: ${MUTED}; line-height: 18px;">
                        © ${new Date().getFullYear()} ${esc(COMPANY_NAME)}. All rights reserved.
                      </div>
                      <div style="font-size: 11px; color: ${MUTED}; line-height: 16px; margin-top: 6px;">
                        This is an internal notification generated from the Customer Service form.
                      </div>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;
};

export default customerServiceEmailHtml;
