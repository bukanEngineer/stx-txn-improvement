import { useState } from "react";
import { ToastProvider } from "prohellox-designsystem";
import { DashboardLayout } from "./components/DashboardLayout";
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage";
import { TransactionDetailPage } from "./pages/TransactionDetailPage";
import { BankTransferDetailPage } from "./pages/BankTransferDetailPage";
import { MintPage } from "./pages/MintPage";
import { MintDetailPage } from "./pages/MintDetailPage";
import { EarnPage } from "./pages/EarnPage";
import { EarnDetailPage } from "./pages/EarnDetailPage";
import { HomePage } from "./pages/HomePage";
import type { TransactionRow, BankTransferRow } from "./data/mockTransactions";
import type { MintTransactionRow } from "./data/mockMintTransactions";
import type { EarnTransactionRow } from "./data/mockEarnTransactions";

type PrimaryTab = "bank-transfer" | "blockchain-transfer" | "swap" | "otc" | "admin-transfer" | "payout";
type SecondaryTab = "all" | "action-needed";

function App() {
  const [activeNav, setActiveNav] = useState("history");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRow | null>(null);
  const [selectedBankTransfer, setSelectedBankTransfer] = useState<BankTransferRow | null>(null);
  const [selectedEarnTransaction, setSelectedEarnTransaction] = useState<EarnTransactionRow | null>(null);
  const [selectedMintTransaction, setSelectedMintTransaction] = useState<MintTransactionRow | null>(null);

  // Lifted navigation state — persists across detail page navigations
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>("blockchain-transfer");
  const [secondaryTab, setSecondaryTab] = useState<SecondaryTab>("all");

  const renderContent = () => {
    if (activeNav === "home") {
      return <HomePage />;
    }

    if (activeNav === "mint") {
      if (selectedMintTransaction) {
        return (
          <MintDetailPage
            transaction={selectedMintTransaction}
            onBack={() => setSelectedMintTransaction(null)}
          />
        );
      }
      return <MintPage onSelectTransaction={setSelectedMintTransaction} />;
    }

    if (activeNav === "earn") {
      if (selectedEarnTransaction) {
        return (
          <EarnDetailPage
            transaction={selectedEarnTransaction}
            onBack={() => setSelectedEarnTransaction(null)}
          />
        );
      }
      return <EarnPage onSelectTransaction={setSelectedEarnTransaction} />;
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
