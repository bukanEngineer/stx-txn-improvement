import { Button, Tag, PartnerLogo } from "prohellox-designsystem";
import type { MintTransactionRow } from "../data/mockMintTransactions";
import "./MobileTxnList.css";

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
        <article
          key={row.fullId}
          className={`mobile-txn-card mobile-swap-card${onSelect ? " mobile-swap-card--clickable" : ""}`}
          onClick={onSelect ? () => onSelect(row) : undefined}
          role={onSelect ? "button" : undefined}
          tabIndex={onSelect ? 0 : undefined}
          onKeyDown={
            onSelect
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") onSelect(row);
                }
              : undefined
          }
        >
          <div className="mobile-swap-card__header">
            <div className="mobile-swap-card__pair">
              <span className="mobile-swap-card__pair-label">Mint from</span>
              <span className="mobile-swap-card__pair-value">
                {row.sourceCurrency} to {row.currency}
              </span>
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
                <span className="mobile-swap-card__label">Wallet</span>
                <span className="mobile-swap-card__value">
                  {row.wallet.length > 12
                    ? row.wallet.slice(0, 6) + "…" + row.wallet.slice(-5)
                    : row.wallet}
                </span>
              </div>
              <div className="mobile-swap-card__section">
                <span className="mobile-swap-card__label">Network</span>
                <span className="mobile-swap-card__value mobile-swap-card__value--inline">
                  <PartnerLogo name={row.network.toLowerCase()} size={20} style={undefined} />
                  {row.network}
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
