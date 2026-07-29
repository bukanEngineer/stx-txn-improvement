import { Tag, Icon, useToast } from "prohellox-designsystem";
import type { AdminTransferRow } from "../data/mockTransactions";
import "./TransactionDetailPage.css";

interface AdminTransferDetailPageProps {
  transaction: AdminTransferRow;
  onBack: () => void;
}

export function AdminTransferDetailPage({ transaction, onBack }: AdminTransferDetailPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toast = useToast() as any;

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.fullId).then(() => {
      toast.show({ title: "Copied!", message: "Transaction ID copied to clipboard.", tone: "positive" });
    });
  };

  return (
    <div className="txn-detail">
      <button type="button" className="txn-detail__back" onClick={onBack}>
        <Icon name="arrow_back" size={20} color={undefined} style={undefined} />
        <span>Back to Transactions</span>
      </button>

      <div className="txn-detail__content">
        <div className="txn-detail__card txn-detail__card--main">
          <div className="txn-detail__card-header">
            <h2 className="txn-detail__card-title">Transaction Details</h2>
            <Tag tone={transaction.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
              {transaction.status.label}
            </Tag>
          </div>

          <hr className="txn-detail__divider" />

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
              <span className="txn-detail__value">
                {transaction.status.label === "Completed" ? transaction.date : "-"}
              </span>
            </div>
          </div>

          <div className="txn-detail__row">
            <div className="txn-detail__field">
              <span className="txn-detail__label">Details</span>
              <span className="txn-detail__value">{transaction.details}</span>
            </div>
          </div>
        </div>

        <div className="txn-detail__card txn-detail__card--amount">
          <h2 className="txn-detail__card-title">Amount Details</h2>

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
                {transaction.netAmount.toLocaleString()} {transaction.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

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
