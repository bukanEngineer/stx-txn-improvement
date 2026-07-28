import { Button, Tag } from "prohellox-designsystem";
import type { EarnTransactionRow } from "../data/mockEarnTransactions";
import "./MobileTxnList.css";

interface EarnMobileListProps {
  rows: EarnTransactionRow[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  endLabel: string;
  onSelect: (row: EarnTransactionRow) => void;
}

export function EarnMobileList({
  rows,
  hasMore,
  loading,
  onLoadMore,
  endLabel,
  onSelect,
}: EarnMobileListProps) {
  if (rows.length === 0) {
    return <div className="mobile-txn-list__empty">No earn transactions found.</div>;
  }

  return (
    <div className="mobile-txn-list">
      {rows.map((row) => (
        <article
          key={row.fullId}
          className="mobile-txn-card mobile-swap-card mobile-swap-card--clickable"
          onClick={() => onSelect(row)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSelect(row);
          }}
        >
          <div className="mobile-swap-card__header">
            <div className="mobile-swap-card__pair">
              <span className="mobile-swap-card__pair-label">Earn</span>
              <span className="mobile-swap-card__pair-value">{row.type}</span>
            </div>
            <span className="mobile-swap-card__total">
              {row.netAmount.toLocaleString()} {row.currency}
            </span>
          </div>
          <div className="mobile-swap-card__body">
            <div className="mobile-swap-card__section">
              <span className="mobile-swap-card__label">Transaction ID</span>
              <span className="mobile-swap-card__value">{row.fullId}</span>
            </div>
            <div className="mobile-swap-card__section">
              <span className="mobile-swap-card__label">Transaction Date</span>
              <span className="mobile-swap-card__value">{row.date}</span>
            </div>
            <div className="mobile-swap-card__amounts">
              <div className="mobile-swap-card__section">
                <span className="mobile-swap-card__label">Fee</span>
                <span className="mobile-swap-card__value">
                  {row.fee.toLocaleString()} {row.currency}
                </span>
              </div>
              <div className="mobile-swap-card__section">
                <span className="mobile-swap-card__label">Total Amount</span>
                <span className="mobile-swap-card__value">
                  {row.totalAmount.toLocaleString()} {row.currency}
                </span>
              </div>
            </div>
            <div className="mobile-swap-card__status">
              <span className="mobile-swap-card__status-label">Status:</span>
              <Tag tone={row.status.tone} size="small" icon={undefined} onRemove={undefined} onClick={undefined}>
                {row.status.label}
              </Tag>
            </div>
          </div>
        </article>
      ))}
      <div className="mobile-txn-list__footer">
        {hasMore ? (
          <Button variant="secondary" size="sm" onClick={onLoadMore} disabled={loading}>
            {loading ? "Loading…" : "Load more"}
          </Button>
        ) : (
          <span className="mobile-txn-list__end">{endLabel}</span>
        )}
      </div>
    </div>
  );
}
