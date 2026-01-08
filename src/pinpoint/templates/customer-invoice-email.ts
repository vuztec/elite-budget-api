// invoice.ts
// Beautiful, responsive Invoice Email (Elite Cashflow Products)
// Usage: invoiceEmailHtml(client, order)
//
// Notes:
// - Uses table-based layout for maximum email-client compatibility
// - Escapes user-provided strings to avoid HTML injection
// - Computes: Total + Tax - Coupon Discount = Amount Due
// - Supports fixed or percent coupons
//
// You can safely customize COMPANY_* constants below (address, support email, etc.)

export type InvoiceClient = {
  fullName?: string | null;
  email?: string | null;
  billingAddressLine1?: string | null;
  billingAddressLine2?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingPostalCode?: string | null;
  billingCountry?: string | null;
};

export type InvoiceCoupon =
  | {
      code: string;
      // fixed discount (e.g. 10.00)
      amountOff: number;
      percentOff?: never;
    }
  | {
      code: string;
      // percent discount (e.g. 15 for 15%)
      percentOff: number;
      amountOff?: never;
    };

export type InvoiceOrder = {
  invoiceNumber: string; // e.g. "VLGXKVCF-0019"
  issuedAt?: Date | string | null;
  dueAt?: Date | string | null;

  // Core amounts (pre-tax)
  subtotal: number; // e.g. subscription price before tax and discounts
  currency?: string | null; // e.g. "USD"

  // Tax
  taxRate?: number | null; // e.g. 0.0825 (8.25%)
  taxAmount?: number | null; // if provided, overrides computed taxRate

  // Coupon (optional)
  coupon?: InvoiceCoupon | null;

  // Optional: payment / invoice link (CTA)
  payUrl?: string | null;

  // Optional: helpful metadata
  subscriptionName?: string | null; // default: "The Budget App Subscription"
  periodLabel?: string | null; // e.g. "Nov 2025 – Dec 2025"
};

const logoUrl = 'https://nmrwback.vuztec.com/public/elite/product_logo_color.png';

const COMPANY_NAME = 'Elite Cashflow Products';
const COMPANY_ADDRESS_LINES = ['Bishop Ranch 3', '2603 Camino Ramon, Suite 200', 'San Ramon, CA 94583', 'USA'];
const SUPPORT_EMAIL = 'support@elitecashflowproducts.com'; // change if needed

// Brand accents (gold + clean neutrals to match your references)
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

function firstName(fullName?: string | null): string {
  const n = String(fullName ?? '').trim();
  return n ? n.split(/\s+/)[0] : 'there';
}

