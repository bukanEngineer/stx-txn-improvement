import { useState, useMemo, useCallback } from "react";
import {
  PageTitle,
  Button,
  Input,
  Table,
  Tag,
  Icon,
  Badge,
  Modal,
  MultiSelect,
  DateInput,
  useToast,
} from "prohellox-designsystem";
import { MOCK_EARN_TRANSACTIONS } from "../data/mockEarnTransactions";
import type { EarnTransactionRow } from "../data/mockEarnTransactions";
import { useIsMobile } from "../hooks/useMediaQuery";
import { EarnMobileList } from "../components/EarnMobileList";
import "./EarnPage.css";

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
    <span className={`earn-page__copy-cell ${className ?? ""}`}>
      {children}
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
    </span>
  );
}

interface EarnPageProps {
  onSelectTransaction: (transaction: EarnTransactionRow) => void;
}

export function EarnPage({ onSelectTransaction }: EarnPageProps) {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Temp filter state (for modal editing before applying)
  const [tempFilterStatus, setTempFilterStatus] = useState<string[]>([]);
  const [tempFilterType, setTempFilterType] = useState<string[]>([]);
  const [tempFilterDateFrom, setTempFilterDateFrom] = useState("");
  const [tempFilterDateTo, setTempFilterDateTo] = useState("");

  const openFilterModal = () => {
    setTempFilterStatus([...filterStatus]);
    setTempFilterType([...filterType]);
    setTempFilterDateFrom(filterDateFrom);
    setTempFilterDateTo(filterDateTo);
    setFilterModalOpen(true);
  };

  const applyFilter = () => {
    setFilterStatus(tempFilterStatus);
    setFilterType(tempFilterType);
    setFilterDateFrom(tempFilterDateFrom);
    setFilterDateTo(tempFilterDateTo);
    setFilterModalOpen(false);
    setVisibleCount(PAGE_SIZE);
  };

  const resetFilter = () => {
    setTempFilterStatus([]);
    setTempFilterType([]);
    setTempFilterDateFrom("");
    setTempFilterDateTo("");
  };

  const isFilterActive = filterStatus.length > 0 || filterType.length > 0 || filterDateFrom !== "" || filterDateTo !== "";

  const filteredData = useMemo<EarnTransactionRow[]>(() => {
    let result = [...MOCK_EARN_TRANSACTIONS];

    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (row) =>
          row.id.toLowerCase().includes(q) ||
          row.fullId.toLowerCase().includes(q) ||
          row.type.toLowerCase().includes(q) ||
          row.currency.toLowerCase().includes(q)
      );
    }

    // Apply status filter
    if (filterStatus.length > 0) {
      result = result.filter((row) => filterStatus.includes(row.status.label));
    }

    // Apply type filter
    if (filterType.length > 0) {
      result = result.filter((row) => filterType.includes(row.type));
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
  }, [search, sortOrder, filterStatus, filterType, filterDateFrom, filterDateTo]);

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
      render: (row: EarnTransactionRow) => (
        <CopyCell value={row.fullId}>
          <button
            type="button"
            className="earn-page__cell-id"
            onClick={() => onSelectTransaction(row)}
          >
            {row.id}
          </button>
        </CopyCell>
      ),
    },
    {
      key: "date",
      header: "Transaction Date",
      sortable: true,
      date: true,
    },
    {
      key: "type",
      header: "Type",
      render: (row: EarnTransactionRow) => (
        <span className="earn-page__cell-type">{row.type}</span>
      ),
    },
    {
      key: "netAmount",
      header: "Net Amount",
      width: 180,
      render: (row: EarnTransactionRow) => (
        <span className="earn-page__cell-amount">
          {row.netAmount.toLocaleString()} {row.currency}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      fixed: "right",
      render: (row: EarnTransactionRow) => (
        <Tag tone={row.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
          {row.status.label}
        </Tag>
      ),
    },
  ];

  return (
    <div className="earn-page">
      <PageTitle
        title="Earn"
        subtitle={undefined}
        breadcrumb={undefined}
        actions={undefined}
      />

      <div className="earn-page__card">
        {/* Toolbar with label, search, filter, and export */}
        <div className="earn-page__toolbar">
          <h2 className="earn-page__label">Earn Transaction</h2>
          <div className="earn-page__toolbar-actions">
            <div className="earn-page__search">
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
          <EarnMobileList
            rows={visibleData}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={handleLoadMore}
            endLabel={`All ${filteredData.length} data already shown`}
            onSelect={onSelectTransaction}
          />
        ) : (
          <Table
            columns={columns as any}
            rows={visibleData as any}
            empty="No earn transactions found."
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
            timezone="Asia/Singapore"
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
        className="earn-filter-modal"
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
        <div className="earn-filter">
          <div className="earn-filter__section">
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
          <div className="earn-filter__section">
            <MultiSelect
              label="Type"
              helper={undefined}
              error={undefined}
              options={[
                { value: "Reward Payout", label: "Reward Payout" },
                { value: "Add Funds", label: "Add Funds" },
                { value: "Remove Funds", label: "Remove Funds" },
              ] as any}
              placeholder="Select type"
              value={tempFilterType}
              onChange={(vals: string[]) => setTempFilterType(vals)}
              id={undefined}
            />
          </div>
          <div className="earn-filter__section">
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
