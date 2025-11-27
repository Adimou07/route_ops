import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { createTask } from "@/api/tasks";
import { fetchProjects } from "@/api/projects";
import { User } from "@/api/auth";

const TaskCreate = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [status, setStatus] = useState<string>("TODO");
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [projects, setProjects] = useState<any[]>([]);
  const [projectSearch, setProjectSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const firstPage = await fetchProjects(1);
        let allProjects = [...firstPage.data];

        const lastPage = firstPage.meta?.lastPage ?? 1;

        for (let page = 2; page <= lastPage; page++) {
          try {
            const res = await fetchProjects(page);
            allProjects = allProjects.concat(res.data);
          } catch (err) {
            console.error("Error loading projects page", page, err);
            break;
          }
        }

        setProjects(allProjects);
      } catch (err: any) {
        console.error("Error loading projects", err);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const q = projectSearch.toLowerCase();
    if (!q) return true;
    return (
      p.title?.toLowerCase().includes(q) ||
      p.code?.toLowerCase().includes(q)
    );
  });

  const filteredUsers = users.filter((u) => {
    const q = assigneeSearch.toLowerCase();
    if (!q) return true;
    const fullName = `${u.firstname} ${u.lastname}`.toLowerCase();
    return (
      fullName.includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async () => {
    if (!title.trim() || !projectId.trim()) {
      toast({
        title: "Champs manquants",
        description: "Merci de renseigner au minimum le titre et le projet.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload: any = {
        title,
        description,
        status,
        priority,
        projectId: Number(projectId),
        dueDate: dueDate || undefined,
      };

      if (assignedTo.trim() !== "") {
        payload.assignedTo = Number(assignedTo);
      }

      await createTask(payload);

      toast({
        title: "Tâche créée",
        description: "La tâche a été créée avec succès.",
      });

      navigate("/tasks");
    } catch (err: any) {
      const message = err?.message || "Impossible de créer la tâche.";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle Tâche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="task-title">Titre</Label>
              <Input
                id="task-title"
                placeholder="Titre de la tâche"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Projet</Label>
              {!projectId ? (
                <>
                  <Input
                    placeholder="Rechercher un projet..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                  />
                  <div className="mt-2 max-h-64 overflow-y-auto rounded-md border bg-background">
                    {filteredProjects.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Aucun projet trouvé
                      </div>
                    ) : (
                      filteredProjects.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted/80"
                          onClick={() => {
                            setProjectId(String(p.id));
                            setProjectSearch("");
                          }}
                        >
                          <div className="font-medium">{p.title}</div>
                          <div className="text-xs text-muted-foreground font-mono">{p.code}</div>
                        </button>
                      ))
                    )}
                  </div>
                </>
              ) : (
                (() => {
                  const selected = projects.find((p) => String(p.id) === projectId);
                  return (
                    <div className="space-y-2">
                      <div className="rounded-md border bg-muted/40 px-3 py-2">
                        <div className="text-sm font-medium">
                          {selected?.title || `Projet #${projectId}`}
                        </div>
                        {selected?.code && (
                          <div className="text-xs text-muted-foreground font-mono">
                            {selected.code}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProjectId("");
                          setProjectSearch("");
                        }}
                      >
                        Changer de projet
                      </Button>
                    </div>
                  );
                })()
              )}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Description de la tâche"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={status} onValueChange={setStatus}>
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
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select value={priority} onValueChange={setPriority}>
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date d'échéance</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Assigné à (ID utilisateur)</Label>
                <Input
                  type="number"
                  placeholder="ID utilisateur (optionnel)"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/tasks")}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Création..." : "Créer la tâche"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TaskCreate;
