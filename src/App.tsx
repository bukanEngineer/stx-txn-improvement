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

type PrimaryTab = "bank-transfer" | "blockchain-transfer" | "swap" | "otc" | "admin-transfer";
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
      // Keep table mounted so search/filter/sort state survives detail navigation
      return (
        <>
          <div hidden={!!selectedMintTransaction}>
            <MintPage onSelectTransaction={setSelectedMintTransaction} />
          </div>
          {selectedMintTransaction && (
            <MintDetailPage
              transaction={selectedMintTransaction}
              onBack={() => setSelectedMintTransaction(null)}
            />
          )}
        </>
      );
    }

    if (activeNav === "earn") {
      return (
        <>
          <div hidden={!!selectedEarnTransaction}>
            <EarnPage onSelectTransaction={setSelectedEarnTransaction} />
          </div>
          {selectedEarnTransaction && (
            <EarnDetailPage
              transaction={selectedEarnTransaction}
              onBack={() => setSelectedEarnTransaction(null)}
            />
          )}
        </>
      );
    }

    // Default: transaction history flow
    const showingHistoryDetail = !!(selectedTransaction || selectedBankTransfer);

    return (
      <>
        <div hidden={showingHistoryDetail}>
          <TransactionHistoryPage
            onSelectTransaction={setSelectedTransaction}
            onSelectBankTransfer={setSelectedBankTransfer}
            primaryTab={primaryTab}
            onPrimaryTabChange={setPrimaryTab}
            secondaryTab={secondaryTab}
            onSecondaryTabChange={setSecondaryTab}
          />
        </div>
        {selectedTransaction && (
          <TransactionDetailPage
            transaction={selectedTransaction}
            onBack={() => setSelectedTransaction(null)}
          />
        )}
        {selectedBankTransfer && (
          <BankTransferDetailPage
            transaction={selectedBankTransfer}
            onBack={() => setSelectedBankTransfer(null)}
          />
        )}
      </>
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
