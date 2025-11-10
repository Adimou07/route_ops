import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Eye, Edit, Trash2, FileText, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const RFQ = () => {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  
  const rfqs = [
    { 
      code: "RFQ-00001", 
      customer: "Entreprise Alpha", 
      project: "PROJ-00001",
      items: 3,
      rfqDate: "2024-01-15",
      responseDeadline: "2024-01-30",
      status: "PENDING",
      createdBy: "Marie Dubois",
      notes: "Demande urgente pour serveurs Dell"
    },
    { 
      code: "RFQ-00002", 
      customer: "Société Beta", 
      project: "PROJ-00002",
      items: 2,
      rfqDate: "2024-01-14",
      responseDeadline: "2024-01-28",
      status: "QUOTED",
      createdBy: "Jean Martin",
      notes: "Switches Cisco pour datacenter"
    },
    { 
      code: "RFQ-00003", 
      customer: "Client Gamma", 
      project: null,
      items: 1,
      rfqDate: "2024-01-13",
      responseDeadline: "2024-01-25",
      status: "ACCEPTED",
      createdBy: "Sophie Durand",
      notes: "Stockage NAS haute capacité"
    },
  ];

  const getStatusVariant = (status: string) => {
    switch(status) {
      case "ACCEPTED": return "default";
      case "QUOTED": return "secondary";
      case "REJECTED": return "destructive";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case "PENDING": return "En attente";
      case "QUOTED": return "Devisé";
      case "ACCEPTED": return "Accepté";
      case "REJECTED": return "Rejeté";
      default: return status;
    }
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Demandes de Prix (RFQ)</h1>
            <p className="text-muted-foreground mt-1">Gérez les demandes de devis clients</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle RFQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer une Demande de Prix</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer une nouvelle RFQ
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Client *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Entreprise Alpha</SelectItem>
                        <SelectItem value="2">Société Beta</SelectItem>
                        <SelectItem value="3">Client Gamma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project">Projet (optionnel)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Lier à un projet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">PROJ-00001</SelectItem>
                        <SelectItem value="2">PROJ-00002</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rfqDate">Date RFQ</Label>
                    <Input type="date" id="rfqDate" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Date limite réponse</Label>
                    <Input type="date" id="deadline" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Détails de la demande..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Articles demandés</Label>
                  <div className="border rounded-md p-4 space-y-3">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
                        <Input placeholder="Désignation" />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" placeholder="Qté" defaultValue="1" />
                      </div>
                      <div className="col-span-4">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Fabricant" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Dell</SelectItem>
                            <SelectItem value="2">HP</SelectItem>
                            <SelectItem value="3">Cisco</SelectItem>
                          </SelectContent>
                        </Select>
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button onClick={() => setOpen(false)}>Créer la RFQ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total RFQs</CardDescription>
              <CardTitle className="text-3xl">24</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>En attente</CardDescription>
              <CardTitle className="text-3xl text-warning">8</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Devisées</CardDescription>
              <CardTitle className="text-3xl text-primary">10</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Acceptées</CardDescription>
              <CardTitle className="text-3xl text-success">6</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Liste des RFQ</CardTitle>
                <CardDescription>Toutes les demandes de prix en cours</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="QUOTED">Devisé</SelectItem>
                    <SelectItem value="ACCEPTED">Accepté</SelectItem>
                    <SelectItem value="REJECTED">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
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
                  <TableHead>Projet</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Date RFQ</TableHead>
                  <TableHead>Date limite</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé par</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfqs.map((rfq) => (
                  <TableRow key={rfq.code} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{rfq.code}</TableCell>
                    <TableCell>{rfq.customer}</TableCell>
                    <TableCell>{rfq.project || "-"}</TableCell>
                    <TableCell>{rfq.items}</TableCell>
                    <TableCell>{rfq.rfqDate}</TableCell>
                    <TableCell>{rfq.responseDeadline}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(rfq.status)}>
                        {getStatusLabel(rfq.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{rfq.createdBy}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Voir">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Convertir en SO">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Documents">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Supprimer" className="text-destructive hover:text-destructive">
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
      </div>
    </AppLayout>
  );
};

export default RFQ;
