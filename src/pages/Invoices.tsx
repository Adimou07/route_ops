import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Eye, Edit, Trash2, Download, Send } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Invoices = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("customer");

  const customerInvoices = [
    {
      code: "INV-00001",
      type: "CUSTOMER",
      customer: "Entreprise Alpha",
      salesOrder: "SO-00001",
      issuedDate: "2024-01-15",
      dueDate: "2024-02-15",
      totalHt: 45000,
      totalVat: 9000,
      totalTtc: 54000,
      status: "PAID",
      paidDate: "2024-02-10"
    },
    {
      code: "INV-00002",
      type: "CUSTOMER",
      customer: "Société Beta",
      salesOrder: "SO-00002",
      issuedDate: "2024-01-20",
      dueDate: "2024-02-20",
      totalHt: 28500,
      totalVat: 5700,
      totalTtc: 34200,
      status: "SENT",
      paidDate: null
    },
    {
      code: "INV-00003",
      type: "CUSTOMER",
      customer: "Client Gamma",
      salesOrder: "SO-00003",
      issuedDate: "2024-01-25",
      dueDate: "2024-02-05",
      totalHt: 12750,
      totalVat: 2550,
      totalTtc: 15300,
      status: "OVERDUE",
      paidDate: null
    },
  ];

  const supplierInvoices = [
    {
      code: "INV-00004",
      type: "SUPPLIER",
      supplier: "Fournisseur Delta",
      purchaseOrder: "PO-00001",
      issuedDate: "2024-01-10",
      dueDate: "2024-02-10",
      totalHt: 38000,
      totalVat: 7600,
      totalTtc: 45600,
      status: "PAID",
      paidDate: "2024-02-08"
    },
    {
      code: "INV-00005",
      type: "SUPPLIER",
      supplier: "Fournisseur Epsilon",
      purchaseOrder: "PO-00002",
      issuedDate: "2024-01-18",
      dueDate: "2024-02-18",
      totalHt: 24000,
      totalVat: 4800,
      totalTtc: 28800,
      status: "SENT",
      paidDate: null
    },
  ];

  const getStatusVariant = (status: string) => {
    switch(status) {
      case "PAID": return "default";
      case "SENT": return "secondary";
      case "OVERDUE": return "destructive";
      case "DRAFT": return "outline";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case "DRAFT": return "Brouillon";
      case "SENT": return "Envoyée";
      case "PAID": return "Payée";
      case "OVERDUE": return "En retard";
      case "CANCELLED": return "Annulée";
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Factures</h1>
            <p className="text-muted-foreground mt-1">Gérez les factures clients et fournisseurs</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle Facture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer une Facture</DialogTitle>
                <DialogDescription>
                  Remplissez les informations de la facture
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de facture *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Facture client</SelectItem>
                        <SelectItem value="SUPPLIER">Facture fournisseur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entity">Client/Fournisseur *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Entreprise Alpha</SelectItem>
                        <SelectItem value="2">Société Beta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issuedDate">Date émission</Label>
                    <Input type="date" id="issuedDate" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Date échéance</Label>
                    <Input type="date" id="dueDate" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select defaultValue="DRAFT">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="SENT">Envoyée</SelectItem>
                        <SelectItem value="PAID">Payée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Articles</Label>
                  <div className="border rounded-md p-4 space-y-3">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4">
                        <Input placeholder="Désignation" />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" placeholder="Qté" defaultValue="1" />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" placeholder="Prix U." />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" placeholder="TVA %" defaultValue="20" />
                      </div>
                      <div className="col-span-1">
                        <Input disabled placeholder="Total" />
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un article
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-md">
                  <div>
                    <Label className="text-sm text-muted-foreground">Total HT</Label>
                    <div className="text-xl font-bold">0,00 €</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">TVA</Label>
                    <div className="text-xl font-bold">0,00 €</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Total TTC</Label>
                    <div className="text-xl font-bold text-primary">0,00 €</div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button onClick={() => setOpen(false)}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Factures</CardDescription>
              <CardTitle className="text-3xl">
                {customerInvoices.length + supplierInvoices.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Payées</CardDescription>
              <CardTitle className="text-3xl text-success">
                {[...customerInvoices, ...supplierInvoices].filter(inv => inv.status === "PAID").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>En retard</CardDescription>
              <CardTitle className="text-3xl text-destructive">
                {[...customerInvoices, ...supplierInvoices].filter(inv => inv.status === "OVERDUE").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Montant total</CardDescription>
              <CardTitle className="text-2xl">
                {formatCurrency([...customerInvoices, ...supplierInvoices].reduce((sum, inv) => sum + inv.totalTtc, 0))}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer">Factures Clients</TabsTrigger>
            <TabsTrigger value="supplier">Factures Fournisseurs</TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Factures Clients</CardTitle>
                    <CardDescription>Factures émises aux clients</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="SENT">Envoyée</SelectItem>
                        <SelectItem value="PAID">Payée</SelectItem>
                        <SelectItem value="OVERDUE">En retard</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Rechercher..." className="pl-9 w-64" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Facture</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Commande</TableHead>
                      <TableHead>Date émission</TableHead>
                      <TableHead>Date échéance</TableHead>
                      <TableHead>Montant HT</TableHead>
                      <TableHead>Montant TTC</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerInvoices.map((invoice) => (
                      <TableRow key={invoice.code}>
                        <TableCell className="font-medium">{invoice.code}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>{invoice.salesOrder}</TableCell>
                        <TableCell>{invoice.issuedDate}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{formatCurrency(invoice.totalHt)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(invoice.totalTtc)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(invoice.status)}>
                            {getStatusLabel(invoice.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" title="Voir">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Télécharger PDF">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Envoyer">
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Modifier">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Supprimer" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supplier" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Factures Fournisseurs</CardTitle>
                    <CardDescription>Factures reçues des fournisseurs</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="SENT">Envoyée</SelectItem>
                        <SelectItem value="PAID">Payée</SelectItem>
                        <SelectItem value="OVERDUE">En retard</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Rechercher..." className="pl-9 w-64" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Facture</TableHead>
                      <TableHead>Fournisseur</TableHead>
                      <TableHead>Commande</TableHead>
                      <TableHead>Date émission</TableHead>
                      <TableHead>Date échéance</TableHead>
                      <TableHead>Montant HT</TableHead>
                      <TableHead>Montant TTC</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierInvoices.map((invoice) => (
                      <TableRow key={invoice.code}>
                        <TableCell className="font-medium">{invoice.code}</TableCell>
                        <TableCell>{invoice.supplier}</TableCell>
                        <TableCell>{invoice.purchaseOrder}</TableCell>
                        <TableCell>{invoice.issuedDate}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{formatCurrency(invoice.totalHt)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(invoice.totalTtc)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(invoice.status)}>
                            {getStatusLabel(invoice.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" title="Voir">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Télécharger PDF">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Modifier">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Supprimer" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Invoices;