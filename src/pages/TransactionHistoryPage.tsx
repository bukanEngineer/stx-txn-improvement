import { useState, useMemo } from "react";
import {
  PageTitle,
  Button,
  Input,
  Tabs,
  Table,
  Tag,
  Icon,
  Pagination,
  EmptyState,
  Modal,
  Badge,
  AssetMark,
  MultiSelect,
  DateInput,
  useToast,
} from "prohellox-designsystem";
import { MOCK_BLOCKCHAIN_TRANSFER, MOCK_SWAP_TRANSACTIONS, MOCK_BANK_TRANSFER, MOCK_OTC_TRANSACTIONS } from "../data/mockTransactions";
import type { TransactionRow, SwapTransactionRow, BankTransferRow } from "../data/mockTransactions";
import "./TransactionHistoryPage.css";

const PAGE_SIZE = 10;

type PrimaryTab = "bank-transfer" | "blockchain-transfer" | "swap" | "otc" | "funding";
type SecondaryTab = "all" | "action-needed";

interface TransactionHistoryPageProps {
  onSelectTransaction: (transaction: TransactionRow) => void;
  onSelectBankTransfer: (transaction: BankTransferRow) => void;
  onSelectSwap: (transaction: SwapTransactionRow) => void;
  onSelectOtc: (transaction: SwapTransactionRow) => void;
  primaryTab: PrimaryTab;
  onPrimaryTabChange: (tab: PrimaryTab) => void;
  secondaryTab: SecondaryTab;
  onSecondaryTabChange: (tab: SecondaryTab) => void;
  page: number;
  onPageChange: (page: number) => void;
}

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
    <span className={`txn-page__copy-cell ${className ?? ""}`}>
      {children}
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
    </span>
  );
}

