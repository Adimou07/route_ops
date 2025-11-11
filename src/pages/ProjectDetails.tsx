import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  Plus,
  Download,
  Upload,
  MoreVertical
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Mock data - replace with API call
  const project = {
    id: id || "PROJ-00123",
    name: "Installation Réseau Client A",
    client: "Entreprise Alpha",
    status: "En cours",
    priority: "Haute",
    progress: 65,
    budget: 75000,
    spent: 48750,
    startDate: "15/03/2024",
    endDate: "30/06/2024",
    description: "Installation complète du réseau informatique avec migration des serveurs et formation du personnel.",
    manager: {
      name: "Jean Dupont",
      email: "jean.dupont@company.com",
      avatar: "https://i.pravatar.cc/150?img=1"
    }
  };

  const timelineEvents = [
    {
      id: 1,
      type: "client",
      title: "Projet créé",
      description: "Le projet a été créé dans le système",
      date: "15/03/2024",
      time: "09:30",
      user: "Marie Dubois"
    },
    {
      id: 2,
      type: "internal",
      title: "Manager assigné",
      description: "Jean Dupont a été assigné comme chef de projet",
      date: "15/03/2024",
      time: "14:20",
      user: "Marie Dubois"
    },
    {
      id: 3,
      type: "supplier",
      title: "Commande fournisseur créée",
      description: "Commande PO-00234 envoyée au fournisseur",
      date: "18/03/2024",
      time: "10:15",
      user: "Jean Dupont"
    },
    {
      id: 4,
      type: "internal",
      title: "Progression mise à jour",
      description: "Phase d'installation démarrée - 45% complété",
      date: "25/03/2024",
      time: "16:45",
      user: "Jean Dupont"
    }
  ];

  const tasks = [
    {
      id: "TASK-001",
      title: "Installation des serveurs principaux",
      status: "Terminé",
      priority: "Haute",
      assignee: { name: "Pierre Martin", avatar: "https://i.pravatar.cc/150?img=2" },
      dueDate: "20/03/2024",
      progress: 100
    },
    {
      id: "TASK-002",
      title: "Configuration du réseau",
      status: "En cours",
      priority: "Haute",
      assignee: { name: "Sophie Bernard", avatar: "https://i.pravatar.cc/150?img=3" },
      dueDate: "30/03/2024",
      progress: 65
    },
    {
      id: "TASK-003",
      title: "Tests de sécurité",
      status: "En attente",
      priority: "Moyenne",
      assignee: { name: "Luc Leroy", avatar: "https://i.pravatar.cc/150?img=4" },
      dueDate: "10/04/2024",
      progress: 0
    },
    {
      id: "TASK-004",
      title: "Formation du personnel",
      status: "Planifié",
      priority: "Basse",
      assignee: { name: "Anne Petit", avatar: "https://i.pravatar.cc/150?img=5" },
      dueDate: "25/04/2024",
      progress: 0
    }
  ];

  const documents = [
    {
      id: "DOC-001",
      title: "Cahier des charges.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedBy: "Marie Dubois",
      uploadedDate: "15/03/2024",
      category: "Contrat"
    },
    {
      id: "DOC-002",
      title: "Plan réseau.dwg",
      type: "DWG",
      size: "5.1 MB",
      uploadedBy: "Jean Dupont",
      uploadedDate: "18/03/2024",
      category: "Technique"
    },
    {
      id: "DOC-003",
      title: "Facture fournisseur.pdf",
      type: "PDF",
      size: "156 KB",
      uploadedBy: "Sophie Bernard",
      uploadedDate: "22/03/2024",
      category: "Finance"
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Jean Dupont",
      role: "Chef de projet",
      email: "jean.dupont@company.com",
      avatar: "https://i.pravatar.cc/150?img=1",
      status: "active"
    },
    {
      id: 2,
      name: "Pierre Martin",
      role: "Ingénieur réseau",
      email: "pierre.martin@company.com",
      avatar: "https://i.pravatar.cc/150?img=2",
      status: "active"
    },
    {
      id: 3,
      name: "Sophie Bernard",
      role: "Technicienne",
      email: "sophie.bernard@company.com",
      avatar: "https://i.pravatar.cc/150?img=3",
      status: "active"
    },
    {
      id: 4,
      name: "Luc Leroy",
      role: "Sécurité IT",
      email: "luc.leroy@company.com",
      avatar: "https://i.pravatar.cc/150?img=4",
      status: "active"
    }
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

  const getTypeColor = (type: string) => {
    switch(type) {
      case "client": return "border-l-4 border-l-success";
      case "supplier": return "border-l-4 border-l-primary";
      case "internal": return "border-l-4 border-l-warning";
      default: return "border-l-4 border-l-muted";
    }
  };

  const budgetPercent = (project.spent / project.budget) * 100;

  return (
    <AppLayout>
      <div className="p-8 space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                {project.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {project.id} • Client: {project.client}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Échéance</p>
                  <p className="text-lg font-bold">{project.endDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progression</p>
                  <p className="text-lg font-bold">{project.progress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-lg font-bold">{project.budget.toLocaleString()}€</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Équipe</p>
                  <p className="text-lg font-bold">{teamMembers.length} membres</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informations du projet</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                    <span className={`px-3 py-1 rounded-md text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{project.description}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Date de début</p>
                    <p className="text-sm font-semibold">{project.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Date de fin</p>
                    <p className="text-sm font-semibold">{project.endDate}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Utilisation du budget</p>
                    <p className="text-sm font-semibold">{budgetPercent.toFixed(1)}%</p>
                  </div>
                  <Progress value={budgetPercent} className="h-2" />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">Dépensé: {project.spent.toLocaleString()}€</p>
                    <p className="text-xs text-muted-foreground">Budget: {project.budget.toLocaleString()}€</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs - Tasks, Timeline, Documents */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="tasks" className="w-full">
                  <div className="border-b px-6">
                    <TabsList className="bg-transparent">
                      <TabsTrigger value="tasks">Tâches ({tasks.length})</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="tasks" className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Liste des tâches</h3>
                      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle tâche
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Créer une nouvelle tâche</DialogTitle>
                            <DialogDescription>Ajouter une tâche au projet</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Titre de la tâche</Label>
                              <Input placeholder="Nom de la tâche" />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea placeholder="Description..." rows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Priorité</Label>
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
                                <Label>Assignée à</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {teamMembers.map(member => (
                                      <SelectItem key={member.id} value={member.id.toString()}>
                                        {member.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Date d'échéance</Label>
                              <Input type="date" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>Annuler</Button>
                            <Button onClick={() => setIsTaskModalOpen(false)}>Créer</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div key={task.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm">{task.title}</h4>
                                <Badge variant={getStatusColor(task.status)} className="text-xs">
                                  {task.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{task.id}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={task.assignee.avatar} />
                                <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {task.dueDate}
                              </span>
                              <div className="flex items-center gap-2">
                                <Progress value={task.progress} className="w-16 h-1" />
                                <span className="text-xs font-medium">{task.progress}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="p-6 space-y-4">
                    <h3 className="font-semibold">Historique du projet</h3>
                    <div className="relative space-y-4">
                      {/* Timeline line */}
                      <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-border" />
                      
                      {timelineEvents.map((event, index) => (
                        <div key={event.id} className={`relative pl-14 pb-4 ${getTypeColor(event.type)} rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors animate-fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="absolute left-4 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">{event.title}</h4>
                              <span className="text-xs text-muted-foreground">{event.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{event.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs font-medium text-muted-foreground">{event.user}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{event.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Documents attachés</h3>
                      <Dialog open={isDocModalOpen} onOpenChange={setIsDocModalOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Ajouter document
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ajouter un document</DialogTitle>
                            <DialogDescription>Télécharger un document pour ce projet</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Titre du document</Label>
                              <Input placeholder="Nom du fichier" />
                            </div>
                            <div className="space-y-2">
                              <Label>Catégorie</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="contract">Contrat</SelectItem>
                                  <SelectItem value="technical">Technique</SelectItem>
                                  <SelectItem value="finance">Finance</SelectItem>
                                  <SelectItem value="other">Autre</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Fichier</Label>
                              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mb-2">Glissez un fichier ou cliquez pour parcourir</p>
                                <Input type="file" className="hidden" id="file-upload" />
                                <Label htmlFor="file-upload" className="cursor-pointer">
                                  <Button variant="outline" size="sm" asChild>
                                    <span>Parcourir</span>
                                  </Button>
                                </Label>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDocModalOpen(false)}>Annuler</Button>
                            <Button onClick={() => setIsDocModalOpen(false)}>Télécharger</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{doc.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {doc.category} • {doc.size} • Ajouté par {doc.uploadedBy}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Télécharger</DropdownMenuItem>
                                <DropdownMenuItem>Renommer</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Project Manager */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chef de projet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={project.manager.avatar} />
                    <AvatarFallback>{project.manager.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{project.manager.name}</p>
                    <p className="text-xs text-muted-foreground">{project.manager.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Équipe ({teamMembers.length})</CardTitle>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-success" title="Actif" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistiques rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tâches terminées</span>
                  <span className="font-semibold">1/4</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Documents</span>
                  <span className="font-semibold">{documents.length}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Jours restants</span>
                  <span className="font-semibold text-warning">45</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Budget restant</span>
                  <span className="font-semibold text-success">{(project.budget - project.spent).toLocaleString()}€</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;
