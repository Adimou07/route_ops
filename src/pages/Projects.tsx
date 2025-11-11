import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, LayoutGrid, List, Calendar, Edit, Eye, Trash2, FolderOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Projects = () => {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const projects = [
    { 
      id: "PROJ-00123", 
      name: "Installation Réseau Client A", 
      client: "Entreprise Alpha", 
      status: "En cours", 
      priority: "Haute",
      progress: 65, 
      budget: "75 000€",
      startDate: "15/03/2024",
      endDate: "30/06/2024",
      description: "Installation complète du réseau informatique",
      manager: "Jean Dupont"
    },
    { 
      id: "PROJ-00124", 
      name: "Migration Datacenter B", 
      client: "Société Beta", 
      status: "En attente", 
      priority: "Moyenne",
      progress: 30, 
      budget: "125 000€",
      startDate: "22/03/2024",
      endDate: "15/07/2024",
      description: "Migration des serveurs vers nouveau datacenter",
      manager: "Marie Martin"
    },
    { 
      id: "PROJ-00125", 
      name: "Déploiement Serveurs C", 
      client: "Client Gamma", 
      status: "Terminé", 
      priority: "Basse",
      progress: 100, 
      budget: "45 000€",
      startDate: "05/04/2024",
      endDate: "20/05/2024",
      description: "Déploiement de nouveaux serveurs",
      manager: "Pierre Dubois"
    },
    { 
      id: "PROJ-00126", 
      name: "Audit Sécurité D", 
      client: "Entreprise Delta", 
      status: "En cours", 
      priority: "Haute",
      progress: 45, 
      budget: "32 000€",
      startDate: "10/04/2024",
      endDate: "25/06/2024",
      description: "Audit complet de sécurité informatique",
      manager: "Sophie Bernard"
    },
    { 
      id: "PROJ-00127", 
      name: "Mise à jour Infrastructure", 
      client: "Entreprise Epsilon", 
      status: "Planifié", 
      priority: "Moyenne",
      progress: 10, 
      budget: "89 000€",
      startDate: "01/05/2024",
      endDate: "30/08/2024",
      description: "Modernisation infrastructure IT",
      manager: "Luc Leroy"
    },
    { 
      id: "PROJ-00128", 
      name: "Formation Équipe IT", 
      client: "Groupe Zeta", 
      status: "En cours", 
      priority: "Basse",
      progress: 55, 
      budget: "18 000€",
      startDate: "12/04/2024",
      endDate: "15/06/2024",
      description: "Programme de formation continue",
      manager: "Anne Petit"
    },
  ];

  const stats = [
    { label: "Total Projets", value: "24", icon: FolderOpen, color: "primary" },
    { label: "Marchés Remportés", value: "18", icon: CheckCircle, color: "success" },
    { label: "En Attente", value: "6", icon: Clock, color: "warning" },
    { label: "Taux de Conversion", value: "75%", icon: TrendingUp, color: "info" },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Terminé": return "default";
      case "En cours": return "secondary";
      case "En attente": return "outline";
      case "Planifié": return "outline";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "Haute": return "bg-destructive/10 text-destructive";
      case "Moyenne": return "bg-warning/10 text-warning";
      case "Basse": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const kanbanColumns = {
    "Planifié": projects.filter(p => p.status === "Planifié"),
    "En attente": projects.filter(p => p.status === "En attente"),
    "En cours": projects.filter(p => p.status === "En cours"),
    "Terminé": projects.filter(p => p.status === "Terminé"),
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FolderOpen className="h-8 w-8" />
              Gestion des Projets
            </h1>
            <p className="text-muted-foreground mt-1">Gérez vos projets et suivez leur avancement</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nouveau projet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer un Nouveau Projet</DialogTitle>
                  <DialogDescription>Remplissez les informations du projet</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-ref">Référence</Label>
                      <Input id="project-ref" placeholder="PROJ-00XXX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-client">Client</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client1">Entreprise Alpha</SelectItem>
                          <SelectItem value="client2">Société Beta</SelectItem>
                          <SelectItem value="client3">Client Gamma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Nom du projet</Label>
                    <Input id="project-name" placeholder="Nom du projet" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Date de début</Label>
                      <Input id="start-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">Date d'échéance</Label>
                      <Input id="end-date" type="date" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priorité</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Haute</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="low">Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Input id="budget" type="text" placeholder="50 000€" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Description du projet..." rows={4} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Annuler</Button>
                  <Button onClick={() => setIsCreateModalOpen(false)}>Créer le projet</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <Card key={index} className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-l-4" style={{ borderLeftColor: `hsl(var(--${stat.color}))` }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}/10`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-xl">Liste des projets</CardTitle>
                <CardDescription>Vue d'ensemble de tous vos projets</CardDescription>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="planifie">Planifié</SelectItem>
                    <SelectItem value="attente">En attente</SelectItem>
                    <SelectItem value="cours">En cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Basse</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-9 w-64" />
                </div>
                <div className="flex border rounded-lg p-1 bg-muted/50">
                  <Button 
                    variant={viewMode === "table" ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="gap-2"
                  >
                    <List className="h-4 w-4" />
                    Liste
                  </Button>
                  <Button 
                    variant={viewMode === "kanban" ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => setViewMode("kanban")}
                    className="gap-2"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Kanban
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "table" ? (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Référence</TableHead>
                      <TableHead>Nom du projet</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Progression</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{project.id}</TableCell>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell>{project.manager}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">{project.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{project.budget}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(kanbanColumns).map(([status, projectsList]) => (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold text-sm">{status}</h3>
                      <Badge variant="secondary">{projectsList.length}</Badge>
                    </div>
                    <div className="space-y-3 min-h-[400px]">
                      {projectsList.map((project) => (
                        <Card key={project.id} className="cursor-pointer hover:shadow-md transition-all group">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <span className="text-xs font-mono text-muted-foreground">{project.id}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                                {project.priority}
                              </span>
                            </div>
                            <h4 className="font-semibold text-sm leading-tight line-clamp-2">{project.name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                            <div className="space-y-2 pt-2 border-t">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Client:</span>
                                <span className="font-medium">{project.client}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Manager:</span>
                                <span className="font-medium">{project.manager}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Budget:</span>
                                <span className="font-semibold">{project.budget}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Progression</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-1.5">
                                <div 
                                  className="bg-primary h-1.5 rounded-full transition-all"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-8 w-full">
                                <Eye className="h-3 w-3 mr-1" />
                                Voir
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-full">
                                <Edit className="h-3 w-3 mr-1" />
                                Modifier
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {projectsList.length === 0 && (
                        <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                          <p className="text-sm text-muted-foreground">Aucun projet</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Projects;
