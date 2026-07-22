import { Tag, Icon, useToast } from "prohellox-designsystem";
import type { EarnTransactionRow } from "../data/mockEarnTransactions";
import "./EarnDetailPage.css";

interface EarnDetailPageProps {
  transaction: EarnTransactionRow;
  onBack: () => void;
}

export function EarnDetailPage({ transaction, onBack }: EarnDetailPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toast = useToast() as any;

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.fullId).then(() => {
      toast.show({ title: "Copied!", message: "Transaction ID copied to clipboard.", tone: "positive" });
    });
  };

  return (
    <div className="earn-detail">
      {/* Back link */}
      <button type="button" className="earn-detail__back" onClick={onBack}>
        <Icon name="arrow_back" size={20} color={undefined} style={undefined} />
        <span>Back to Earn</span>
      </button>

      <div className="earn-detail__content">
        {/* Left: Transaction Details card */}
        <div className="earn-detail__card earn-detail__card--main">
          <div className="earn-detail__card-header">
            <h2 className="earn-detail__card-title">Transaction Details</h2>
            <Tag tone={transaction.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
              {transaction.status.label}
            </Tag>
          </div>

          <hr className="earn-detail__divider" />

          {/* Row 1: Transaction ID */}
          <div className="earn-detail__row">
            <div className="earn-detail__field">
              <span className="earn-detail__label">Transaction ID</span>
              <button
                type="button"
                className="earn-detail__value earn-detail__value--copy"
                onClick={handleCopyId}
              >
                {transaction.fullId}
                <Icon name="content_copy" size={20} color={undefined} style={undefined} />
              </button>
            </div>
          </div>

          {/* Row 2: Transaction Type + Transaction Date */}
          <div className="earn-detail__row">
            <div className="earn-detail__field">
              <span className="earn-detail__label">Transaction Type</span>
              <span className="earn-detail__value">{transaction.type}</span>
            </div>
            <div className="earn-detail__field">
              <span className="earn-detail__label">
                Transaction Date
                <Icon name="info" size={20} color={undefined} style={undefined} />
              </span>
              <span className="earn-detail__value">{transaction.date}</span>
            </div>
          </div>

          {/* Row 3: Completed Date */}
          <div className="earn-detail__row">
            <div className="earn-detail__field">
              <span className="earn-detail__label">
                Completed Date
                <Icon name="info" size={20} color={undefined} style={undefined} />
              </span>
              <span className="earn-detail__value">
                {transaction.status.label === "Completed" ? transaction.date : "-"}
              </span>
            </div>
          </div>

          {/* Row 4: Details */}
          <div className="earn-detail__row">
            <div className="earn-detail__field">
              <span className="earn-detail__label">Details</span>
              <span className="earn-detail__value">{transaction.details || "-"}</span>
            </div>
          </div>
        </div>

        {/* Right: Amount Details card */}
        <div className="earn-detail__card earn-detail__card--amount">
          <h2 className="earn-detail__card-title">Amount Details</h2>

          <div className="earn-detail__amount-rows">
            <div className="earn-detail__amount-row">
              <span className="earn-detail__amount-label">Total Amount</span>
              <span className="earn-detail__amount-value">
                {transaction.totalAmount.toLocaleString()} {transaction.currency}
              </span>
            </div>
            <div className="earn-detail__amount-row">
              <span className="earn-detail__amount-label">Fee</span>
              <span className="earn-detail__amount-value">
                {transaction.fee} {transaction.currency}
              </span>
            </div>

            <hr className="earn-detail__divider" />

            <div className="earn-detail__amount-row">
              <span className="earn-detail__amount-label">Net Amount</span>
              <span className="earn-detail__amount-value earn-detail__amount-value--bold">
                {transaction.netAmount.toLocaleString()} {transaction.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Help guide */}
      <div className="earn-detail__guide">
        <Icon name="emoji_objects" size={20} color={undefined} style={undefined} />
        <span>
          Need help?{" "}
          <a href="#" className="earn-detail__guide-link">Learn more</a>
          {" "}about how Earn rewards work.
        </span>
      </div>
    </div>
  );
}
