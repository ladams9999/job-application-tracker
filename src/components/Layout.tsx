
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ListFilter, Plus, LayoutDashboard } from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary/80"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 p-4 border-r">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Application Tracker</h1>
          <p className="text-sm text-muted-foreground">Track your job hunt</p>
        </div>
        <nav className="space-y-1">
          <NavItem
            to="/applications"
            icon={<ListFilter size={20} />}
            label="Applications"
            isActive={pathname === "/applications"}
          />
          <NavItem
            to="/add"
            icon={<Plus size={20} />}
            label="Add New"
            isActive={pathname === "/add"}
          />
        </nav>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Application Tracker</h1>
        <div className="flex gap-4">
            <LayoutDashboard size={20} />
          <Link
            to="/applications"
            className={cn(
              "p-2 rounded-md",
              pathname === "/applications" ? "bg-primary text-primary-foreground" : ""
            )}
          >
            <ListFilter size={20} />
          </Link>
          <Link
            to="/add"
            className={cn(
              "p-2 rounded-md",
              pathname === "/add" ? "bg-primary text-primary-foreground" : ""
            )}
          >
            <Plus size={20} />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
};

export default Layout;
