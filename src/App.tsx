import { useState } from "react";
import { ToastProvider } from "prohellox-designsystem";
import { DashboardLayout } from "./components/DashboardLayout";
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage";
import { TransactionDetailPage } from "./pages/TransactionDetailPage";
import { BankTransferDetailPage } from "./pages/BankTransferDetailPage";
import { MintPage } from "./pages/MintPage";
import type { TransactionRow, BankTransferRow } from "./data/mockTransactions";

type PrimaryTab = "bank-transfer" | "blockchain-transfer" | "swap" | "otc" | "admin-transfer" | "payout";
type SecondaryTab = "all" | "action-needed";

function App() {
  const [activeNav, setActiveNav] = useState("history");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRow | null>(null);
  const [selectedBankTransfer, setSelectedBankTransfer] = useState<BankTransferRow | null>(null);

  // Lifted navigation state — persists across detail page navigations
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>("blockchain-transfer");
  const [secondaryTab, setSecondaryTab] = useState<SecondaryTab>("all");

  const renderContent = () => {
    if (activeNav === "mint") {
      return <MintPage />;
    }

    // Default: transaction history flow
    if (selectedTransaction) {
      return (
        <TransactionDetailPage
          transaction={selectedTransaction}
          onBack={() => setSelectedTransaction(null)}
        />
      );
    }

    if (selectedBankTransfer) {
      return (
        <BankTransferDetailPage
          transaction={selectedBankTransfer}
          onBack={() => setSelectedBankTransfer(null)}
        />
      );
    }

    return (
      <TransactionHistoryPage
        onSelectTransaction={setSelectedTransaction}
        onSelectBankTransfer={setSelectedBankTransfer}
        primaryTab={primaryTab}
        onPrimaryTabChange={setPrimaryTab}
        secondaryTab={secondaryTab}
        onSecondaryTabChange={setSecondaryTab}
      />
    );
  };

  return (
    <ToastProvider>
      <DashboardLayout activeNav={activeNav} onNavChange={setActiveNav}>
        {renderContent()}
      </DashboardLayout>
    </ToastProvider>
  );
}

export default App;
