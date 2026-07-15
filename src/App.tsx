import { useState } from "react";
import { ToastProvider } from "prohellox-designsystem";
import { DashboardLayout } from "./components/DashboardLayout";
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage";
import { TransactionDetailPage } from "./pages/TransactionDetailPage";
import { BankTransferDetailPage } from "./pages/BankTransferDetailPage";
import type { TransactionRow, BankTransferRow } from "./data/mockTransactions";

type PrimaryTab = "bank-transfer" | "blockchain-transfer" | "swap" | "otc" | "funding";
type SecondaryTab = "all" | "action-needed";

function App() {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRow | null>(null);
  const [selectedBankTransfer, setSelectedBankTransfer] = useState<BankTransferRow | null>(null);

  // Lifted navigation state — persists across detail page navigations
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>("blockchain-transfer");
  const [secondaryTab, setSecondaryTab] = useState<SecondaryTab>("all");

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
        ) : (
          <TransactionHistoryPage
            onSelectTransaction={setSelectedTransaction}
            onSelectBankTransfer={setSelectedBankTransfer}
            primaryTab={primaryTab}
            onPrimaryTabChange={setPrimaryTab}
            secondaryTab={secondaryTab}
            onSecondaryTabChange={setSecondaryTab}
          />
        )}
      </DashboardLayout>
    </ToastProvider>
  );
}

export default App;
