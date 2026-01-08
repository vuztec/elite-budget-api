// order-notify.ts
// Internal notification email: "A client has placed an order"
// Sends to your team (and optionally CCs someone) when a subscription is purchased.

export type NotifyClient = {
  fullName?: string | null;
  email?: string | null;
  telephone?: string | null;
  company?: string | null;
};

export type NotifyCoupon =
  | { code: string; amountOff: number; percentOff?: never }
  | { code: string; percentOff: number; amountOff?: never };

export type NotifyOrder = {
  id?: string | number | null;
  invoiceNumber?: string | null;
  customInvoiceNo?: string | null; // e.g. "ECFP-INV-4235" - custom invoice number

  createdAt?: Date | string | null;

  currency?: string | null;
  subtotal: number;

  taxRate?: number | null; // e.g. 0.0825
  taxAmount?: number | null; // overrides taxRate if provided

  coupon?: NotifyCoupon | null;

  subscriptionName?: string | null; // default: "The Budget App Subscription"
  periodLabel?: string | null;

  // Optional
  paymentProvider?: string | null; // e.g. "Stripe"
  paymentStatus?: string | null; // e.g. "paid", "succeeded"
  payUrl?: string | null; // internal/admin link or hosted invoice link
};

const logoUrl = 'https://nmrwback.vuztec.com/public/elite/product_logo_color.png';

const COMPANY_NAME = 'Elite Cashflow Products';
const SUBJECT_PREFIX = 'NEW SUBSCRIPTION ORDER';
const SUPPORT_EMAIL = 'info@elitecashflowproducts.com'; // change if needed

// Brand accents
const ACCENT = '#C9A227';
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

