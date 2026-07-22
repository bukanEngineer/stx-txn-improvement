import { Tag, Icon, PartnerLogo, useToast } from "prohellox-designsystem";
import type { TransactionRow } from "../data/mockTransactions";
import "./TransactionDetailPage.css";

/** SVG flag/icon assets for cross-asset display */
const CURRENCY_ICONS: Record<string, { icon: string; label: string }> = {
  USD: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#1A47B8"/><path d="M10 0c1.46 0 2.85.31 4.1.88L10 2l4.1-1.12C15.74.32 14.93 0 14.1 0H10z" fill="#F93939"/><rect x="0" y="8" width="20" height="1.5" fill="white"/><rect x="0" y="10.5" width="20" height="1.5" fill="#F93939"/><rect x="0" y="5.5" width="20" height="1.5" fill="#F93939"/><rect x="0" y="3" width="20" height="1.5" fill="white"/><rect x="0" y="13" width="20" height="1.5" fill="white"/><rect x="0" y="15.5" width="20" height="1.5" fill="#F93939"/><rect x="0" y="0" width="9" height="9" fill="#1A47B8"/><circle cx="2.5" cy="2" r="0.4" fill="white"/><circle cx="4.5" cy="2" r="0.4" fill="white"/><circle cx="6.5" cy="2" r="0.4" fill="white"/><circle cx="3.5" cy="3.5" r="0.4" fill="white"/><circle cx="5.5" cy="3.5" r="0.4" fill="white"/><circle cx="2.5" cy="5" r="0.4" fill="white"/><circle cx="4.5" cy="5" r="0.4" fill="white"/><circle cx="6.5" cy="5" r="0.4" fill="white"/><circle cx="3.5" cy="6.5" r="0.4" fill="white"/><circle cx="5.5" cy="6.5" r="0.4" fill="white"/></svg>`,
    label: "USD",
  },
  SGD: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#F93939"/><path d="M0 10C0 4.477 4.477 0 10 0S20 4.477 20 10H0z" fill="#F93939"/><path d="M0 10c0 5.523 4.477 10 10 10s10-4.477 10-10H0z" fill="white"/><circle cx="5.5" cy="5.5" r="2.5" fill="white"/><circle cx="6" cy="5.5" r="2" fill="#F93939"/><path d="M5 3.2l.3.9h1l-.8.6.3.9-.8-.6-.8.6.3-.9-.8-.6h1l.3-.9z" fill="white" transform="translate(2.2, 0.8) scale(0.5)"/><path d="M5 3.2l.3.9h1l-.8.6.3.9-.8-.6-.8.6.3-.9-.8-.6h1l.3-.9z" fill="white" transform="translate(3.5, 1.5) scale(0.5)"/><path d="M5 3.2l.3.9h1l-.8.6.3.9-.8-.6-.8.6.3-.9-.8-.6h1l.3-.9z" fill="white" transform="translate(4.2, 2.8) scale(0.5)"/><path d="M5 3.2l.3.9h1l-.8.6.3.9-.8-.6-.8.6.3-.9-.8-.6h1l.3-.9z" fill="white" transform="translate(3.5, 4.1) scale(0.5)"/><path d="M5 3.2l.3.9h1l-.8.6.3.9-.8-.6-.8.6.3-.9-.8-.6h1l.3-.9z" fill="white" transform="translate(2.2, 4.8) scale(0.5)"/></svg>`,
    label: "SGD",
  },
  XUSD: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#0D4740"/><text x="10" y="13.5" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="sans-serif">X$</text></svg>`,
    label: "XUSD",
  },
  XSGD: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#0D4740"/><text x="10" y="13.5" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="sans-serif">XS</text></svg>`,
    label: "XSGD",
  },
};

interface TransactionDetailPageProps {
  transaction: TransactionRow;
  onBack: () => void;
}

