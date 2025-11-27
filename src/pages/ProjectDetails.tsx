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
  MoreVertical,
  FileQuestion,
  ShoppingCart,
  Package
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
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingState } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { fetchProjectById, deleteProject } from "@/api/projects";

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

interface RFQ {
  id: number;
  code: string;
  title: string;
  status: string;
  totalAmount: number;
  validUntil: string;
  supplier: {
    name: string;
  };
}

interface SalesOrder {
  id: number;
  code: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string;
}

interface PurchaseOrder {
  id: number;
  code: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  orderDate: string;
  expectedDelivery: string;
  supplier: {
    name: string;
  };
}

interface Project {
  id: number;
  code: string;
  title: string;
  description: string;
  customerId: number | null;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  priority: string;
  managerId: number | null;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  manager?: any;
  tasks?: Task[];
  documents?: Document[];
  progress?: number;
  rfqs?: RFQ[];
  salesOrders?: SalesOrder[];
  purchaseOrders?: PurchaseOrder[];
}

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewAllTasks, setViewAllTasks] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteProject = async () => {
    if (!project || deleting) return;
    try {
      setDeleting(true);
      await deleteProject(project.id);
      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé avec succès.",
      });
      navigate("/projects");
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err?.message || "Impossible de supprimer le projet.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Fetch project data from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) return;

        const raw: any = await fetchProjectById(id);

        if (!raw) {
          throw new Error("Projet introuvable");
        }

        const normalized: Project = {
          ...raw,
          customerId: raw.customerId ?? null,
          tasks: raw.tasks ?? [],
          documents: raw.documents ?? [],
          rfqs: raw.rfqs ?? [],
          salesOrders: raw.salesOrders ?? [],
          purchaseOrders: raw.purchaseOrders ?? [],
          progress: raw.progress ?? 0,
        } as Project;

        setProject(normalized);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement du projet");
        console.error("Error fetching project:", err);
        toast({
          title: "Erreur",
          description: "Impossible de charger le projet",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
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
        <div className="p-8">
          <LoadingState message="Chargement du projet..." />
        </div>
      </AppLayout>
    );
  }

  if (error || !project) {
    return (
      <AppLayout>
        <div className="p-8">
          <ErrorState 
            title="Projet introuvable"
            message={error || "Le projet demandé n'existe pas."}
            onRetry={() => window.location.reload()}
          />
          <div className="flex justify-center mt-4">
            <Button onClick={() => navigate('/projects')} variant="outline">
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
              <span>{project.customer?.name || "Client inconnu"}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
              if (!open && !deleting) {
                setIsDeleteDialogOpen(false);
              }
            }}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  disabled={deleting}
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Supprimer le projet</DialogTitle>
                  <DialogDescription>
                    Cette action est <span className="font-semibold">irréversible</span>.
                    <br />
                    Voulez-vous vraiment supprimer le projet
                    {" "}
                    <span className="font-semibold">"{project.title}"</span> ?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (deleting) return;
                      setIsDeleteDialogOpen(false);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteProject}
                    disabled={deleting}
                  >
                    {deleting ? "Suppression..." : "Supprimer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                          toast({
                            title: "Tâche créée",
                            description: "La tâche a été créée avec succès",
                          });
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

            {/* RFQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileQuestion className="h-5 w-5" />
                  Demandes de Cotation (RFQ)
                </CardTitle>
                <CardDescription>
                  {project.rfqs.length} demande{project.rfqs.length > 1 ? 's' : ''} de cotation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.rfqs.map((rfq) => (
                  <div key={rfq.id} className="p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{rfq.title}</h4>
                          <Badge variant={getStatusBadgeVariant(rfq.status)}>
                            {rfq.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{rfq.code}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">Fournisseur</p>
                        <p className="font-medium">{rfq.supplier.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Montant</p>
                        <p className="font-medium">{rfq.totalAmount.toLocaleString('fr-FR')} €</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground mb-1">Valide jusqu'au</p>
                        <p className="font-medium">{formatDate(rfq.validUntil)}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {project.rfqs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileQuestion className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune demande de cotation</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sales Orders Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Commandes Clients (SO)
                </CardTitle>
                <CardDescription>
                  {project.salesOrders.length} commande{project.salesOrders.length > 1 ? 's' : ''} client
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.salesOrders.map((so) => (
                  <div key={so.id} className="p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{so.orderNumber}</h4>
                          <Badge variant={getStatusBadgeVariant(so.status)}>
                            {so.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{so.code}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">Montant total</p>
                        <p className="font-medium text-lg">{so.totalAmount.toLocaleString('fr-FR')} €</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Date de commande</p>
                        <p className="font-medium">{formatDate(so.orderDate)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground mb-1">Livraison prévue</p>
                        <p className="font-medium">{formatDate(so.deliveryDate)}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {project.salesOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune commande client</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Purchase Orders Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Bons de Commande (PO)
                </CardTitle>
                <CardDescription>
                  {project.purchaseOrders.length} bon{project.purchaseOrders.length > 1 ? 's' : ''} de commande
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.purchaseOrders.map((po) => (
                  <div key={po.id} className="p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{po.orderNumber}</h4>
                          <Badge variant={getStatusBadgeVariant(po.status)}>
                            {po.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{po.code}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">Fournisseur</p>
                        <p className="font-medium">{po.supplier.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Montant</p>
                        <p className="font-medium">{po.totalAmount.toLocaleString('fr-FR')} €</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Date de commande</p>
                        <p className="font-medium">{formatDate(po.orderDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Livraison attendue</p>
                        <p className="font-medium">{formatDate(po.expectedDelivery)}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {project.purchaseOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun bon de commande</p>
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
                    <h4 className="font-semibold text-sm">{project.customer?.name || "Client inconnu"}</h4>
                    <p className="text-xs text-muted-foreground truncate">{project.customer?.email || ""}</p>
                    <p className="text-xs text-muted-foreground">{project.customer?.phone || ""}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{project.customer?.customerType || ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ville</span>
                    <span className="font-medium">{project.customer?.city || ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pays</span>
                    <span className="font-medium">{project.customer?.country || ""}</span>
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
