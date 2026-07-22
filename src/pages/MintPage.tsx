import { useState, useMemo, useCallback } from "react";
import {
  PageTitle,
  Button,
  Input,
  Table,
  Tag,
  Icon,
  Badge,
  AssetMark,
  Modal,
  MultiSelect,
  DateInput,
  useToast,
} from "prohellox-designsystem";
import { MOCK_MINT_TRANSACTIONS } from "../data/mockMintTransactions";
import type { MintTransactionRow } from "../data/mockMintTransactions";
import { useIsMobile } from "../hooks/useMediaQuery";
import { MintMobileList } from "../components/MintMobileList";
import "./MintPage.css";

/* ─── Mint Banner ─── */
function MintBanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="mint-banner">
      <button type="button" className="mint-banner__close" onClick={onClose} aria-label="Close banner">
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="mint-banner__content">
        <p className="mint-banner__title">Instantly convert funds into stablecoins</p>
        <p className="mint-banner__subtitle">
          Setup once, receive stablecoin instantly in your blockchain wallet.{" "}
          <a href="#" className="mint-banner__link">Learn More</a>
        </p>
      </div>
      <div className="mint-banner__steps">
        <p className="mint-banner__steps-label">How it works:</p>
        <div className="mint-banner__steps-row">
          <div className="mint-banner__step">
            <span className="material-symbols-rounded mint-banner__step-icon">wallet</span>
            <span className="mint-banner__step-text">Select asset and destination</span>
          </div>
          <span className="material-symbols-rounded mint-banner__step-arrow">arrow_right_alt</span>
          <div className="mint-banner__step">
            <span className="material-symbols-rounded mint-banner__step-icon">payments</span>
            <span className="mint-banner__step-text">Transfer funds to provided account details</span>
          </div>
          <span className="material-symbols-rounded mint-banner__step-arrow">arrow_right_alt</span>
          <div className="mint-banner__step">
            <span className="material-symbols-rounded mint-banner__step-icon">currency_exchange</span>
            <span className="mint-banner__step-text">Receive stablecoin in your wallet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Destination Wallet Card ─── */