export function TransactionDetailPage({ transaction, onBack }: TransactionDetailPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toast = useToast() as any;

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.fullId).then(() => {
      toast.show({ title: "Copied!", message: "Transaction ID copied to clipboard.", tone: "positive" });
    });
  };

  return (
    <div className="txn-detail">
      {/* Back link */}
      <button type="button" className="txn-detail__back" onClick={onBack}>
        <Icon name="arrow_back" size={20} color={undefined} style={undefined} />
        <span>Back to Transactions</span>
      </button>

      <div className="txn-detail__content">
        {/* Left: Transaction Details card */}
        <div className="txn-detail__card txn-detail__card--main">
          <div className="txn-detail__card-header">
            <h2 className="txn-detail__card-title">Transaction Details</h2>
            <Tag tone={transaction.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
              {transaction.status.label}
            </Tag>
          </div>

          <hr className="txn-detail__divider" />

          {/* Row 1: Transaction ID */}
          <div className="txn-detail__row">
            <div className="txn-detail__field">
              <span className="txn-detail__label">Transaction ID</span>
              <button
                type="button"
                className="txn-detail__value txn-detail__value--copy"
                onClick={handleCopyId}
              >
                {transaction.fullId}
                <Icon name="content_copy" size={20} color={undefined} style={undefined} />
              </button>
            </div>
          </div>

          {/* Row 2: Transaction Hash + Wallet Address */}
          <div className="txn-detail__row">
            <div className="txn-detail__field">
              <span className="txn-detail__label">Transaction Hash</span>
              <span className="txn-detail__value txn-detail__value--link">
                {transaction.hash.slice(0, 36) + "...."}
                {transaction.hash.slice(-5)}
              </span>
            </div>
            <div className="txn-detail__field">
              <span className="txn-detail__label">Wallet Address</span>
              <button
                type="button"
                className="txn-detail__value txn-detail__value--copy"
                onClick={() => {
                  navigator.clipboard.writeText(transaction.wallet).then(() => {
                    toast.show({ title: "Copied!", message: "Wallet address copied to clipboard.", tone: "positive" });
                  });
                }}
              >
                {transaction.wallet}
                <Icon name="content_copy" size={20} color={undefined} style={undefined} />
              </button>
            </div>
          </div>

          {/* Row 3: Transaction Type + Network */}
          <div className="txn-detail__row">
            <div className="txn-detail__field">
              <span className="txn-detail__label">Transaction Type</span>
              <span className="txn-detail__value">{transaction.type}</span>
            </div>
            <div className="txn-detail__field">
              <span className="txn-detail__label">Network</span>
              <span className="txn-detail__value" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <PartnerLogo name={transaction.network.toLowerCase()} size={20} style={undefined} />
                {transaction.network}
              </span>
            </div>
          </div>

          {/* Row 4: Transaction Date + Completed Date */}
          <div className="txn-detail__row">
            <div className="txn-detail__field">
              <span className="txn-detail__label">
                Transaction Date
                <Icon name="info" size={20} color={undefined} style={undefined} />
              </span>
              <span className="txn-detail__value">{transaction.date}</span>
            </div>
            <div className="txn-detail__field">
              <span className="txn-detail__label">
                Completed Date
                <Icon name="info" size={20} color={undefined} style={undefined} />
              </span>
              <span className="txn-detail__value">{transaction.date}</span>
            </div>
          </div>

          {/* Row 4: Details */}
          <div className="txn-detail__row">
            <div className="txn-detail__field">
              <span className="txn-detail__label">Details</span>
              <span className="txn-detail__value">-</span>
            </div>
          </div>
        </div>

        {/* Right: Amount Details card */}
        <div className="txn-detail__card txn-detail__card--amount">
          <h2 className="txn-detail__card-title">Amount Details</h2>

          {/* Cross Asset section - shown for SGD/USD Blockchain Transfer Out */}
          {transaction.sourceCurrency && (
            <div className="txn-detail__cross-asset">
              <div className="txn-detail__cross-asset-icons">
                <div className="txn-detail__cross-asset-currency">
                  <span
                    className="txn-detail__cross-asset-icon"
                    dangerouslySetInnerHTML={{ __html: CURRENCY_ICONS[transaction.sourceCurrency]?.icon ?? "" }}
                  />
                  <span className="txn-detail__cross-asset-label">
                    {transaction.sourceCurrency}
                  </span>
                </div>
                <Icon name="arrow_forward" size={18} color={undefined} style={undefined} />
                <div className="txn-detail__cross-asset-currency">
                  <span
                    className="txn-detail__cross-asset-icon"
                    dangerouslySetInnerHTML={{ __html: CURRENCY_ICONS[transaction.currency]?.icon ?? "" }}
                  />
                  <span className="txn-detail__cross-asset-label">
                    {transaction.currency}
                  </span>
                </div>
              </div>
              <p className="txn-detail__cross-asset-note">
                Your {transaction.sourceCurrency} is converted 1:1 to {transaction.currency}
              </p>
            </div>
          )}

          <div className="txn-detail__amount-rows">
            <div className="txn-detail__amount-row">
              <span className="txn-detail__amount-label">Total Amount</span>
              <span className="txn-detail__amount-value">
                {transaction.totalAmount.toLocaleString()} {transaction.currency}
              </span>
            </div>
            <div className="txn-detail__amount-row">
              <span className="txn-detail__amount-label">Fee</span>
              <span className="txn-detail__amount-value">
                {transaction.fee} {transaction.currency}
              </span>
            </div>

            <hr className="txn-detail__divider" />

            <div className="txn-detail__amount-row">
              <span className="txn-detail__amount-label">Net Amount</span>
              <span className="txn-detail__amount-value txn-detail__amount-value--bold">
                {(transaction.totalAmount - transaction.fee).toLocaleString()} {transaction.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Help guide */}
      <div className="txn-detail__guide">
        <Icon name="emoji_objects" size={20} color={undefined} style={undefined} />
        <span>
          Need help?{" "}
          <a href="#" className="txn-detail__guide-link">Learn more</a>
          {" "}about how payment transaction processing works.
        </span>
      </div>
    </div>
  );
}
