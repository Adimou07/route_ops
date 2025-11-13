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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { mockProjects } from "@/data/mockData";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KanbanColumn } from "@/components/projects/KanbanColumn";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Progress } from "@/components/ui/progress";

const Projects = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Fetch projects from mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProjectsData(mockProjects);
        setCustomers(mockProjects.map(p => p.customer));
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des projets");
        toast({
          title: "Erreur",
          description: "Impossible de charger les projets.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeProject = projectsData.find(p => p.id.toString() === active.id);
    const newStatus = over.id as string;

    if (activeProject && activeProject.status !== newStatus) {
      // Optimistic update for mock data
      setProjectsData(prev => 
        prev.map(project => 
          project.id.toString() === active.id 
            ? { ...project, status: newStatus }
            : project
        )
      );
      
      toast({
        title: "Statut mis à jour",
        description: `Le projet a été déplacé vers "${newStatus}"`,
      });
    }

    setActiveId(null);
  };

  const handleViewProject = (projectId: string | number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleDeleteProject = async (projectId: string | number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

    // Mock deletion
    setProjectsData(prev => prev.filter(p => p.id !== projectId));
    toast({
      title: "Projet supprimé",
      description: "Le projet a été supprimé avec succès",
    });
  };

  // Filter projects based on search and filters
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = searchQuery === "" || 
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = [
    { label: "Total Projets", value: projectsData.length.toString(), icon: FolderOpen, color: "primary" },
    { label: "Actifs", value: projectsData.filter(p => p.status === "ACTIVE").length.toString(), icon: CheckCircle, color: "success" },
    { label: "En Attente", value: projectsData.filter(p => p.status === "PENDING").length.toString(), icon: Clock, color: "warning" },
    { label: "Complétés", value: projectsData.filter(p => p.status === "COMPLETED").length.toString(), icon: TrendingUp, color: "info" },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "COMPLETED": return "default";
      case "ACTIVE": return "secondary";
      case "PENDING": return "outline";
      case "ON_HOLD": return "outline";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "HIGH": return "bg-destructive/10 text-destructive";
      case "MEDIUM": return "bg-warning/10 text-warning";
      case "LOW": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const kanbanColumns = {
    "PENDING": filteredProjects.filter(p => p.status === "PENDING"),
    "ON_HOLD": filteredProjects.filter(p => p.status === "ON_HOLD"),
    "ACTIVE": filteredProjects.filter(p => p.status === "ACTIVE"),
    "COMPLETED": filteredProjects.filter(p => p.status === "COMPLETED"),
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8">
          <LoadingState message="Chargement des projets..." />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-8">
          <ErrorState 
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </AppLayout>
    );
  }

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
                      <Label htmlFor="project-title">Titre du projet</Label>
                      <Input id="project-title" placeholder="Nom du projet" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-client">Client</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id.toString()}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                          <SelectItem value="HIGH">Haute</SelectItem>
                          <SelectItem value="MEDIUM">Moyenne</SelectItem>
                          <SelectItem value="LOW">Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Input id="budget" type="number" placeholder="50000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Description du projet..." rows={4} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Annuler</Button>
                  <Button onClick={() => {
                    setIsCreateModalOpen(false);
                    toast({
                      title: "Projet créé",
                      description: "Le projet a été créé avec succès",
                    });
                  }}>Créer le projet</Button>
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
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `hsl(var(--${stat.color}) / 0.1)` }}>
                    <stat.icon className="h-6 w-6" style={{ color: `hsl(var(--${stat.color}))` }} />
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
                <CardDescription>{filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}</CardDescription>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="ON_HOLD">En pause</SelectItem>
                    <SelectItem value="COMPLETED">Complété</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="HIGH">Haute</SelectItem>
                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                    <SelectItem value="LOW">Basse</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-9 w-64" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
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
                      <TableHead>Statut</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Progression</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Aucun projet trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProjects.map((project) => (
                        <TableRow key={project.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium font-mono text-xs">{project.code}</TableCell>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.customer?.name || "N/A"}</TableCell>
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
                              <Progress value={project.progress || 0} className="w-24 h-2" />
                              <span className="text-xs text-muted-foreground font-medium">{project.progress || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{project.budget?.toLocaleString()} €</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleViewProject(project.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(kanbanColumns).map(([status, projects]) => (
                    <KanbanColumn
                      key={status}
                      title={status}
                      projects={projects}
                      onViewProject={handleViewProject}
                    />
                  ))}
                </div>
                <DragOverlay>
                  {activeId ? (
                    <ProjectCard
                      project={filteredProjects.find(p => p.id.toString() === activeId)!}
                      getPriorityColor={getPriorityColor}
                      onViewProject={handleViewProject}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Projects;
