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

const Suppliers = () => {
  const suppliers = [
    { id: "SUP-001", name: "Fournisseur Gamma", contact: "contact@gamma.fr", type: "Distributeur", status: "Actif", orders: 24 },
    { id: "SUP-002", name: "Distributeur Delta", contact: "info@delta.com", type: "Manufacturer", status: "Actif", orders: 18 },
    { id: "SUP-003", name: "Manufacturer Epsilon", contact: "sales@epsilon.com", type: "Manufacturer", status: "Actif", orders: 32 },
    { id: "SUP-004", name: "Supplier Zeta", contact: "contact@zeta.fr", type: "Distributeur", status: "Inactif", orders: 5 },
  ];

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fournisseurs</h1>
            <p className="text-muted-foreground mt-1">Gérez votre réseau de fournisseurs</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau fournisseur
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Liste des fournisseurs</CardTitle>
                <CardDescription>Tous vos partenaires fournisseurs</CardDescription>
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
                  <TableHead>Nom</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Commandes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{supplier.id}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{supplier.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.status === "Actif" ? "default" : "secondary"}>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{supplier.orders}</TableCell>
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

export default Suppliers;
