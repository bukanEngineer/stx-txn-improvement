import { useState } from "react";
import { Button, Tag, PartnerLogo, useToast } from "prohellox-designsystem";
import type { TransactionRow, SwapTransactionRow, BankTransferRow, AdminTransferRow } from "../data/mockTransactions";
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
              <span className="mobile-swap-card__pair-value mobile-swap-card__pair-value--title">
                {row.type.replace(/Blockchain\s*/gi, "")}
              </span>
            </div>
            <span className="mobile-swap-card__total">
              {(row.totalAmount - row.fee).toLocaleString()} {row.currency}
            </span>
          </div>
          <div className="mobile-swap-card__body">
            <div className="mobile-swap-card__section">
              <span className="mobile-swap-card__label">Transaction ID</span>
              <span className="mobile-swap-card__value mobile-swap-card__id-link">
                {row.fullId}
              </span>
            </div>
            <div className="mobile-swap-card__section">
              <span className="mobile-swap-card__label">Transaction Date</span>
              <span className="mobile-swap-card__value">{row.date}</span>
            </div>
            <div className="mobile-swap-card__amounts">
              <div className="mobile-swap-card__section">
                <span className="mobile-swap-card__label">Wallet</span>
                <span className="mobile-swap-card__value txn-page__copy-cell">
                  {row.wallet.length > 12
                    ? row.wallet.slice(0, 6) + "…" + row.wallet.slice(-5)
                    : row.wallet}
                  <CopyButton value={row.wallet} />
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
            {!actionNeeded && (
              <div className="mobile-swap-card__status">
                <span className="mobile-swap-card__status-label">Status:</span>
                <Tag tone={row.status.tone} size="small" icon={undefined} onRemove={undefined} onClick={undefined}>
                  {row.status.label}
                </Tag>
              </div>
            )}
          </div>
          {actionNeeded && (
            <div className="mobile-swap-card__footer">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onConfirm(row);
                }}
              >
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
              <span className="mobile-swap-card__pair-value mobile-swap-card__pair-value--title">
                {row.type.replace(/Bank\s*/gi, "")}
              </span>
            </div>
            <span className="mobile-swap-card__total">
              {(row.totalAmount - row.fee).toLocaleString()} {row.currency}
            </span>
          </div>
          <div className="mobile-swap-card__body">
            <div className="mobile-swap-card__section">
              <span className="mobile-swap-card__label">Transaction ID</span>
              <span className="mobile-swap-card__value mobile-swap-card__id-link">
                {row.fullId}
              </span>
            </div>
            <div className="mobile-swap-card__section">
              <span className="mobile-swap-card__label">Transaction Date</span>
              <span className="mobile-swap-card__value">{row.date}</span>
            </div>
            <div className="mobile-swap-card__amounts">
              <div className="mobile-swap-card__section">
                <span className="mobile-swap-card__label">Bank Account</span>
                <span className="mobile-swap-card__value">
                  {row.bankName} - {row.accountNumber}
                </span>
              </div>
              <div className="mobile-swap-card__section">
                <span className="mobile-swap-card__label">Network</span>
                <span className="mobile-swap-card__value">{row.network}</span>
              </div>
            </div>
            {!actionNeeded && (
              <div className="mobile-swap-card__status">
                <span className="mobile-swap-card__status-label">Status:</span>
                <Tag tone={row.status.tone} size="small" icon={undefined} onRemove={undefined} onClick={undefined}>
                  {row.status.label}
                </Tag>
              </div>
            )}
          </div>
          {actionNeeded && (
            <div className="mobile-swap-card__footer">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onConfirm(row);
                }}
              >
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
        <article key={row.fullId} className="mobile-txn-card mobile-swap-card">
          <div className="mobile-swap-card__header">
            <div className="mobile-swap-card__pair">
              <span className="mobile-swap-card__pair-label">{showFullId ? "OTC from" : "Swap from"}</span>
              <span className="mobile-swap-card__pair-value">{row.fromCurrency} to {row.toCurrency}</span>
            </div>
            <span className="mobile-swap-card__total">
              {row.toAmount.toLocaleString()} {row.toCurrency}
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
                <span className="mobile-swap-card__label">Sell</span>
                <span className="mobile-swap-card__value">
                  {row.fromAmount.toLocaleString()} {row.fromCurrency}
                </span>
              </div>
              <div className="mobile-swap-card__section">
                <span className="mobile-swap-card__label">Rate</span>
                <span className="mobile-swap-card__value">
                  1 {row.fromCurrency} ≈ {row.rate} {row.toCurrency}
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
      <ListFooter hasMore={hasMore} loading={loading} onLoadMore={onLoadMore} endLabel={endLabel} />
    </div>
  );
}

interface AdminTransferListProps extends LoadMoreProps {
  rows: AdminTransferRow[];
  onSelect: (row: AdminTransferRow) => void;
}

export function AdminTransferMobileList({
  rows,
  onSelect,
  hasMore,
  loading,
  onLoadMore,
  endLabel,
}: AdminTransferListProps) {
  if (rows.length === 0) {
    return <div className="mobile-txn-list__empty">No transactions found.</div>;
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
              <span className="mobile-swap-card__pair-value mobile-swap-card__pair-value--title">
                Admin Transfer
              </span>
            </div>
            <span className="mobile-swap-card__total">
              {row.netAmount.toLocaleString()} {row.currency}
            </span>
          </div>
          <div className="mobile-swap-card__body">
            <div className="mobile-swap-card__section">
              <span className="mobile-swap-card__label">Transaction ID</span>
              <span className="mobile-swap-card__value mobile-swap-card__id-link">
                {row.fullId}
              </span>
            </div>
            <div className="mobile-swap-card__section">
              <span className="mobile-swap-card__label">Transaction Date</span>
              <span className="mobile-swap-card__value">{row.date}</span>
            </div>
            <div className="mobile-swap-card__section">
              <span className="mobile-swap-card__label">Details</span>
              <span className="mobile-swap-card__value">{row.details}</span>
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
      <ListFooter hasMore={hasMore} loading={loading} onLoadMore={onLoadMore} endLabel={endLabel} />
    </div>
  );
}
