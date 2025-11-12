import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Building2,
  User,
  TrendingUp,
  FolderOpen,
  MoreVertical
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: number;
  code: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  projectId: number;
  assignedTo: number | null;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: number;
  code: string;
  title: string;
  url: string;
  fileType: string;
  fileSize: number;
  linkedTable: string;
  linkedId: number;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  customerType: string;
}

interface Project {
  id: number;
  code: string;
  title: string;
  description: string;
  customerId: number;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  priority: string;
  managerId: number | null;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  manager: any;
  tasks: Task[];
  documents: Document[];
  progress: number;
}

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewAllTasks, setViewAllTasks] = useState(false);

  // Fetch project data from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch(`http://localhost:3333/api/v1/projects/${id}`);
        // const data = await response.json();
        
        // Mock data matching API structure
        const mockData: Project = {
          id: 1,
          code: "PROJ-00001",
          title: "IT Infrastructure Upgrade",
          description: "Complete overhaul of company IT infrastructure",
          customerId: 1,
          status: "ACTIVE",
          startDate: "2025-11-12",
          endDate: "2026-05-12",
          budget: 150000,
          priority: "HIGH",
          managerId: null,
          createdBy: null,
          createdAt: "2025-11-12T00:43:20.000+00:00",
          updatedAt: "2025-11-12T00:43:20.000+00:00",
          customer: {
            id: 1,
            code: "CUST-00001",
            name: "Acme Corporation",
            email: "contact@acme.com",
            phone: "+1234567890",
            address: "123 Business Street",
            city: "New York",
            country: "USA",
            customerType: "CORPORATE"
          },
          manager: null,
          tasks: [
            {
              id: 1,
              code: "TASK-00001",
              title: "Infrastructure Assessment",
              description: "Assess current infrastructure",
              status: "DONE",
              priority: "HIGH",
              dueDate: "2025-11-07",
              projectId: 1,
              assignedTo: null,
              createdBy: null,
              createdAt: "2025-11-12T00:43:20.000+00:00",
              updatedAt: "2025-11-12T00:43:20.000+00:00"
            },
            {
              id: 2,
              code: "TASK-00002",
              title: "Hardware Procurement",
              description: "Order necessary hardware",
              status: "IN_PROGRESS",
              priority: "HIGH",
              dueDate: "2025-11-22",
              projectId: 1,
              assignedTo: null,
              createdBy: null,
              createdAt: "2025-11-12T00:43:20.000+00:00",
              updatedAt: "2025-11-12T00:43:20.000+00:00"
            },
            {
              id: 3,
              code: "TASK-00003",
              title: "Network Configuration",
              description: "Configure network infrastructure",
              status: "TODO",
              priority: "MEDIUM",
              dueDate: "2025-12-01",
              projectId: 1,
              assignedTo: null,
              createdBy: null,
              createdAt: "2025-11-12T00:43:20.000+00:00",
              updatedAt: "2025-11-12T00:43:20.000+00:00"
            }
          ],
          documents: [
            {
              id: 1,
              code: "DOC-00001",
              title: "Project Proposal",
              url: "/documents/project-proposal.pdf",
              fileType: "application/pdf",
              fileSize: 2048000,
              linkedTable: "projects",
              linkedId: 1,
              createdBy: null,
              createdAt: "2025-11-12T00:43:18.000+00:00",
              updatedAt: "2025-11-12T00:43:18.000+00:00"
            },
            {
              id: 2,
              code: "DOC-00002",
              title: "Technical Specifications",
              url: "/documents/tech-specs.pdf",
              fileType: "application/pdf",
              fileSize: 1024000,
              linkedTable: "projects",
              linkedId: 1,
              createdBy: null,
              createdAt: "2025-11-12T00:43:18.000+00:00",
              updatedAt: "2025-11-12T00:43:18.000+00:00"
            }
          ],
          progress: 50
        };

        setProject(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Erreur lors du chargement du projet");
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "ACTIVE":
      case "IN_PROGRESS": return "secondary";
      case "DONE":
      case "COMPLETED": return "default";
      case "PENDING":
      case "TODO": return "outline";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "HIGH": return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      case "MEDIUM": return "bg-warning/10 text-warning hover:bg-warning/20";
      case "LOW": return "bg-success/10 text-success hover:bg-success/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTaskStats = () => {
    if (!project) return { total: 0, done: 0, inProgress: 0, todo: 0 };
    return {
      total: project.tasks.length,
      done: project.tasks.filter(t => t.status === 'DONE').length,
      inProgress: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
      todo: project.tasks.filter(t => t.status === 'TODO' || t.status === 'PENDING').length,
    };
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du projet...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Projet introuvable</h2>
            <p className="text-muted-foreground mb-4">Le projet demandé n'existe pas.</p>
            <Button onClick={() => navigate('/projects')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux projets
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const taskStats = getTaskStats();
  const displayedTasks = viewAllTasks ? project.tasks : project.tasks.slice(0, 3);

  return (
    <AppLayout>
      <div className="p-8 space-y-6 animate-fade-in">
        {/* Back Button & Page Header */}
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/projects')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux projets
          </Button>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">
                {project.title}
              </h1>
              <Badge variant={getStatusBadgeVariant(project.status)}>
                {project.status}
              </Badge>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="font-mono font-medium">{project.code}</span>
              <span>•</span>
              <Building2 className="h-4 w-4" />
              <span>{project.customer.name}</span>
            </p>
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
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Échéance</p>
                  <p className="text-lg font-bold">{formatDate(project.endDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progression</p>
                  <p className="text-lg font-bold">{project.progress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-lg font-bold">{project.budget.toLocaleString()} €</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tâches</p>
                  <p className="text-lg font-bold">{taskStats.done}/{taskStats.total}</p>
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
                <CardTitle>Informations du projet</CardTitle>
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
                    <p className="text-sm font-semibold">{formatDate(project.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Date de fin</p>
                    <p className="text-sm font-semibold">{formatDate(project.endDate)}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Progression du projet</p>
                    <p className="text-sm font-semibold">{project.progress}%</p>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Tasks Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tâches du projet</CardTitle>
                    <CardDescription>
                      {taskStats.done} terminée{taskStats.done > 1 ? 's' : ''} sur {taskStats.total}
                    </CardDescription>
                  </div>
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
                                <SelectItem value="HIGH">Haute</SelectItem>
                                <SelectItem value="MEDIUM">Moyenne</SelectItem>
                                <SelectItem value="LOW">Basse</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Statut</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="TODO">À faire</SelectItem>
                                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                                <SelectItem value="DONE">Terminé</SelectItem>
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
                        <Button onClick={() => {
                          setIsTaskModalOpen(false);
                          toast.success("Tâche créée avec succès");
                        }}>Créer</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {displayedTasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{task.title}</h4>
                          <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{task.code}</p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Échéance: {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                ))}

                {project.tasks.length > 3 && !viewAllTasks && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setViewAllTasks(true)}
                  >
                    Voir toutes les tâches ({project.tasks.length})
                  </Button>
                )}

                {viewAllTasks && project.tasks.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setViewAllTasks(false)}
                  >
                    Voir moins
                  </Button>
                )}

                {project.tasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune tâche pour ce projet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>{project.documents.length} document{project.documents.length > 1 ? 's' : ''}</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{doc.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {doc.code} • {formatFileSize(doc.fileSize)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Renommer
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

                {project.documents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun document</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{project.customer.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{project.customer.email}</p>
                    <p className="text-xs text-muted-foreground">{project.customer.phone}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{project.customer.customerType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ville</span>
                    <span className="font-medium">{project.customer.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pays</span>
                    <span className="font-medium">{project.customer.country}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manager Info */}
            {project.manager && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chef de projet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{project.manager.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{project.manager.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Total tâches</span>
                  <span className="text-lg font-bold">{taskStats.total}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-success">Terminées</span>
                  <span className="text-lg font-bold text-success">{taskStats.done}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-warning">En cours</span>
                  <span className="text-lg font-bold text-warning">{taskStats.inProgress}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">À faire</span>
                  <span className="text-lg font-bold">{taskStats.todo}</span>
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