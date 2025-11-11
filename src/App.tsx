import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import RFQ from "./pages/RFQ";
import SalesOrders from "./pages/SalesOrders";
import PurchaseOrders from "./pages/PurchaseOrders";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import Documents from "./pages/Documents";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Manufacturers from "./pages/Manufacturers";
import Invoices from "./pages/Invoices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/rfq" element={<RFQ />} />
          <Route path="/sales-orders" element={<SalesOrders />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/manufacturers" element={<Manufacturers />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
