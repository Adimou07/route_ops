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
import { fetchProjects, createProject, deleteProject, updateProjectStatus } from "@/api/projects";
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

  // Formulaire de création de projet
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCustomerId, setNewCustomerId] = useState<string>("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newBudget, setNewBudget] = useState<string>("");
  const [newPriority, setNewPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "">("");

  // Fetch projects from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiProjects = await fetchProjects();
        setProjectsData(apiProjects);

        // TODO: remplacer par un vrai appel API clients quand disponible
        setCustomers([]);
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
      // Mise à jour optimiste locale uniquement (sans appel API pour l'instant)
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

    const previous = projectsData;

    // Suppression optimiste
    setProjectsData(prev => prev.filter(p => p.id !== projectId));

    try {
      await deleteProject(projectId);
      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé avec succès",
      });
    } catch (err: any) {
      // rollback en cas d'erreur
      setProjectsData(previous);
      toast({
        title: "Erreur",
        description: err?.message || "Impossible de supprimer le projet.",
        variant: "destructive",
      });
    }
  };

  const resetCreateForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewCustomerId("");
    setNewStartDate("");
    setNewEndDate("");
    setNewBudget("");
    setNewPriority("");
  };

  const handleCreateProject = async () => {
    if (!newTitle.trim()) {
      toast({
        title: "Champs manquants",
        description: "Merci de renseigner au minimum le titre du projet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const created = await createProject({
        title: newTitle,
        description: newDescription,
        customerId: newCustomerId ? Number(newCustomerId) : null,
        status: "PENDING",
        startDate: newStartDate,
        endDate: newEndDate || null,
        budget: Number(newBudget),
        priority: newPriority || "MEDIUM",
        managerId: null,
      });

      setProjectsData(prev => [created, ...prev]);
      toast({
        title: "Projet créé",
        description: `Le projet "${created.title}" a été créé avec succès.`,
      });
      resetCreateForm();
      setIsCreateModalOpen(false);
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err?.message || "Impossible de créer le projet.",
        variant: "destructive",
      });
    }
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
      <div className="p-8 space-y-6 bg-muted/40">
        {/* Page Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-2xl">
          <div className="px-6 py-6 sm:px-10 sm:py-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground flex items-center gap-3">
                <FolderOpen className="h-8 w-8" />
                Gestion des Projets
              </h1>
              <p className="text-sm sm:text-base text-primary-foreground/80 mt-1">
                Gérez vos projets et suivez leur avancement.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2 bg-primary/20 border-primary/50 text-primary-foreground hover:bg-primary/30 hover:border-primary/70 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Filter className="h-4 w-4" />
                Exporter
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all duration-200"
                  >
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
                      <Input
                        id="project-title"
                        placeholder="Nom du projet"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-client">Client (ID)</Label>
                      <Input
                        id="project-client"
                        type="number"
                        placeholder="ID client (optionnel)"
                        value={newCustomerId}
                        onChange={(e) => setNewCustomerId(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Date de début</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newStartDate}
                        onChange={(e) => setNewStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">Date d'échéance</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priorité</Label>
                      <Select
                        value={newPriority || undefined}
                        onValueChange={(value) => setNewPriority(value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Basse</SelectItem>
                          <SelectItem value="MEDIUM">Moyenne</SelectItem>
                          <SelectItem value="HIGH">Haute</SelectItem>
                          <SelectItem value="CRITICAL">Critique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="50000"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Description du projet..."
                      rows={4}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Annuler</Button>
                  <Button onClick={handleCreateProject}>Créer le projet</Button>
                </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="cursor-pointer border-border/60 bg-card/95 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            >
              <CardContent className="px-4 py-3">
                <div className="flex items-start justify-between mb-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `hsl(var(--${stat.color}) / 0.12)` }}
                  >
                    <stat.icon
                      className="h-4 w-4"
                      style={{ color: `hsl(var(--${stat.color}))` }}
                    />
                  </div>
                </div>
                <div className="text-xl font-semibold text-foreground leading-tight mb-0.5">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
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
                        <TableRow
                          key={project.id}
                          className="hover:bg-muted/60 hover:border-l-4 hover:border-primary/70 transition-colors cursor-pointer"
                        >
                          <TableCell className="font-medium font-mono text-xs text-muted-foreground">
                            {project.code}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {project.title}
                          </TableCell>
                          <TableCell className="text-sm">
                            {project.customer?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusColor(project.status)}
                              className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-md text-[11px] font-semibold ${getPriorityColor(project.priority)}`}
                            >
                              {project.priority}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress || 0} className="w-24 h-2" />
                              <span className="text-xs text-muted-foreground font-medium">
                                {project.progress || 0}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {project.budget?.toLocaleString()} €
                          </TableCell>
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