export function TransactionHistoryPage({ onSelectTransaction, onSelectBankTransfer, onSelectSwap, onSelectOtc, primaryTab, onPrimaryTabChange, secondaryTab, onSecondaryTabChange, page, onPageChange }: TransactionHistoryPageProps) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTransaction, setModalTransaction] = useState<TransactionRow | null>(null);

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
    onPageChange(1);
  };

  const resetFilter = () => {
    setTempFilterStatus([]);
    setTempFilterAsset([]);
    setTempFilterDateFrom("");
    setTempFilterDateTo("");
  };

  const isFilterActive = filterStatus.length > 0 || filterAsset.length > 0 || filterDateFrom !== "" || filterDateTo !== "";

  // Primary tabs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const primaryTabItems: any[] = [
    { id: "bank-transfer", label: "Bank Transfer" },
    { id: "blockchain-transfer", label: "Blockchain Transfer" },
    { id: "swap", label: "Swap" },
    { id: "otc", label: "OTC" },
    { id: "funding", label: "Funding (TBD)" },
  ];

  // Count of action-needed items (Pending + Processing)
  const actionNeededCount = useMemo(
    () =>
      MOCK_BLOCKCHAIN_TRANSFER.filter(
        (row) => row.status.label === "Pending" || row.status.label === "Processing"
      ).length,
    []
  );

  // Count of bank transfer action-needed items
  const bankActionNeededCount = useMemo(
    () =>
      MOCK_BANK_TRANSFER.filter(
        (row) => row.status.label === "Pending" || row.status.label === "Processing"
      ).length,
    []
  );

  // Filter data (only for blockchain-transfer tab)
  const filteredData = useMemo<TransactionRow[]>(() => {
    let result = MOCK_BLOCKCHAIN_TRANSFER;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (row) =>
          row.id.toLowerCase().includes(q) ||
          row.wallet.toLowerCase().includes(q) ||
          row.amount.toLowerCase().includes(q) ||
          row.type.toLowerCase().includes(q)
      );
    }

    if (secondaryTab === "action-needed") {
      result = result.filter(
        (row) =>
          row.status.label === "Pending" || row.status.label === "Processing"
      );
    }

    // Apply status filter
    if (filterStatus.length > 0) {
      result = result.filter((row) => filterStatus.includes(row.status.label));
    }

    // Apply asset filter
    if (filterAsset.length > 0) {
      result = result.filter((row) =>
        filterAsset.includes(row.currency) ||
        (row.sourceCurrency && filterAsset.includes(row.sourceCurrency))
      );
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
          // Include the entire "to" day
          const to = new Date(filterDateTo).getTime() + 86400000 - 1;
          if (rowDate > to) return false;
        }
        return true;
      });
    }

    // Sort by transaction date
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [search, secondaryTab, sortOrder, filterStatus, filterAsset, filterDateFrom, filterDateTo]);

  // Filter swap data (for swap tab — no secondary tab filtering)
  const filteredSwapData = useMemo<SwapTransactionRow[]>(() => {
    let result: SwapTransactionRow[] = MOCK_SWAP_TRANSACTIONS;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (row) =>
          row.id.toLowerCase().includes(q) ||
          row.fromCurrency.toLowerCase().includes(q) ||
          row.toCurrency.toLowerCase().includes(q) ||
          `${row.fromCurrency}/${row.toCurrency}`.toLowerCase().includes(q)
      );
    }

    // Apply status filter
    if (filterStatus.length > 0) {
      result = result.filter((row) => filterStatus.includes(row.status.label));
    }

    // Apply asset filter
    if (filterAsset.length > 0) {
      result = result.filter((row) =>
        filterAsset.includes(row.fromCurrency) || filterAsset.includes(row.toCurrency)
      );
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
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [search, sortOrder, filterStatus, filterAsset, filterDateFrom, filterDateTo]);

  // Filter OTC data (same logic as swap)
  const filteredOtcData = useMemo<SwapTransactionRow[]>(() => {
    let result: SwapTransactionRow[] = MOCK_OTC_TRANSACTIONS;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (row) =>
          row.id.toLowerCase().includes(q) ||
          row.fromCurrency.toLowerCase().includes(q) ||
          row.toCurrency.toLowerCase().includes(q) ||
          `${row.fromCurrency}/${row.toCurrency}`.toLowerCase().includes(q)
      );
    }

    // Apply status filter
    if (filterStatus.length > 0) {
      result = result.filter((row) => filterStatus.includes(row.status.label));
    }

    // Apply asset filter
    if (filterAsset.length > 0) {
      result = result.filter((row) =>
        filterAsset.includes(row.fromCurrency) || filterAsset.includes(row.toCurrency)
      );
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
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [search, sortOrder, filterStatus, filterAsset, filterDateFrom, filterDateTo]);

  // Filter bank transfer data
  const filteredBankData = useMemo<BankTransferRow[]>(() => {
    let result: BankTransferRow[] = MOCK_BANK_TRANSFER;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (row) =>
          row.id.toLowerCase().includes(q) ||
          row.fullId.toLowerCase().includes(q) ||
          row.bankName.toLowerCase().includes(q) ||
          row.accountName.toLowerCase().includes(q) ||
          row.referenceNumber.toLowerCase().includes(q)
      );
    }

    if (secondaryTab === "action-needed") {
      result = result.filter(
        (row) =>
          row.status.label === "Pending" || row.status.label === "Processing"
      );
    }

    // Apply status filter
    if (filterStatus.length > 0) {
      result = result.filter((row) => filterStatus.includes(row.status.label));
    }

    // Apply asset filter (currency for bank transfers)
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
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [search, secondaryTab, sortOrder, filterStatus, filterAsset, filterDateFrom, filterDateTo]);

  // Pagination
  const activeData = primaryTab === "swap" ? filteredSwapData : primaryTab === "otc" ? filteredOtcData : primaryTab === "bank-transfer" ? filteredBankData : filteredData;
  const totalPages = Math.ceil(activeData.length / PAGE_SIZE);
  const paginatedData = activeData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onPageChange(1);
  };

  const handlePrimaryTabChange = (tabId: string) => {
    onPrimaryTabChange(tabId as PrimaryTab);
    onPageChange(1);
  };

  // Is this an empty-state tab?
  const isEmptyTab = primaryTab !== "blockchain-transfer" && primaryTab !== "swap" && primaryTab !== "bank-transfer" && primaryTab !== "otc";

  // Empty state messages per tab
  const emptyMessages: Record<string, { title: string; sub: string }> = {
    "bank-transfer": {
      title: "No Bank Transfer transactions",
      sub: "Your bank transfer transactions will appear here once you make your first transfer.",
    },
    swap: {
      title: "No Swap transactions",
      sub: "Your swap transactions will appear here once you make your first swap.",
    },
    otc: {
      title: "No OTC transactions",
      sub: "Your OTC transactions will appear here once you submit your first OTC request.",
    },
    funding: {
      title: "No Funding transactions",
      sub: "This feature is coming soon. Your funding transactions will appear here.",
    },
  };

  // Table columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: any[] = [
    {
      key: "id",
      header: "Transaction ID",
      render: (row: TransactionRow) => (
        <CopyCell value={row.fullId}>
          <button
            type="button"
            className="txn-page__cell-id"
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
    },
    {
      key: "type",
      header: "Transaction Type",
      render: (row: TransactionRow) => (
        <span className="txn-page__cell-type">{row.type.replace(/Blockchain\s*/gi, "")}</span>
      ),
    },
    {
      key: "amount",
      header: "Net Amount",
      width: 180,
      render: (row: TransactionRow) => (
        <span className="txn-page__cell-amount">{(row.totalAmount - row.fee).toLocaleString()} {row.currency}</span>
      ),
    },
    {
      key: "wallet",
      header: "Wallet Address",
      width: 160,
      render: (row: TransactionRow) => (
        <CopyCell value={row.wallet} className="txn-page__cell-wallet">
          {row.wallet.length > 12
            ? row.wallet.slice(0, 6) + "…" + row.wallet.slice(-5)
            : row.wallet}
        </CopyCell>
      ),
    },
    {
      key: "network",
      header: "Network",
      render: (row: TransactionRow) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <AssetMark asset={row.network} size={20} label={row.network.slice(0, 1)} color={undefined} children={undefined} />
          {row.network}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      fixed: secondaryTab === "action-needed" ? "right" : undefined,
      render: (row: TransactionRow) =>
        secondaryTab === "action-needed" ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setModalTransaction(row);
              setModalOpen(true);
            }}
          >
            Confirm Deposit
          </Button>
        ) : (
          <Tag tone={row.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
            {row.status.label}
          </Tag>
        ),
    },
  ];

  // Swap table columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swapColumns: any[] = [
    {
      key: "id",
      header: "Transaction ID",
      render: (row: SwapTransactionRow) => (
        <CopyCell value={row.fullId}>
          <button
            type="button"
            className="txn-page__cell-id"
            onClick={() => onSelectSwap(row)}
          >
            {row.fullId.slice(0, 11)}....{row.fullId.slice(-4)}
          </button>
        </CopyCell>
      ),
    },
    {
      key: "date",
      header: "Transaction Date",
      sortable: true,
    },
    {
      key: "sell",
      header: "Sell",
      render: (row: SwapTransactionRow) => (
        <span>{row.fromAmount.toLocaleString()} {row.fromCurrency}</span>
      ),
    },
    {
      key: "buy",
      header: "Buy",
      render: (row: SwapTransactionRow) => (
        <span>{row.toAmount.toLocaleString()} {row.toCurrency}</span>
      ),
    },
    {
      key: "rate",
      header: "Rate",
      width: 200,
      render: (row: SwapTransactionRow) => (
        <span>1 {row.fromCurrency} ≈ {row.rate} {row.toCurrency}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: SwapTransactionRow) => (
        <Tag tone={row.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
          {row.status.label}
        </Tag>
      ),
    },
  ];

  // OTC table columns (same structure as swap)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const otcColumns: any[] = [
    {
      key: "id",
      header: "Transaction ID",
      render: (row: SwapTransactionRow) => (
        <CopyCell value={row.fullId}>
          <button
            type="button"
            className="txn-page__cell-id"
            onClick={() => onSelectOtc(row)}
          >
            {row.fullId.slice(0, 11)}....{row.fullId.slice(-4)}
          </button>
        </CopyCell>
      ),
    },
    {
      key: "date",
      header: "Transaction Date",
      sortable: true,
    },
    {
      key: "sell",
      header: "Sell",
      render: (row: SwapTransactionRow) => (
        <span>{row.fromAmount.toLocaleString()} {row.fromCurrency}</span>
      ),
    },
    {
      key: "buy",
      header: "Buy",
      render: (row: SwapTransactionRow) => (
        <span>{row.toAmount.toLocaleString()} {row.toCurrency}</span>
      ),
    },
    {
      key: "rate",
      header: "Rate",
      width: 200,
      render: (row: SwapTransactionRow) => (
        <span>1 {row.fromCurrency} ≈ {row.rate} {row.toCurrency}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: SwapTransactionRow) => (
        <Tag tone={row.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
          {row.status.label}
        </Tag>
      ),
    },
  ];

  // Bank transfer table columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bankColumns: any[] = [
    {
      key: "id",
      header: "Transaction ID",
      render: (row: BankTransferRow) => (
        <CopyCell value={row.fullId}>
          <button
            type="button"
            className="txn-page__cell-id"
            onClick={() => onSelectBankTransfer(row)}
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
    },
    {
      key: "type",
      header: "Transaction Type",
      render: (row: BankTransferRow) => (
        <span className="txn-page__cell-type">{row.type.replace(/Bank\s*/gi, "")}</span>
      ),
    },
    {
      key: "amount",
      header: "Net Amount",
      width: 180,
      render: (row: BankTransferRow) => (
        <span className="txn-page__cell-amount">{(row.totalAmount - row.fee).toLocaleString()} {row.currency}</span>
      ),
    },
    {
      key: "bankAccount",
      header: "Bank Account",
      width: 200,
      render: (row: BankTransferRow) => (
        <span>{row.bankName} {row.accountNumber}</span>
      ),
    },
    {
      key: "network",
      header: "Network",
      render: (row: BankTransferRow) => (
        <span>{row.network}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      fixed: secondaryTab === "action-needed" ? "right" : undefined,
      render: (row: BankTransferRow) =>
        secondaryTab === "action-needed" ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setModalTransaction(row as unknown as TransactionRow);
              setModalOpen(true);
            }}
          >
            Confirm Transfer
          </Button>
        ) : (
          <Tag tone={row.status.tone} icon={undefined} onRemove={undefined} onClick={undefined}>
            {row.status.label}
          </Tag>
        ),
    },
  ];

  return (
    <div className="txn-page">
      <PageTitle
        title="Transaction History"
        subtitle={undefined}
        breadcrumb={undefined}
        actions={undefined}
      />

      <div className="txn-page__card">
        {/* Primary Tabs */}
        <Tabs
          items={primaryTabItems as any}
          activeTab={primaryTab}
          onTabChange={handlePrimaryTabChange}
          defaultTab="blockchain-transfer"
        />

        {isEmptyTab ? (
          /* Empty state for non-blockchain tabs */
          <EmptyState
            title={emptyMessages[primaryTab]?.title}
            sub={emptyMessages[primaryTab]?.sub}
          />
        ) : primaryTab === "swap" ? (
          <>
            {/* Swap tab: toolbar without secondary tabs */}
            <div className="txn-page__toolbar" style={{ justifyContent: "flex-start" }}>
              <div className="txn-page__toolbar-actions">
                <div className="txn-page__search">
                  <Input
                    type="search"
                    placeholder="Search by Transaction ID"
                    value={search}
                    onChange={handleSearch}
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

            {/* Swap Table */}
            <Table
              columns={swapColumns as any}
              rows={paginatedData as any}
              empty="No transactions found."
              scrollX={undefined}
              scrollY={undefined}
              sort={{ key: "date", direction: sortOrder === "newest" ? "desc" : "asc" }}
              onSortChange={(sortState: { key: string; direction: "asc" | "desc" } | null) => {
                if (sortState && sortState.key === "date") {
                  setSortOrder(sortState.direction === "desc" ? "newest" : "oldest");
                } else {
                  setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
                }
              }}
            />
          </>
        ) : primaryTab === "otc" ? (
          <>
            {/* OTC tab: toolbar without secondary tabs (same structure as swap) */}
            <div className="txn-page__toolbar" style={{ justifyContent: "flex-start" }}>
              <div className="txn-page__toolbar-actions">
                <div className="txn-page__search">
                  <Input
                    type="search"
                    placeholder="Search by Transaction ID"
                    value={search}
                    onChange={handleSearch}
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

            {/* OTC Table */}
            <Table
              columns={otcColumns as any}
              rows={paginatedData as any}
              empty="No transactions found."
              scrollX={undefined}
              scrollY={undefined}
              sort={{ key: "date", direction: sortOrder === "newest" ? "desc" : "asc" }}
              onSortChange={(sortState: { key: string; direction: "asc" | "desc" } | null) => {
                if (sortState && sortState.key === "date") {
                  setSortOrder(sortState.direction === "desc" ? "newest" : "oldest");
                } else {
                  setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
                }
              }}
            />
          </>
        ) : primaryTab === "bank-transfer" ? (
          <>
            {/* Bank Transfer tab: toolbar with secondary tabs */}
            <div className="txn-page__toolbar">
              <div className="txn-page__toolbar-actions">
                <div className="txn-page__search">
                  <Input
                    type="search"
                    placeholder="Search by Transaction ID"
                    value={search}
                    onChange={handleSearch}
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

              <div className="txn-page__secondary-tabs">
                <button
                  type="button"
                  className={`txn-page__sec-tab ${secondaryTab === "all" ? "txn-page__sec-tab--active" : ""}`}
                  onClick={() => { onSecondaryTabChange("all"); onPageChange(1); }}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`txn-page__sec-tab ${secondaryTab === "action-needed" ? "txn-page__sec-tab--active" : ""}`}
                  onClick={() => { onSecondaryTabChange("action-needed"); onPageChange(1); }}
                >
                  Action Needed
                  <Badge tone="critical">{bankActionNeededCount}</Badge>
                </button>
              </div>
            </div>

            {/* Bank Transfer Table */}
            <Table
              columns={bankColumns as any}
              rows={paginatedData as any}
              empty="No transactions found."
              scrollX={secondaryTab === "action-needed" ? 900 : undefined}
              scrollY={undefined}
              sort={{ key: "date", direction: sortOrder === "newest" ? "desc" : "asc" }}
              onSortChange={(sortState: { key: string; direction: "asc" | "desc" } | null) => {
                if (sortState && sortState.key === "date") {
                  setSortOrder(sortState.direction === "desc" ? "newest" : "oldest");
                } else {
                  setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
                }
              }}
            />
          </>
        ) : (
          <>
            {/* Secondary row: search + actions left, secondary tab toggle right */}
            <div className="txn-page__toolbar">
              <div className="txn-page__toolbar-actions">
                <div className="txn-page__search">
                  <Input
                    type="search"
                    placeholder="Search by Transaction ID"
                    value={search}
                    onChange={handleSearch}
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

              <div className="txn-page__secondary-tabs">
                <button
                  type="button"
                  className={`txn-page__sec-tab ${secondaryTab === "all" ? "txn-page__sec-tab--active" : ""}`}
                  onClick={() => { onSecondaryTabChange("all"); onPageChange(1); }}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`txn-page__sec-tab ${secondaryTab === "action-needed" ? "txn-page__sec-tab--active" : ""}`}
                  onClick={() => { onSecondaryTabChange("action-needed"); onPageChange(1); }}
                >
                  Action Needed
                  <Badge tone="critical">{actionNeededCount}</Badge>
                </button>
              </div>
            </div>

            {/* Table */}
            <Table
              columns={columns as any}
              rows={paginatedData as any}
              empty="No transactions found."
              scrollX={secondaryTab === "action-needed" ? 900 : undefined}
              scrollY={undefined}
              sort={{ key: "date", direction: sortOrder === "newest" ? "desc" : "asc" }}
              onSortChange={(sortState: { key: string; direction: "asc" | "desc" } | null) => {
                if (sortState && sortState.key === "date") {
                  setSortOrder(sortState.direction === "desc" ? "newest" : "oldest");
                } else {
                  // When sort is cleared (null), toggle to the opposite direction
                  setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
                }
              }}
            />
          </>
        )}
      </div>

      {!isEmptyTab && totalPages > 1 && (
        <div className="txn-page__pagination">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={activeData.length}
            pageSize={PAGE_SIZE}
            onChange={onPageChange}
            showSummary
          />
        </div>
      )}

      {/* Confirm Deposit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Deposit"
        illustration={undefined}
        media={undefined}
        footer={
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={() => setModalOpen(false)}>
              Confirm
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to confirm the deposit for transaction{" "}
          <strong>{modalTransaction?.id}</strong> of{" "}
          <strong>{modalTransaction?.amount}</strong>?
        </p>
      </Modal>

      {/* Filter Modal */}
      <Modal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter Transactions"
        illustration={undefined}
        media={undefined}
        className="txn-filter-modal"
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
        <div className="txn-filter">
          <div className="txn-filter__section">
            <MultiSelect
              label="Status"
              helper={undefined}
              error={undefined}
              options={[
                { value: "Completed", label: "Completed" },
                { value: "Pending", label: "Pending" },
                { value: "Processing", label: "Processing" },
                { value: "Failed", label: "Failed" },
                { value: "Cancelled", label: "Cancelled" },
              ] as any}
              placeholder="Select status"
              value={tempFilterStatus}
              onChange={(vals: string[]) => setTempFilterStatus(vals)}
              id={undefined}
            />
          </div>
          <div className="txn-filter__section">
            <MultiSelect
              label="Asset"
              helper={undefined}
              error={undefined}
              options={[
                { value: "SGD", label: "SGD" },
                { value: "USD", label: "USD" },
                { value: "XSGD", label: "XSGD" },
                { value: "XUSD", label: "XUSD" },
                { value: "USDC", label: "USDC" },
                { value: "USDT", label: "USDT" },
              ] as any}
              placeholder="Select asset"
              value={tempFilterAsset}
              onChange={(vals: string[]) => setTempFilterAsset(vals)}
              id={undefined}
            />
          </div>
          <div className="txn-filter__section">
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