function DestinationWallet() {
  return (
    <div className="dest-wallet">
      <div className="dest-wallet__header">
        <div className="dest-wallet__header-text">
          <h3 className="dest-wallet__title">Destination Wallet</h3>
          <p className="dest-wallet__subtitle">Your funds will be automatically converted 1:1 and sent to this wallet</p>
        </div>
        <button type="button" className="dest-wallet__setup-btn">
          Set Up
          <span className="material-symbols-rounded">add</span>
        </button>
      </div>
      <div className="dest-wallet__item">
        <div className="dest-wallet__item-info">
          <div className="dest-wallet__wallet-name">
            <span className="dest-wallet__wallet-label">Wallet XYZ</span>
            <AssetMark asset="Metamask" size={20} label="M" color={undefined} children={undefined} />
          </div>
          <div className="dest-wallet__wallet-address">
            <span>0xdac17f958d2ee523a....831ec7</span>
            <button type="button" className="mint-page__copy-btn" aria-label="Copy">
              <span className="material-symbols-rounded">content_copy</span>
            </button>
          </div>
          <div className="dest-wallet__wallet-meta">
            <span className="dest-wallet__meta-label">Asset:</span>
            <AssetMark asset="XSGD" size={16} label="X" color={undefined} children={undefined} />
            <span className="dest-wallet__meta-value">XSGD</span>
            <span className="dest-wallet__meta-label" style={{ marginLeft: 12 }}>Network:</span>
            <AssetMark asset="Arbitrum" size={16} label="A" color={undefined} children={undefined} />
            <span className="dest-wallet__meta-value">Arbitrum</span>
          </div>
        </div>
        <button type="button" className="dest-wallet__arrow-btn" aria-label="View details">
          <span className="material-symbols-rounded">arrow_right_alt</span>
        </button>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

function CopyCell({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
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
    <span className={`mint-page__copy-cell ${className ?? ""}`}>
      {children}
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
    </span>
  );
}

export function MintPage({ onSelectTransaction }: { onSelectTransaction: (transaction: MintTransactionRow) => void }) {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  // Filter state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterAsset, setFilterAsset] = useState<string[]>([]);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Temp filter state (for modal editing before applying)
  const [tempFilterStatus, setTempFilterStatus] = useState<string[]>([]);
  const [tempFilterAsset, setTempFilterAsset] = useState<string[]>([]);
  const [tempFilterDateFrom, setTempFilterDateFrom] = useState("");
  const [tempFilterDateTo, setTempFilterDateTo] = useState("");

  const openFilterModal = () => {
    setTempFilterStatus([...filterStatus]);
    setTempFilterAsset([...filterAsset]);
    setTempFilterDateFrom(filterDateFrom);
    setTempFilterDateTo(filterDateTo);
    setFilterModalOpen(true);
  };

  const applyFilter = () => {
    setFilterStatus(tempFilterStatus);
    setFilterAsset(tempFilterAsset);
    setFilterDateFrom(tempFilterDateFrom);
    setFilterDateTo(tempFilterDateTo);
    setFilterModalOpen(false);
    setVisibleCount(PAGE_SIZE);
  };

  const resetFilter = () => {
    setTempFilterStatus([]);
    setTempFilterAsset([]);
    setTempFilterDateFrom("");
    setTempFilterDateTo("");
  };

  const isFilterActive = filterStatus.length > 0 || filterAsset.length > 0 || filterDateFrom !== "" || filterDateTo !== "";

  const filteredData = useMemo<MintTransactionRow[]>(() => {
    let result = [...MOCK_MINT_TRANSACTIONS];

    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (row) =>
          row.id.toLowerCase().includes(q) ||
          row.fullId.toLowerCase().includes(q) ||
          row.wallet.toLowerCase().includes(q) ||
          row.currency.toLowerCase().includes(q) ||
          row.network.toLowerCase().includes(q)
      );
    }

    // Apply status filter
    if (filterStatus.length > 0) {
      result = result.filter((row) => filterStatus.includes(row.status.label));
    }

    // Apply asset filter
    if (filterAsset.length > 0) {
      result = result.filter((row) => filterAsset.includes(row.currency));
    }

    // Apply date range filter
    if (filterDateFrom || filterDateTo) {
      result = result.filter((row) => {
        const rowDate = new Date(row.date).getTime();
        if (filterDateFrom) {
          const from = new Date(filterDateFrom).getTime();
          if (rowDate < from) return false;
        }
        if (filterDateTo) {
          const to = new Date(filterDateTo).getTime() + 86400000 - 1;
          if (rowDate > to) return false;
        }
        return true;
      });
    }

    // Sort by transaction date
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [search, sortOrder, filterStatus, filterAsset, filterDateFrom, filterDateTo]);

  const visibleData = filteredData.slice(0, visibleCount);
  const hasMore = visibleCount < filteredData.length;

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredData.length));
      setLoading(false);
    }, 400);
  }, [filteredData.length]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: any[] = [
    {
      key: "id",
      header: "Transaction ID",
      render: (row: MintTransactionRow) => (
        <button
          type="button"
          className="mint-page__cell-id"
          onClick={() => onSelectTransaction(row)}
        >
          {row.id}
        </button>
      ),
    },
    {
      key: "date",
      header: "Transaction Date",
      sortable: true,
      date: true,
    },
    {
      key: "netAmount",
      header: "Net Amount",
      width: 180,
      render: (row: MintTransactionRow) => (
        <span className="mint-page__cell-amount">
          {row.netAmount.toLocaleString()} {row.currency}
        </span>
      ),
    },
    {
      key: "wallet",
      header: "Wallet Address",
      width: 160,
      render: (row: MintTransactionRow) => (
        <CopyCell value={row.wallet} className="mint-page__cell-wallet">
          {row.wallet.length > 12
            ? row.wallet.slice(0, 6) + "…" + row.wallet.slice(-5)
            : row.wallet}
        </CopyCell>
      ),
    },
    {
      key: "network",
      header: "Network",
      render: (row: MintTransactionRow) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <AssetMark asset={row.network} size={20} label={row.network.slice(0, 1)} color={undefined} children={undefined} />
          {row.network}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      fixed: "right",
      render: (row: MintTransactionRow) => (
        <Tag tone={row.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
          {row.status.label}
        </Tag>
      ),
    },
  ];

  return (
    <div className="mint-page">
      <PageTitle
        title="Mint"
        subtitle={undefined}
        breadcrumb={undefined}
        actions={undefined}
      />

      {bannerVisible && <MintBanner onClose={() => setBannerVisible(false)} />}

      <DestinationWallet />

      <div className="mint-page__card">
        {/* Toolbar with label, search, filter, and export */}
        <div className="mint-page__toolbar">
          <h2 className="mint-page__label">Mint Transaction</h2>
          <div className="mint-page__toolbar-actions">
            <div className="mint-page__search">
              <Input
                type="search"
                placeholder="Search by Transaction ID"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearch(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                label={undefined}
                helper={undefined}
                error={undefined}
                prefix={undefined}
                suffix={undefined}
                id={undefined}
                defaultValue={undefined}
                trailingButton={undefined}
                size="small"
              />
            </div>
            <Button variant="tertiary" size="sm" onClick={openFilterModal}>
              {isFilterActive && <Badge tone="critical" dot>{null}</Badge>}
              Filter
              <Icon name="filter_list" size={20} color={undefined} style={undefined} />
            </Button>
            <Button variant="tertiary" size="sm">
              Export CSV
              <Icon name="download" size={20} color={undefined} style={undefined} />
            </Button>
          </div>
        </div>

        {isMobile ? (
          <MintMobileList
            rows={visibleData}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={handleLoadMore}
            onSelect={onSelectTransaction}
            endLabel={`All ${filteredData.length} data already shown`}
          />
        ) : (
          <Table
            columns={columns as any}
            rows={visibleData as any}
            empty="No mint transactions found."
            scrollX={900}
            scrollY={480}
            sort={{ key: "date", direction: sortOrder === "newest" ? "desc" : "asc" }}
            onSortChange={(sortState: { key: string; direction: "asc" | "desc" } | null) => {
              if (sortState && sortState.key === "date") {
                setSortOrder(sortState.direction === "desc" ? "newest" : "oldest");
              } else {
                setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
              }
            }}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loading}
            endLabel={`All ${filteredData.length} data already shown`}
            timezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
            showTimezone
          />
        )}
      </div>

      {/* Filter Modal */}
      <Modal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter Transactions"
        illustration={undefined}
        media={undefined}
        className="mint-filter-modal"
        footer={
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", width: "100%" }}>
            <Button variant="tertiary" size="lg" onClick={resetFilter}>
              Reset
            </Button>
            <Button variant="primary" size="lg" onClick={applyFilter}>
              Apply Filter
            </Button>
          </div>
        }
      >
        <div className="mint-filter">
          <div className="mint-filter__section">
            <MultiSelect
              label="Status"
              helper={undefined}
              error={undefined}
              options={[
                { value: "Completed", label: "Completed" },
                { value: "Pending", label: "Pending" },
                { value: "Processing", label: "Processing" },
                { value: "Failed", label: "Failed" },
              ] as any}
              placeholder="Select status"
              value={tempFilterStatus}
              onChange={(vals: string[]) => setTempFilterStatus(vals)}
              id={undefined}
            />
          </div>
          <div className="mint-filter__section">
            <MultiSelect
              label="Asset"
              helper={undefined}
              error={undefined}
              options={[
                { value: "XSGD", label: "XSGD" },
                { value: "XUSD", label: "XUSD" },
              ] as any}
              placeholder="Select asset"
              value={tempFilterAsset}
              onChange={(vals: string[]) => setTempFilterAsset(vals)}
              id={undefined}
            />
          </div>
          <div className="mint-filter__section">
            <DateInput
              label="Transaction Date"
              helper={undefined}
              error={undefined}
              size="large"
              range
              placeholder={undefined}
              value={undefined}
              defaultValue={undefined}
              onChange={undefined}
              startValue={tempFilterDateFrom}
              endValue={tempFilterDateTo}
              onRangeChange={({ start, end }: { start: string; end: string }) => {
                setTempFilterDateFrom(start || "");
                setTempFilterDateTo(end || "");
              }}
              disabled={false}
              id={undefined}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
