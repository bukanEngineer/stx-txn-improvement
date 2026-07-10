import { Tag, Icon, useToast } from "prohellox-designsystem";
import type { SwapTransactionRow } from "../data/mockTransactions";
import "./TransactionDetailPage.css";

interface SwapDetailPageProps {
  transaction: SwapTransactionRow;
  onBack: () => void;
}

export function SwapDetailPage({ transaction, onBack }: SwapDetailPageProps) {
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

          {/* Row 2: Transaction Date */}
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

          {/* Row 3: Sell + Buy */}
          <div className="txn-detail__row">
            <div className="txn-detail__field">
              <span className="txn-detail__label">Sell</span>
              <span className="txn-detail__value">{transaction.fromAmount.toLocaleString()} {transaction.fromCurrency}</span>
            </div>
            <div className="txn-detail__field">
              <span className="txn-detail__label">Buy</span>
              <span className="txn-detail__value">{transaction.toAmount.toLocaleString()} {transaction.toCurrency}</span>
            </div>
          </div>

          {/* Row 4: Rate */}
          <div className="txn-detail__row">
            <div className="txn-detail__field">
              <span className="txn-detail__label">Rate</span>
              <span className="txn-detail__value">1 {transaction.fromCurrency} ≈ {transaction.rate} {transaction.toCurrency}</span>
            </div>
          </div>
        </div>

        {/* Right: Amount Details card */}
        <div className="txn-detail__card txn-detail__card--amount">
          <h2 className="txn-detail__card-title">Amount Details</h2>

          <div className="txn-detail__amount-rows">
            <div className="txn-detail__amount-row">
              <span className="txn-detail__amount-label">Sell Amount</span>
              <span className="txn-detail__amount-value">
                {transaction.fromAmount.toLocaleString()} {transaction.fromCurrency}
              </span>
            </div>
            <div className="txn-detail__amount-row">
              <span className="txn-detail__amount-label">Rate</span>
              <span className="txn-detail__amount-value">
                1 {transaction.fromCurrency} ≈ {transaction.rate} {transaction.toCurrency}
              </span>
            </div>

            <hr className="txn-detail__divider" />

            <div className="txn-detail__amount-row">
              <span className="txn-detail__amount-label">Buy Amount</span>
              <span className="txn-detail__amount-value txn-detail__amount-value--bold">
                {transaction.toAmount.toLocaleString()} {transaction.toCurrency}
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
