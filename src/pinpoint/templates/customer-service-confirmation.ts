// customer-service-confirmation.ts
// Customer Service submission confirmation (sent to the customer)
// HTML template only (no send function)
// Uses the same premium gold / clean card style as your other templates.

const logoUrl = 'https://nmrwback.vuztec.com/public/elite/product_logo_color.png';

const COMPANY_NAME = 'Elite Cashflow Products';
const SUPPORT_EMAIL = 'info@elitecashflowproducts.com';

// Theme
const ACCENT = '#C9A227';
const INK = '#111827';
const MUTED = '#6B7280';
const BG = '#F3F4F6';
const CARD = '#FFFFFF';
const BORDER = '#E5E7EB';

// Gold card palette
const GOLD_BG = '#FBF4D6';
const GOLD_BORDER = '#D6B24A';
const GOLD_LABEL = '#8A6E15';

export type CustomerServiceConfirmationPayload = {
  name?: string;
  email: string;
  subject?: string;
  ticketId?: string; // optional (if you generate one)
  createdAt?: Date | string; // optional
};

function esc(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function firstName(fullName?: string): string {
  const n = String(fullName ?? '').trim();
  return n ? n.split(/\s+/)[0] : 'there';
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

export const customerServiceConfirmationSubject = (p: CustomerServiceConfirmationPayload) => {
  const subj = (p.subject || '').trim();
  return subj ? `We received your request • ${subj}` : `We received your Customer Service request`;
};

export const customerServiceConfirmationHtml = (props: CustomerServiceConfirmationPayload) => {
  const createdAt = fmtDateTime(props.createdAt) || fmtDateTime(new Date());
  const fn = firstName(props.name);
  const subj = (props.subject || 'Customer Service request').trim();
  const ticketId = (props.ticketId || '').trim();

  const ticketRow = ticketId
    ? `
      <div style="margin-top: 10px; font-size: 13px; color: ${MUTED};">
        Reference: <span style="color:${INK}; font-weight:700;">${esc(ticketId)}</span>
      </div>
    `
    : '';

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(customerServiceConfirmationSubject(props))}</title>
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

                <!-- Header -->
                <tr>
                  <td style="padding: 24px 24px 16px 24px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody>
                        <tr>
                          <td align="left" valign="middle" style="width: 160px;">
                            <img
                              alt="${esc(COMPANY_NAME)}"
                              src="${esc(logoUrl)}"
                              width="120"
                              style="display:block; outline:none; border:none; text-decoration:none; height:auto;"
                            />
                          </td>

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
                              Request received
                            </div>

                            <div style="font-size: 12px; color: ${MUTED}; margin-top: 4px;">
                              ${esc(createdAt)}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>

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

                <!-- Body copy -->
                <tr>
                  <td style="padding: 0 24px 4px 24px;">
                    <div style="font-size: 14px; line-height: 22px; color: ${INK};">
                      Hi ${esc(fn)},
                    </div>
                    <div style="font-size: 14px; line-height: 22px; color: ${MUTED}; margin-top: 6px;">
                      Thank you for contacting ${esc(COMPANY_NAME)}. We have received your request and a support ticket has been created successfully.
                      Our team will review your message and get back to you as soon as possible.
                    </div>
                  </td>
                </tr>

                <!-- Highlight card -->
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
                              Your request
                            </div>

                            <div style="margin-top: 8px;">
                              <span style="font-size: 16px; font-weight: 900; color: #000000;">
                                ${esc(subj)}
                              </span>
                            </div>

                            ${ticketRow}

                            <div style="margin-top: 10px; font-size: 13px; color: #4B5563;">
                              If you need to add more details, reply to this email and we will attach your update to the same ticket.
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Support note -->
                <tr>
                  <td style="padding: 6px 24px 0 24px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody>
                        <tr>
                          <td style="vertical-align: top;">
                            <div style="font-size: 12px; letter-spacing: 0.12em; color: ${MUTED}; text-transform: uppercase; margin-bottom: 8px;">
                              Need help sooner?
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
                                  <td style="padding: 14px 14px; font-size: 13px; line-height: 20px; color: ${MUTED};">
                                    Please monitor your inbox (and spam/junk folder) for our response.
                                    If you have any urgent follow-up, email us at
                                    <span style="color:${INK}; font-weight:700;">${esc(SUPPORT_EMAIL)}</span>.
                                  </td>
                                </tr>
                              </tbody>
                            </table>

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
                        This is an automated confirmation that we received your Customer Service request.
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

export default customerServiceConfirmationHtml;
