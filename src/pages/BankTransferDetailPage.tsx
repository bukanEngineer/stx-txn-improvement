import { Tag, Icon, useToast } from "prohellox-designsystem";
import type { BankTransferRow } from "../data/mockTransactions";
import "./TransactionDetailPage.css";

interface BankTransferDetailPageProps {
  transaction: BankTransferRow;
  onBack: () => void;
}

export function BankTransferDetailPage({ transaction, onBack }: BankTransferDetailPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toast = useToast() as any;

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.fullId).then(() => {
      toast.show({ title: "Copied!", message: "Transaction ID copied to clipboard.", tone: "positive" });
    });
  };

  const isTransferIn = transaction.type === "Bank Transfer In";

  return (
    <div className="txn-detail">
      {/* Back link */}
      <button type="button" className="txn-detail__back" onClick={onBack}>
        <Icon name="arrow_back" size={20} color={undefined} style={undefined} />
        <span>Back to Transactions</span>
      </button>

      <div className="txn-detail__content">
        {/* Left column: Sender/Recipient + Transaction Details */}
        <div className="txn-detail__left-col">
          {/* Sender/Recipient Details card */}
          <div className="txn-detail__card txn-detail__card--main">
            <h2 className="txn-detail__card-title">
              {isTransferIn ? "Sender Details" : "Recipient Details"}
            </h2>

            <hr className="txn-detail__divider" />

            <div className="txn-detail__row txn-detail__row--four-col">
              <div className="txn-detail__field">
                <span className="txn-detail__label">
                  {isTransferIn ? "Sender Name" : "Recipient Name"}
                </span>
                <span className="txn-detail__value">{transaction.accountName}</span>
              </div>
              <div className="txn-detail__field">
                <span className="txn-detail__label">Bank Name</span>
                <span className="txn-detail__value">{transaction.bankName}</span>
              </div>
              <div className="txn-detail__field">
                <span className="txn-detail__label">SWIFT Code</span>
                <span className="txn-detail__value">
                  {transaction.swiftCode || "-"}
                </span>
              </div>
              <div className="txn-detail__field">
                <span className="txn-detail__label">Bank Account No.</span>
                <span className="txn-detail__value">{transaction.accountNumber}</span>
              </div>
            </div>
          </div>

          {/* Transaction Details card */}
          <div className="txn-detail__card txn-detail__card--main">
            <div className="txn-detail__card-header">
              <h2 className="txn-detail__card-title">Transaction Details</h2>
              <Tag tone={transaction.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
                {transaction.status.label}
              </Tag>
            </div>

            <hr className="txn-detail__divider" />

            {/* Transaction ID (full row) */}
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

            {/* Transaction Type + Network */}
            <div className="txn-detail__row">
              <div className="txn-detail__field">
                <span className="txn-detail__label">Transaction Type</span>
                <span className="txn-detail__value">{transaction.type}</span>
              </div>
              <div className="txn-detail__field">
                <span className="txn-detail__label">Network</span>
                <span className="txn-detail__value">{transaction.network}</span>
              </div>
            </div>

            {/* Transaction Date + Completed Date */}
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

            {/* Details */}
            <div className="txn-detail__row">
              <div className="txn-detail__field">
                <span className="txn-detail__label">Details</span>
                <span className="txn-detail__value">-</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Amount Details card */}
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
