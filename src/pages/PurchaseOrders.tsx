import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PurchaseOrders = () => {
  const orders = [
    { id: "PO-00234", fournisseur: "Fournisseur Gamma", montant: "28 000€", date: "2024-01-15", status: "En cours" },
    { id: "PO-00235", fournisseur: "Distributeur Delta", montant: "15 500€", date: "2024-01-14", status: "Livré" },
    { id: "PO-00236", fournisseur: "Manufacturer Epsilon", montant: "42 300€", date: "2024-01-13", status: "En attente" },
    { id: "PO-00237", fournisseur: "Supplier Zeta", montant: "19 800€", date: "2024-01-12", status: "Confirmé" },
  ];

  return (
    <AppLayout>
      <div className="p-8 space-y-6 bg-muted/40">
        {/* Page Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-2xl">
          <div className="px-6 py-6 sm:px-10 sm:py-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground flex items-center gap-3">
                <Package className="h-8 w-8" />
                Commandes Fournisseurs
              </h1>
              <p className="text-sm sm:text-base text-primary-foreground/80 mt-1">
                Gérez vos commandes fournisseurs (Purchase Orders) et suivez vos approvisionnements.
              </p>
            </div>
            <Button className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all duration-200">
              <Plus className="h-4 w-4" />
              Nouvelle commande
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Liste des commandes fournisseurs</CardTitle>
                <CardDescription>Suivi de vos approvisionnements</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-9 w-64" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.fournisseur}</TableCell>
                    <TableCell className="font-semibold">{order.montant}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === "Livré" ? "default" : 
                        order.status === "Confirmé" ? "secondary" : 
                        "outline"
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Voir détails</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PurchaseOrders;
