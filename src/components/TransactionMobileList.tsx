import { useState } from "react";
import { Button, Tag, AssetMark, useToast } from "prohellox-designsystem";
import type { TransactionRow, SwapTransactionRow, BankTransferRow } from "../data/mockTransactions";
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
      className="txn-page__copy-btn"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy"}
    >
      <span className="material-symbols-rounded">
        {copied ? "check" : "content_copy"}
      </span>
    </button>
  );
}

interface LoadMoreProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  endLabel: string;
}

function ListFooter({ hasMore, loading, onLoadMore, endLabel }: LoadMoreProps) {
  return (
    <div className="mobile-txn-list__footer">
      {hasMore ? (
        <Button variant="secondary" size="sm" onClick={onLoadMore} disabled={loading}>
          {loading ? "Loading…" : "Load more"}
        </Button>
      ) : (
        <span className="mobile-txn-list__end">{endLabel}</span>
      )}
    </div>
  );
}

interface BlockchainListProps extends LoadMoreProps {
  rows: TransactionRow[];
  actionNeeded: boolean;
  onSelect: (row: TransactionRow) => void;
  onConfirm: (row: TransactionRow) => void;
}

export function BlockchainMobileList({
  rows,
  actionNeeded,
  onSelect,
  onConfirm,
  hasMore,
  loading,
  onLoadMore,
  endLabel,
}: BlockchainListProps) {
  if (rows.length === 0) {
    return <div className="mobile-txn-list__empty">No transactions found.</div>;
  }

  return (
    <div className="mobile-txn-list">
      {rows.map((row) => (
        <article key={row.fullId} className="mobile-txn-card">
          <div className="mobile-txn-card__header">
            <span className="txn-page__copy-cell">
              <button
                type="button"
                className="mobile-txn-card__id"
                onClick={() => onSelect(row)}
              >
                {row.id}
              </button>
              <CopyButton value={row.fullId} />
            </span>
            {!actionNeeded && (
              <Tag tone={row.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
                {row.status.label}
              </Tag>
            )}
          </div>
          <div className="mobile-txn-card__meta">
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Type</span>
              <span className="mobile-txn-card__value mobile-txn-card__value--bold">
                {row.type.replace(/Blockchain\s*/gi, "")}
              </span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Net Amount</span>
              <span className="mobile-txn-card__value mobile-txn-card__value--bold">
                {(row.totalAmount - row.fee).toLocaleString()} {row.currency}
              </span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Date</span>
              <span className="mobile-txn-card__value">{row.date}</span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Wallet</span>
              <span className="mobile-txn-card__value mobile-txn-card__value--mono txn-page__copy-cell">
                {row.wallet.length > 12
                  ? row.wallet.slice(0, 6) + "…" + row.wallet.slice(-5)
                  : row.wallet}
                <CopyButton value={row.wallet} />
              </span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Network</span>
              <span className="mobile-txn-card__value mobile-txn-card__network">
                <AssetMark asset={row.network} size={20} label={row.network.slice(0, 1)} color={undefined} children={undefined} />
                {row.network}
              </span>
            </div>
          </div>
          {actionNeeded && (
            <div className="mobile-txn-card__footer">
              <Button variant="secondary" size="sm" onClick={() => onConfirm(row)}>
                Confirm Deposit
              </Button>
            </div>
          )}
        </article>
      ))}
      <ListFooter hasMore={hasMore} loading={loading} onLoadMore={onLoadMore} endLabel={endLabel} />
    </div>
  );
}

interface BankListProps extends LoadMoreProps {
  rows: BankTransferRow[];
  actionNeeded: boolean;
  onSelect: (row: BankTransferRow) => void;
  onConfirm: (row: BankTransferRow) => void;
}

export function BankMobileList({
  rows,
  actionNeeded,
  onSelect,
  onConfirm,
  hasMore,
  loading,
  onLoadMore,
  endLabel,
}: BankListProps) {
  if (rows.length === 0) {
    return <div className="mobile-txn-list__empty">No transactions found.</div>;
  }

  return (
    <div className="mobile-txn-list">
      {rows.map((row) => (
        <article key={row.fullId} className="mobile-txn-card">
          <div className="mobile-txn-card__header">
            <span className="txn-page__copy-cell">
              <button
                type="button"
                className="mobile-txn-card__id"
                onClick={() => onSelect(row)}
              >
                {row.id}
              </button>
              <CopyButton value={row.fullId} />
            </span>
            {!actionNeeded && (
              <Tag tone={row.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
                {row.status.label}
              </Tag>
            )}
          </div>
          <div className="mobile-txn-card__meta">
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Type</span>
              <span className="mobile-txn-card__value mobile-txn-card__value--bold">
                {row.type.replace(/Bank\s*/gi, "")}
              </span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Net Amount</span>
              <span className="mobile-txn-card__value mobile-txn-card__value--bold">
                {(row.totalAmount - row.fee).toLocaleString()} {row.currency}
              </span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Date</span>
              <span className="mobile-txn-card__value">{row.date}</span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Bank Account</span>
              <span className="mobile-txn-card__value">
                {row.bankName} {row.accountNumber}
              </span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Network</span>
              <span className="mobile-txn-card__value">{row.network}</span>
            </div>
          </div>
          {actionNeeded && (
            <div className="mobile-txn-card__footer">
              <Button variant="secondary" size="sm" onClick={() => onConfirm(row)}>
                Confirm Transfer
              </Button>
            </div>
          )}
        </article>
      ))}
      <ListFooter hasMore={hasMore} loading={loading} onLoadMore={onLoadMore} endLabel={endLabel} />
    </div>
  );
}

interface SwapListProps extends LoadMoreProps {
  rows: SwapTransactionRow[];
  showFullId?: boolean;
}

export function SwapMobileList({
  rows,
  showFullId = false,
  hasMore,
  loading,
  onLoadMore,
  endLabel,
}: SwapListProps) {
  if (rows.length === 0) {
    return <div className="mobile-txn-list__empty">No transactions found.</div>;
  }

  return (
    <div className="mobile-txn-list">
      {rows.map((row) => (
        <article key={row.fullId} className="mobile-txn-card">
          <div className="mobile-txn-card__header">
            <span className="txn-page__copy-cell">
              <span className="mobile-txn-card__id-text">
                {showFullId
                  ? row.fullId
                  : `${row.fullId.slice(0, 11)}....${row.fullId.slice(-4)}`}
              </span>
              <CopyButton value={row.fullId} />
            </span>
            <Tag tone={row.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
              {row.status.label}
            </Tag>
          </div>
          <div className="mobile-txn-card__meta">
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Sell</span>
              <span className="mobile-txn-card__value">
                {row.fromAmount.toLocaleString()} {row.fromCurrency}
              </span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Buy</span>
              <span className="mobile-txn-card__value">
                {row.toAmount.toLocaleString()} {row.toCurrency}
              </span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Rate</span>
              <span className="mobile-txn-card__value">
                1 {row.fromCurrency} ≈ {row.rate} {row.toCurrency}
              </span>
            </div>
            <div className="mobile-txn-card__row">
              <span className="mobile-txn-card__label">Date</span>
              <span className="mobile-txn-card__value">{row.date}</span>
            </div>
          </div>
        </article>
      ))}
      <ListFooter hasMore={hasMore} loading={loading} onLoadMore={onLoadMore} endLabel={endLabel} />
    </div>
  );
}
