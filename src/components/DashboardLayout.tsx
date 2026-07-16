import { type ReactNode } from "react";
import { Sidebar, TopNavigation, DEFAULT_NAV_ITEMS } from "prohellox-designsystem";
import "./DashboardLayout.css";

const HIDDEN_NAV_IDS = ["statement", "devtools", "team", "settings"];
const NAV_ITEMS = DEFAULT_NAV_ITEMS
  .filter((item: { id: string }) => !HIDDEN_NAV_IDS.includes(item.id))
  .map((item) =>
    item.id === "mint" ? { id: "mint", icon: item.icon, label: item.label } : item
  ) as typeof DEFAULT_NAV_ITEMS;

const COMPANIES = [
  { id: "acme", name: "Acme Corp", type: "Business Account", selected: true },
];

const COMPANY_ACTIONS = [
  { id: "manage", icon: "settings", label: "Manage Company" },
  { id: "add", icon: "add_circle", label: "Add Company" },
];

interface DashboardLayoutProps {
  children: ReactNode;
  activeNav: string;
  onNavChange: (id: string) => void;
}

export function DashboardLayout({ children, activeNav, onNavChange }: DashboardLayoutProps) {

  return (
    <div className="dashboard">
      <aside className="dashboard__sidebar">
        <Sidebar
          account="business"
          company={{ name: "Acme Corp", type: "Business Account" }}
          onCompanyClick={() => {}}
          companies={COMPANIES}
          companyActions={COMPANY_ACTIONS}
          onSwitchCompany={() => {}}
          onCompanyAction={() => {}}
          defaultMenuOpen={false}
          items={NAV_ITEMS}
          active={activeNav}
          activeSubItem={undefined}
          hoveredItem={undefined}
          onSelect={(id: string) => onNavChange(id)}
        />
      </aside>

      <div className="dashboard__main">
        <header className="dashboard__topbar">
          <TopNavigation
            account="business"
            user={{ name: "John Doe", company: "Acme Corp", initials: "JD" }}
            notifications={3}
            onNotificationsClick={() => {}}
            onMenuAction={() => {}}
            onMenuClick={() => {}}
          >
            {undefined}
          </TopNavigation>
        </header>

        <main className="dashboard__content">{children}</main>
      </div>
    </div>
  );
}