function asDate(d?: Date | string | null): Date | null {
  if (!d) return null;
  const dt = d instanceof Date ? d : new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function fmtDateTime(d?: Date | string | null): string {
  const dt = asDate(d);
  if (!dt) return '';
  return dt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function money(amount: number, currency: string): string {
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

function computeDiscount(subtotal: number, coupon?: NotifyCoupon | null): number {
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

function computeTax(subtotalAfterDiscount: number, order: NotifyOrder): number {
  if (Number.isFinite(order.taxAmount ?? NaN) && (order.taxAmount as number) >= 0) {
    return order.taxAmount as number;
  }
  const r = Number.isFinite(order.taxRate ?? NaN) ? (order.taxRate as number) : 0;
  const rate = clamp(r, 0, 1);
  return subtotalAfterDiscount * rate;
}

export const orderNotifySubject = (order: NotifyOrder) => {
  const invoiceRef = order.customInvoiceNo || order.invoiceNumber || order.id;
  const inv = invoiceRef ? `Invoice ${invoiceRef}` : 'Order';
  return `${SUBJECT_PREFIX} • ${inv}`;
};

export const orderNotifyEmailHtml = (client: NotifyClient, order: NotifyOrder) => {
  const currency = (order.currency || 'USD').toUpperCase();

  const subtotal = Number(order.subtotal ?? 0) || 0;
  const discount = computeDiscount(subtotal, order.coupon ?? null);
  const subtotalAfterDiscount = Math.max(0, subtotal - discount);
  const tax = computeTax(subtotalAfterDiscount, order);
  const total = subtotalAfterDiscount + tax;

  const subscriptionName = esc(order.subscriptionName || 'The Budget App Subscription');
  const periodLabel = order.periodLabel ? esc(order.periodLabel) : '';
  const createdAt = fmtDateTime(order.createdAt ?? null) || '-';
  const displayInvoiceNumber = String(order.customInvoiceNo || order.invoiceNumber || order.id || '-');

  const couponRow =
    order.coupon && discount > 0
      ? `
        <tr>
          <td style="padding: 8px 0; color: ${MUTED}; font-size: 13px;">Coupon</td>
          <td style="padding: 8px 0; text-align: right; color: ${INK}; font-size: 13px;">
            ${esc(order.coupon.code)} ( - ${esc(money(discount, currency))} )
          </td>
        </tr>
      `
      : '';

  const metaLine = (label: string, value: string) => `
    <tr>
      <td style="padding: 8px 0; color:${MUTED}; font-size: 13px; width: 42%;">${esc(label)}</td>
      <td style="padding: 8px 0; color:${INK}; font-size: 13px; font-weight: 600;">${esc(value || '-')}</td>
    </tr>
  `;

  const cta = order.payUrl
    ? `
        <div style="margin-top: 14px;">
          <a
            href="${esc(order.payUrl)}"
            target="_blank"
            style="
              display:inline-block;
              background:${ACCENT};
              color:#111;
              text-decoration:none;
              font-weight:800;
              padding:10px 14px;
              border-radius:10px;
              border:1px solid rgba(17,24,39,0.12);
            "
          >
            View order / invoice
          </a>
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
    <title>${esc(orderNotifySubject(order))}</title>
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
                        <!-- Logo -->
                        <td
                            align="left"
                            valign="middle"
                            style="width: 160px;"
                        >
                            <img
                            alt="${esc(COMPANY_NAME)}"
                            src="${esc(logoUrl)}"
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

                        <!-- Title / Meta -->
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
                            ${esc(SUBJECT_PREFIX)}
                            </div>

                            <div
                            style="
                                font-size: 18px;
                                font-weight: 900;
                                color: ${INK};
                                line-height: 1.2;
                            "
                            >
                            ${
                              displayInvoiceNumber && displayInvoiceNumber !== '-'
                                ? `Invoice ${esc(displayInvoiceNumber)}`
                                : order.id
                                  ? `Order ${esc(order.id)}`
                                  : 'Order received'
                            }
                            </div>

                            <div
                            style="
                                font-size: 12px;
                                color: ${MUTED};
                                margin-top: 4px;
                            "
                            >
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

                <!-- Summary card -->
                <tr>
                  <td style="padding: 14px 22px 6px 22px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius: 14px; overflow: hidden;">
                      <tbody>
                        <tr>
                          <td style="background: #0B0F19; padding: 16px 16px;">
                            <div style="color: rgba(255,255,255,0.75); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;">
                              Amount (after tax & discount)
                            </div>
                            <div style="color: #FFFFFF; font-size: 26px; font-weight: 900; margin-top: 6px;">
                              ${esc(money(total, currency))}
                              <span style="font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.7); margin-left: 8px;">${esc(currency)}</span>
                            </div>
                            <div style="color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 6px;">
                              ${esc(subscriptionName)}${periodLabel ? ` • ${periodLabel}` : ''}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    ${cta}
                  </td>
                </tr>

                <!-- Client + Order details -->
                <tr>
                  <td style="padding: 10px 22px 18px 22px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody>
                        <tr>
                          <!-- Client -->
                          <td style="vertical-align: top; padding-right: 12px;">
                            <div style="font-size: 12px; letter-spacing: 0.12em; color: ${MUTED}; text-transform: uppercase; margin-bottom: 8px;">
                              Client
                            </div>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tbody>
                                ${metaLine('Name', client.fullName ? String(client.fullName) : '-')}
                                ${metaLine('Email', client.email ? String(client.email) : '-')}
                                ${metaLine('Telephone', client.telephone ? String(client.telephone) : '-')}
                                ${metaLine('Company', client.company ? String(client.company) : '-')}
                              </tbody>
                            </table>
                          </td>

                          <!-- Order -->
                          <td style="vertical-align: top; padding-left: 12px;">
                            <div style="font-size: 12px; letter-spacing: 0.12em; color: ${MUTED}; text-transform: uppercase; margin-bottom: 8px;">
                              Order
                            </div>

                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tbody>
                                ${metaLine('Invoice #', displayInvoiceNumber)}
                                ${metaLine('Payment provider', order.paymentProvider ? String(order.paymentProvider) : '-')}
                                ${metaLine('Payment status', order.paymentStatus ? String(order.paymentStatus) : '-')}
                              </tbody>
                            </table>

                            <div style="margin-top: 12px; border: 1px solid ${BORDER}; border-radius: 12px; padding: 12px;">
                              <div style="font-size: 12px; letter-spacing: 0.12em; color: ${MUTED}; text-transform: uppercase; margin-bottom: 8px;">
                                Totals breakdown
                              </div>

                              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                <tbody>
                                  <tr>
                                    <td style="padding: 8px 0; color: ${MUTED}; font-size: 13px;">Subtotal</td>
                                    <td style="padding: 8px 0; text-align: right; color: ${INK}; font-size: 13px;">${esc(money(subtotal, currency))}</td>
                                  </tr>

                                  ${couponRow}

                                  <tr>
                                    <td style="padding: 8px 0; color: ${MUTED}; font-size: 13px;">Tax</td>
                                    <td style="padding: 8px 0; text-align: right; color: ${INK}; font-size: 13px;">${esc(money(tax, currency))}</td>
                                  </tr>

                                  <tr>
                                    <td colspan="2" style="padding: 0;">
                                      <div style="height: 1px; background: ${BORDER}; margin: 8px 0;"></div>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td style="padding: 8px 0; color: ${INK}; font-size: 14px; font-weight: 900;">Total</td>
                                    <td style="padding: 8px 0; text-align: right; color: ${INK}; font-size: 14px; font-weight: 900;">${esc(money(total, currency))}</td>
                                  </tr>
                                </tbody>
                              </table>

                             
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 0 22px 22px 22px;">
                    <div style="padding-top: 14px; border-top: 1px solid ${BORDER}; font-size: 12px; color: ${MUTED}; text-align: center; line-height: 18px;">
                      © ${new Date().getFullYear()} ${esc(COMPANY_NAME)} • Internal order notification
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

export default orderNotifyEmailHtml;
