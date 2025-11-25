import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  ShoppingCart, 
  Package, 
  Users, 
  Building2, 
  CheckSquare, 
  FileStack, 
  UserCog, 
  Settings,
  LogOut,
  Factory,
  Receipt
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Projets", url: "/projects", icon: FolderKanban },
  { title: "Tâches", url: "/tasks", icon: CheckSquare },
];

const supplyChainItems = [
  { title: "RFQ", url: "/rfq", icon: FileText },
  { title: "Commandes Clients", url: "/sales-orders", icon: ShoppingCart },
  { title: "Commandes Fournisseurs", url: "/purchase-orders", icon: Package },
  { title: "Factures", url: "/invoices", icon: Receipt },
];

const contactsItems = [
  { title: "Clients", url: "/customers", icon: Users },
  { title: "Fournisseurs", url: "/suppliers", icon: Building2 },
  { title: "Fabricants", url: "/manufacturers", icon: Factory },
];

const adminItems = [
  { title: "Documents", url: "/documents", icon: FileStack },
  { title: "Utilisateurs", url: "/users", icon: UserCog },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  const isCollapsed = state === "collapsed";

  const renderMenuItems = (items: typeof mainItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink 
              to={item.url} 
              end
              className={isCollapsed ? "hover:bg-sidebar-accent justify-center" : "hover:bg-sidebar-accent"}
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Package className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-sm font-semibold text-sidebar-foreground">Supply Chain</h2>
                <p className="text-xs text-sidebar-foreground/60">Management</p>
              </div>
            )}
          </div>
          {!isCollapsed && <SidebarTrigger className="ml-2" />}
        </div>
      </SidebarHeader>

      <SidebarContent className="no-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Supply Chain</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(supplyChainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Contacts</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(contactsItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(adminItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 flex items-center justify-between gap-2">
        <Button 
          variant="ghost" 
          className={
            isCollapsed
              ? "flex-1 justify-center text-sidebar-foreground hover:bg-sidebar-accent"
              : "flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          }
          size={isCollapsed ? "icon" : "default"}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Déconnexion</span>}
        </Button>
        {isCollapsed && (
          <SidebarTrigger className="ml-2" />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
