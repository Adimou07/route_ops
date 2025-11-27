import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, ArrowLeft, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { fetchTasks, Task } from "@/api/tasks";

const Tasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchTasks(currentPage);
        setTasks(res.data);
        setTotalTasks(res.meta.total);
        setLastPage(res.meta.lastPage);
      } catch (err: any) {
        const message = err?.message || "Impossible de charger les tâches";
        setError(message);
        toast({
          title: "Erreur",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const getStatusVariant = (status: string) => {
    switch(status) {
      case "DONE": return "default";
      case "IN_PROGRESS": return "secondary";
      case "TODO": return "outline";
      default: return "outline";
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch(priority) {
      case "HIGH": return "destructive";
      case "MEDIUM": return "default";
      case "LOW": return "secondary";
      default: return "outline";
    }
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
          <LoadingState message="Chargement des tâches..." />
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

        {/* Header bleu */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-2xl">
          <div className="px-6 py-6 sm:px-10 sm:py-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-3">
                <Clock className="h-7 w-7" />
                Toutes les tâches
              </h1>
              <p className="text-sm sm:text-base text-primary-foreground/80 mt-1">
                Vue d'ensemble de toutes les tâches de tous les projets.
              </p>
            </div>
            <Button
              className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all durée-200"
              onClick={() => navigate("/tasks/new")}
            >
              <Plus className="h-4 w-4" />
              Nouvelle tâche
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Liste des tâches</CardTitle>
                <CardDescription>
                  {(totalTasks ?? tasks.length)} tâche{(totalTasks ?? tasks.length) > 1 ? 's' : ''} au total
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="TODO">À faire</SelectItem>
                    <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                    <SelectItem value="DONE">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="HIGH">Haute</SelectItem>
                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                    <SelectItem value="LOW">Basse</SelectItem>
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
                  <TableHead>Référence</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead>Assigné à</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="hover:bg-muted/60 hover:border-l-4 hover:border-primary/70 transition-colors cursor-pointer"
                  >
                    <TableCell className="font-medium font-mono text-xs text-muted-foreground">
                      {task.code}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {task.title}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">
                          {task.project?.title ?? `Projet #${task.projectId}`}
                        </p>
                        {task.project?.code && (
                          <p className="text-xs text-muted-foreground font-mono">
                            {task.project.code}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {task.assignee
                        ? `${task.assignee.firstname} ${task.assignee.lastname}`
                        : "Non assigné"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getPriorityVariant(task.priority)}
                        className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                      >
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(task.status)}
                        className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                      >
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(task.dueDate)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/projects/${task.projectId}`)}
                      >
                        Voir projet
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">
                Page {currentPage} sur {lastPage}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === lastPage}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Tasks;
