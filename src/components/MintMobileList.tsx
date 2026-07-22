import { useState } from "react";
import { Button, Tag, PartnerLogo, useToast } from "prohellox-designsystem";
import type { MintTransactionRow } from "../data/mockMintTransactions";
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
      className="mint-page__copy-btn"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy"}
    >
      <span className="material-symbols-rounded">
        {copied ? "check" : "content_copy"}
      </span>
    </button>
  );
}

interface MintMobileListProps {
  rows: MintTransactionRow[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  onSelect?: (row: MintTransactionRow) => void;
  endLabel: string;
}

export function MintMobileList({
  rows,
  hasMore,
  loading,
  onLoadMore,
  onSelect,
  endLabel,
}: MintMobileListProps) {
  if (rows.length === 0) {
    return <div className="mobile-txn-list__empty">No mint transactions found.</div>;
  }

  return (
    <div className="mobile-txn-list">
      {rows.map((row) => (
        <article key={row.fullId} className="mobile-txn-card" onClick={() => onSelect?.(row)} style={{ cursor: onSelect ? "pointer" : undefined }}>
          <div className="mobile-txn-card__header">
            <span className="mint-page__copy-cell">
              <span className="mobile-txn-card__id-text">{row.id}</span>
              <CopyButton value={row.fullId} />
            </span>
            <Tag tone={row.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
              {row.status.label}
            </Tag>
          </div>
          <div className="mobile-txn-card__meta">
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
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Wallet</span>
              <span className="mobile-txn-card__value mobile-txn-card__value--mono mint-page__copy-cell">
                {row.wallet.length > 12
                  ? row.wallet.slice(0, 6) + "…" + row.wallet.slice(-5)
                  : row.wallet}
                <CopyButton value={row.wallet} />
              </span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Network</span>
              <span className="mobile-txn-card__value mobile-txn-card__network">
                <PartnerLogo name={row.network.toLowerCase()} size={20} style={undefined} />
                {row.network}
              </span>
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
