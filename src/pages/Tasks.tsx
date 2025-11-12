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

const Tasks = () => {
  const navigate = useNavigate();

  // Mock data - in production, fetch all tasks from all projects
  const tasks = [
    { 
      id: "TASK-001", 
      code: "TASK-00001",
      title: "Infrastructure Assessment", 
      project: { code: "PROJ-00001", title: "IT Infrastructure Upgrade" }, 
      assignee: "Non assigné", 
      priority: "HIGH", 
      status: "DONE",
      dueDate: "2025-11-07"
    },
    { 
      id: "TASK-002", 
      code: "TASK-00002",
      title: "Hardware Procurement", 
      project: { code: "PROJ-00001", title: "IT Infrastructure Upgrade" }, 
      assignee: "Non assigné", 
      priority: "HIGH", 
      status: "IN_PROGRESS",
      dueDate: "2025-11-22"
    },
    { 
      id: "TASK-003", 
      code: "TASK-00003",
      title: "Network Configuration", 
      project: { code: "PROJ-00001", title: "IT Infrastructure Upgrade" }, 
      assignee: "Non assigné", 
      priority: "MEDIUM", 
      status: "TODO",
      dueDate: "2025-12-01"
    },
  ];

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

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Toutes les tâches</h1>
            <p className="text-muted-foreground mt-1">Vue d'ensemble de toutes les tâches de tous les projets</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Liste des tâches</CardTitle>
                <CardDescription>{tasks.length} tâche{tasks.length > 1 ? 's' : ''} au total</CardDescription>
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
                  <TableRow key={task.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium font-mono text-xs">{task.code}</TableCell>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{task.project.title}</p>
                        <p className="text-xs text-muted-foreground font-mono">{task.project.code}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{task.assignee}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(task.status)}>
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
                        onClick={() => navigate(`/projects/${task.project.code.split('-')[1]}`)}
                      >
                        Voir projet
                      </Button>
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

export default Tasks;