function asDate(d?: Date | string | null): Date | null {
  if (!d) return null;
  const dt = d instanceof Date ? d : new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function fmtDate(d?: Date | string | null): string {
  const dt = asDate(d);
  if (!dt) return '';
  // Email-friendly long date (no timezone ambiguity for most invoices)
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
}

function money(amount: number, currency: string): string {
  // Defensive rounding for display
  const val = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function computeDiscount(subtotal: number, coupon?: InvoiceCoupon | null): number {
  if (!coupon) return 0;

  if ('amountOff' in coupon && Number.isFinite(coupon.amountOff)) {
    return clamp(coupon.amountOff, 0, subtotal);
  }
  if ('percentOff' in coupon && Number.isFinite(coupon.percentOff)) {
    const pct = clamp(coupon.percentOff, 0, 100);
    return clamp((subtotal * pct) / 100, 0, subtotal);
  }
  return 0;
}

function computeTax(subtotalAfterDiscount: number, order: InvoiceOrder): number {
  if (Number.isFinite(order.taxAmount ?? NaN) && (order.taxAmount as number) >= 0) {
    return order.taxAmount as number;
  }
  const r = Number.isFinite(order.taxRate ?? NaN) ? (order.taxRate as number) : 0;
  const rate = clamp(r, 0, 1);
  return subtotalAfterDiscount * rate;
}

export const invoiceEmailSubject = (order: InvoiceOrder) => `Invoice ${order.invoiceNumber} • ${COMPANY_NAME}`;

export const invoiceEmailHtml = (client: InvoiceClient, order: InvoiceOrder) => {
  const currency = (order.currency || 'USD').toUpperCase();

  const issued = fmtDate(order.issuedAt ?? null);
  const due = fmtDate(order.dueAt ?? order.issuedAt ?? null);

  const rawSubtotal = Number(order.subtotal ?? 0) || 0;

  const discount = computeDiscount(rawSubtotal, order.coupon ?? null);
  const subtotalAfterDiscount = Math.max(0, rawSubtotal - discount);

  const tax = computeTax(subtotalAfterDiscount, order);
  const total = subtotalAfterDiscount + tax;
  const amountDue = total; // you can extend later for partial payments, credits, etc.

  const couponLine =
    order.coupon && discount > 0
      ? `
        <tr>
          <td style="padding: 10px 0; color: ${MUTED}; font-size: 14px;">Coupon (${esc(order.coupon.code)})</td>
          <td style="padding: 10px 0; text-align: right; color: ${INK}; font-size: 14px;">- ${esc(money(discount, currency))}</td>
        </tr>
      `
      : '';

  const subscriptionName = esc(order.subscriptionName || 'The Budget App Subscription');
  const periodLabel = order.periodLabel ? esc(order.periodLabel) : '';

  const payCta = order.payUrl
    ? `
        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top: 18px;">
          <tbody>
            <tr>
              <td align="center">
                <a
                  href="${esc(order.payUrl)}"
                  target="_blank"
                  style="
                    display: inline-block;
                    background: ${ACCENT};
                    color: #111;
                    text-decoration: none;
                    font-weight: 700;
                    padding: 12px 18px;
                    border-radius: 10px;
                    letter-spacing: 0.2px;
                    border: 1px solid rgba(17,24,39,0.12);
                  "
                >
                  Pay online
                </a>
                <div style="font-size: 12px; color: ${MUTED}; margin-top: 10px;">
                  If the button does not work, copy and paste this link into your browser:<br />
                  <span style="word-break: break-all;">${esc(order.payUrl)}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `
    : '';

  // Client “Bill to” block
  const billToLines: string[] = [];
  if (client.fullName) billToLines.push(esc(client.fullName));
  if (client.email) billToLines.push(esc(client.email));

  const addrParts = [
    client.billingAddressLine1,
    client.billingAddressLine2,
    [client.billingCity, client.billingState].filter(Boolean).join(', ') || null,
    client.billingPostalCode,
    client.billingCountry,
  ]
    .filter(Boolean)
    .map((x) => esc(x));

  billToLines.push(...addrParts);

  const billToHtml = billToLines.length
    ? billToLines.map((l) => `<div style="margin: 0 0 4px 0;">${l}</div>`).join('')
    : `<div style="margin: 0 0 4px 0; color: ${MUTED};">Client details unavailable</div>`;

  const invoiceMetaRow = (label: string, value: string) => `
    <div style="display: flex; gap: 10px; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed ${BORDER};">
      <div style="color: ${MUTED}; font-size: 13px;">${esc(label)}</div>
      <div style="color: ${INK}; font-size: 13px; font-weight: 600;">${esc(value || '-')}</div>
    </div>
  `;

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(invoiceEmailSubject(order))}</title>
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
                  <td style="padding: 24px 24px 18px 24px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody>
                        <tr>
                          <!-- Logo -->
                          <td
                            align="left"
                            valign="middle"
                            style="width: 160px;"
                          >
                            <img
                              src="${esc(logoUrl)}"
                              alt="${esc(COMPANY_NAME)}"
                              width="120"
                              style="
                                display:block;
                                outline:none;
                                border:none;
                                text-decoration:none;
                                height:auto;
                              "
                            />
                          </td>

                          <!-- Invoice Meta -->
                          <td
                            align="right"
                            valign="middle"
                            style="padding-left: 12px;"
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
                              Invoice
                            </div>

                            <div
                              style="
                                font-size: 18px;
                                font-weight: 900;
                                color: ${INK};
                                line-height: 1.2;
                              "
                            >
                              ${esc(order.invoiceNumber)}
                            </div>

                            <div
                              style="
                                font-size: 12px;
                                color: ${MUTED};
                                margin-top: 4px;
                              "
                            >
                              Issued ${esc(issued || '-')}<br />
                              Due ${esc(due || '-')}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Gold divider -->
                    <div
                      style="
                        margin-top: 16px;
                        height: 3px;
                        background: linear-gradient(90deg, ${ACCENT}, rgba(201,162,39,0.2));
                        border-radius: 999px;
                      "
                    ></div>
                  </td>
                </tr>

                <!-- Intro + Bill To -->
                <tr>
                  <td style="padding: 10px 22px 0 22px;">
                    <div style="font-size: 15px; line-height: 22px; color: ${INK};">
                      Hi ${esc(firstName(client.fullName))},
                    </div>
                    <div style="font-size: 14px; line-height: 22px; color: ${MUTED}; margin-top: 6px;">
                      Thank you for your subscription purchase. Below is your invoice for <b style="color:${INK};">${subscriptionName}</b>${periodLabel ? ` <span style="color:${MUTED};">(${periodLabel})</span>` : ''}.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 16px 22px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody>
                        <tr>
                          <!-- From -->
                          <td style="vertical-align: top; padding-right: 12px;">
                            <div style="font-size: 12px; letter-spacing: 0.12em; color: ${MUTED}; text-transform: uppercase; margin-bottom: 8px;">From</div>
                            <div style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">${esc(COMPANY_NAME)}</div>
                            <div style="font-size: 13px; color: ${MUTED}; line-height: 18px;">
                              ${COMPANY_ADDRESS_LINES.map((l) => esc(l)).join('<br />')}
                              <br /><br />
                              <span style="color:${INK}; font-weight:600;">Support:</span> ${esc(SUPPORT_EMAIL)}
                            </div>
                          </td>

                          <!-- Bill To -->
                          <td style="vertical-align: top; padding-left: 12px;">
                            <div style="font-size: 12px; letter-spacing: 0.12em; color: ${MUTED}; text-transform: uppercase; margin-bottom: 8px;">Bill to</div>
                            <div style="font-size: 13px; color: ${INK}; line-height: 18px;">
                              ${billToHtml}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Amount Due highlight -->
                <tr>
                  <td style="padding: 0 22px 10px 22px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius: 14px; overflow: hidden;">
                      <tbody>
                        <tr>
                          <td style="background: #0B0F19; padding: 18px 18px;">
                            <div style="color: rgba(255,255,255,0.75); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;">
                              Amount due
                            </div>
                            <div style="color: #FFFFFF; font-size: 28px; font-weight: 900; margin-top: 6px;">
                              ${esc(money(amountDue, currency))}
                              <span style="font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.7); margin-left: 8px;">${esc(currency)}</span>
                            </div>
                            <div style="color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 6px;">
                              Due ${esc(due || issued || 'upon receipt')}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    ${payCta}
                  </td>
                </tr>

                <!-- Line items -->
                <tr>
                  <td style="padding: 10px 22px 0 22px;">
                    <div style="font-size: 12px; letter-spacing: 0.12em; color: ${MUTED}; text-transform: uppercase; margin-bottom: 10px;">
                      Invoice details
                    </div>

                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border: 1px solid ${BORDER}; border-radius: 12px; overflow: hidden;">
                      <thead>
                        <tr>
                          <th align="left" style="background: #FAFAFA; padding: 12px 12px; font-size: 12px; color: ${MUTED}; border-bottom: 1px solid ${BORDER};">
                            Description
                          </th>
                          <th align="right" style="background: #FAFAFA; padding: 12px 12px; font-size: 12px; color: ${MUTED}; border-bottom: 1px solid ${BORDER};">
                            Qty
                          </th>
                          <th align="right" style="background: #FAFAFA; padding: 12px 12px; font-size: 12px; color: ${MUTED}; border-bottom: 1px solid ${BORDER};">
                            Unit price
                          </th>
                          <th align="right" style="background: #FAFAFA; padding: 12px 12px; font-size: 12px; color: ${MUTED}; border-bottom: 1px solid ${BORDER};">
                            Amount
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td style="padding: 12px 12px; font-size: 14px; color: ${INK}; border-bottom: 1px solid ${BORDER};">
                            <div style="font-weight: 700;">${subscriptionName}</div>
                            <div style="font-size: 12px; color: ${MUTED}; margin-top: 4px;">
                              Subscription purchase${periodLabel ? ` • ${periodLabel}` : ''}
                            </div>
                          </td>
                          <td align="right" style="padding: 12px 12px; font-size: 14px; color: ${INK}; border-bottom: 1px solid ${BORDER};">1</td>
                          <td align="right" style="padding: 12px 12px; font-size: 14px; color: ${INK}; border-bottom: 1px solid ${BORDER};">${esc(money(rawSubtotal, currency))}</td>
                          <td align="right" style="padding: 12px 12px; font-size: 14px; color: ${INK}; border-bottom: 1px solid ${BORDER};">${esc(money(rawSubtotal, currency))}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Totals -->
                <tr>
                  <td style="padding: 14px 22px 6px 22px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody>
                        <tr>
                          <td style="vertical-align: top;">
                            <div style="font-size: 12px; color: ${MUTED}; line-height: 18px;">
                              Need help? Contact <span style="color:${INK}; font-weight:600;">${esc(SUPPORT_EMAIL)}</span>.
                            </div>
                          </td>

                          <td align="right" style="vertical-align: top; min-width: 280px;">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border: 1px solid ${BORDER}; border-radius: 12px; overflow: hidden;">
                              <tbody>
                                <tr>
                                  <td style="padding: 14px 14px;">
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td style="padding: 10px 0; color: ${MUTED}; font-size: 14px;">Subtotal</td>
                                          <td style="padding: 10px 0; text-align: right; color: ${INK}; font-size: 14px;">${esc(money(rawSubtotal, currency))}</td>
                                        </tr>

                                        ${couponLine}

                                        <tr>
                                          <td style="padding: 10px 0; color: ${MUTED}; font-size: 14px;">Tax</td>
                                          <td style="padding: 10px 0; text-align: right; color: ${INK}; font-size: 14px;">${esc(money(tax, currency))}</td>
                                        </tr>

                                        <tr>
                                          <td colspan="2" style="padding: 0;">
                                            <div style="height: 1px; background: ${BORDER}; margin: 8px 0;"></div>
                                          </td>
                                        </tr>

                                        <tr>
                                          <td style="padding: 10px 0; color: ${INK}; font-size: 15px; font-weight: 800;">
                                            Amount Due
                                          </td>
                                          <td style="padding: 10px 0; text-align: right; color: ${INK}; font-size: 15px; font-weight: 900;">
                                            ${esc(money(amountDue, currency))}
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
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 10px 22px 22px 22px;">
                    <div style="margin-top: 10px; padding-top: 14px; border-top: 1px solid ${BORDER};">
                      <div style="font-size: 12px; color: ${MUTED}; line-height: 18px; text-align: center;">
                        © ${new Date().getFullYear()} ${esc(COMPANY_NAME)}. All rights reserved.
                        <br />
                        This is an automated message related to your subscription purchase.
                      </div>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>

            <div style="max-width: 720px; margin: 10px auto 0 auto; font-size: 11px; color: ${MUTED}; text-align: center; line-height: 16px;">
              For security, do not share payment links publicly.
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;
};

export default invoiceEmailHtml;
