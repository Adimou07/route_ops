import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Eye, Edit, Trash2, Globe, Mail, Phone, Factory } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Manufacturers = () => {
  const [open, setOpen] = useState(false);

  const manufacturers = [
    {
      code: "MANU-00001",
      name: "Dell Technologies",
      brandName: "Dell",
      email: "contact@dell.com",
      phone: "+1-800-289-3355",
      country: "États-Unis",
      website: "www.dell.com",
      isActive: true,
      createdBy: "Admin"
    },
    {
      code: "MANU-00002",
      name: "Cisco Systems",
      brandName: "Cisco",
      email: "info@cisco.com",
      phone: "+1-408-526-4000",
      country: "États-Unis",
      website: "www.cisco.com",
      isActive: true,
      createdBy: "Admin"
    },
    {
      code: "MANU-00003",
      name: "Hewlett Packard Enterprise",
      brandName: "HPE",
      email: "contact@hpe.com",
      phone: "+1-650-857-1501",
      country: "États-Unis",
      website: "www.hpe.com",
      isActive: true,
      createdBy: "Admin"
    },
  ];

  return (
    <AppLayout>
      <div className="p-8 space-y-6 bg-muted/40">
        {/* Page Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-2xl">
          <div className="px-6 py-6 sm:px-10 sm:py-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground flex items-center gap-3">
                <Factory className="h-8 w-8" />
                Fabricants
              </h1>
              <p className="text-sm sm:text-base text-primary-foreground/80 mt-1">
                Gérez les constructeurs et marques (OEM) référencés.
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all duration-200">
                  <Plus className="h-4 w-4" />
                  Nouveau Fabricant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un Fabricant</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations du fabricant/constructeur
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom *</Label>
                      <Input id="name" placeholder="Dell Technologies" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brandName">Nom de marque</Label>
                      <Input id="brandName" placeholder="Dell" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="contact@fabricant.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" placeholder="+33 1 23 45 67 89" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input id="website" placeholder="www.fabricant.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input id="country" placeholder="France" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" placeholder="Paris" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" placeholder="Adresse complète" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                  <Button onClick={() => setOpen(false)}>Créer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="cursor-pointer border-border/70 bg-card/95 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
            <CardHeader className="pb-3">
              <CardDescription>Total Fabricants</CardDescription>
              <CardTitle className="text-3xl">{manufacturers.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer border-border/70 bg-card/95 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
            <CardHeader className="pb-3">
              <CardDescription>Actifs</CardDescription>
              <CardTitle className="text-3xl text-success">
                {manufacturers.filter(m => m.isActive).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer border-border/70 bg-card/95 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
            <CardHeader className="pb-3">
              <CardDescription>Inactifs</CardDescription>
              <CardTitle className="text-3xl text-muted-foreground">
                {manufacturers.filter(m => !m.isActive).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer border-border/70 bg-card/95 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
            <CardHeader className="pb-3">
              <CardDescription>Ajoutés ce mois</CardDescription>
              <CardTitle className="text-3xl">2</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Liste des Fabricants</CardTitle>
                <CardDescription>Tous les constructeurs et marques référencés</CardDescription>
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
                  <TableHead>Code</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Marque</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Pays</TableHead>
                  <TableHead>Site web</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manufacturers.map((manufacturer) => (
                  <TableRow key={manufacturer.code}>
                    <TableCell className="font-medium">{manufacturer.code}</TableCell>
                    <TableCell>{manufacturer.name}</TableCell>
                    <TableCell>{manufacturer.brandName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        {manufacturer.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{manufacturer.email}</span>
                          </div>
                        )}
                        {manufacturer.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{manufacturer.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{manufacturer.country}</TableCell>
                    <TableCell>
                      {manufacturer.website && (
                        <a 
                          href={`https://${manufacturer.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <Globe className="h-3 w-3" />
                          {manufacturer.website}
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={manufacturer.isActive ? "default" : "secondary"}>
                        {manufacturer.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Voir">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Supprimer" 
                          className="text-destructive hover:text-destructive"
                        >
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

export default Manufacturers;