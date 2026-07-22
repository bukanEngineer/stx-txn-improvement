import { useState } from "react";
import { Button, Tag, useToast } from "prohellox-designsystem";
import type { EarnTransactionRow } from "../data/mockEarnTransactions";
import "./MobileTxnList.css";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toast = useToast() as any;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.show({ title: "Copied!", message: "Copied to clipboard.", tone: "positive" });
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <button
      type="button"
      className="earn-page__copy-btn"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy"}
    >
      <span className="material-symbols-rounded">
        {copied ? "check" : "content_copy"}
      </span>
    </button>
  );
}

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
          className="mobile-txn-card mobile-txn-card--clickable"
          onClick={() => onSelect(row)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(row); }}
        >
          <div className="mobile-txn-card__header">
            <span className="earn-page__copy-cell">
              <span className="mobile-txn-card__id-text">{row.id}</span>
              <CopyButton value={row.fullId} />
            </span>
            <Tag tone={row.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
              {row.status.label}
            </Tag>
          </div>
          <div className="mobile-txn-card__meta">
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Type</span>
              <span className="mobile-txn-card__value">{row.type}</span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Net Amount</span>
              <span className="mobile-txn-card__value mobile-txn-card__value--bold">
                {row.netAmount.toLocaleString()} {row.currency}
              </span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Date</span>
              <span className="mobile-txn-card__value">{row.date}</span>
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
