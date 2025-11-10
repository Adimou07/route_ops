import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SalesOrders = () => {
  const orders = [
    { id: "SO-00456", client: "Entreprise Alpha", montant: "45 000€", date: "2024-01-15", status: "Approuvé" },
    { id: "SO-00457", client: "Société Beta", montant: "32 500€", date: "2024-01-14", status: "En attente" },
    { id: "SO-00458", client: "Client Gamma", montant: "78 200€", date: "2024-01-13", status: "Livré" },
    { id: "SO-00459", client: "Entreprise Delta", montant: "21 000€", date: "2024-01-12", status: "En cours" },
  ];

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Commandes Clients</h1>
            <p className="text-muted-foreground mt-1">Gérez vos commandes clients (Sales Orders)</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle commande
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Liste des commandes clients</CardTitle>
                <CardDescription>Toutes vos commandes en cours</CardDescription>
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
                  <TableHead>Client</TableHead>
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
                    <TableCell>{order.client}</TableCell>
                    <TableCell className="font-semibold">{order.montant}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === "Livré" ? "default" : 
                        order.status === "Approuvé" ? "secondary" : 
                        order.status === "En cours" ? "outline" : 
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

export default SalesOrders;
