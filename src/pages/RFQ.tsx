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

const RFQ = () => {
  const rfqs = [
    { id: "RFQ-2024-001", client: "Entreprise Alpha", items: "Serveurs Dell", quantity: 5, date: "2024-01-15", status: "En attente" },
    { id: "RFQ-2024-002", client: "Société Beta", items: "Switches Cisco", quantity: 10, date: "2024-01-14", status: "Devisé" },
    { id: "RFQ-2024-003", client: "Client Gamma", items: "Stockage NAS", quantity: 2, date: "2024-01-13", status: "Converti" },
  ];

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Demandes de Prix (RFQ)</h1>
            <p className="text-muted-foreground mt-1">Gérez les demandes de devis clients</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle RFQ
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Liste des RFQ</CardTitle>
                <CardDescription>Toutes les demandes de prix en cours</CardDescription>
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
                  <TableHead>Articles</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfqs.map((rfq) => (
                  <TableRow key={rfq.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{rfq.id}</TableCell>
                    <TableCell>{rfq.client}</TableCell>
                    <TableCell>{rfq.items}</TableCell>
                    <TableCell>{rfq.quantity}</TableCell>
                    <TableCell>{rfq.date}</TableCell>
                    <TableCell>
                      <Badge variant={rfq.status === "Converti" ? "default" : rfq.status === "Devisé" ? "secondary" : "outline"}>
                        {rfq.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Traiter</Button>
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

export default RFQ;
