import { useState } from "react";
import { ToastProvider } from "prohellox-designsystem";
import { DashboardLayout } from "./components/DashboardLayout";
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage";
import { TransactionDetailPage } from "./pages/TransactionDetailPage";
import { BankTransferDetailPage } from "./pages/BankTransferDetailPage";
import { SwapDetailPage } from "./pages/SwapDetailPage";
import { OtcDetailPage } from "./pages/OtcDetailPage";
import type { TransactionRow, SwapTransactionRow, BankTransferRow } from "./data/mockTransactions";

type PrimaryTab = "bank-transfer" | "blockchain-transfer" | "swap" | "otc" | "funding";
type SecondaryTab = "all" | "action-needed";

function App() {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRow | null>(null);
  const [selectedBankTransfer, setSelectedBankTransfer] = useState<BankTransferRow | null>(null);
  const [selectedSwap, setSelectedSwap] = useState<SwapTransactionRow | null>(null);
  const [selectedOtc, setSelectedOtc] = useState<SwapTransactionRow | null>(null);

  // Lifted navigation state — persists across detail page navigations
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>("blockchain-transfer");
  const [secondaryTab, setSecondaryTab] = useState<SecondaryTab>("all");
  const [page, setPage] = useState(1);

  return (
    <ToastProvider>
      <DashboardLayout>
        {selectedTransaction ? (
          <TransactionDetailPage
            transaction={selectedTransaction}
            onBack={() => setSelectedTransaction(null)}
          />
        ) : selectedBankTransfer ? (
          <BankTransferDetailPage
            transaction={selectedBankTransfer}
            onBack={() => setSelectedBankTransfer(null)}
          />
        ) : selectedSwap ? (
          <SwapDetailPage
            transaction={selectedSwap}
            onBack={() => setSelectedSwap(null)}
          />
        ) : selectedOtc ? (
          <OtcDetailPage
            transaction={selectedOtc}
            onBack={() => setSelectedOtc(null)}
          />
        ) : (
          <TransactionHistoryPage
            onSelectTransaction={setSelectedTransaction}
            onSelectBankTransfer={setSelectedBankTransfer}
            onSelectSwap={setSelectedSwap}
            onSelectOtc={setSelectedOtc}
            primaryTab={primaryTab}
            onPrimaryTabChange={setPrimaryTab}
            secondaryTab={secondaryTab}
            onSecondaryTabChange={setSecondaryTab}
            page={page}
            onPageChange={setPage}
          />
        )}
      </DashboardLayout>
    </ToastProvider>
  );
}

export default App;
