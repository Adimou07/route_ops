import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingState } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { fetchProjectById, updateProject } from "@/api/projects";
import { toast } from "@/hooks/use-toast";

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customerId, setCustomerId] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const project = await fetchProjectById(id);
        setTitle(project.title || "");
        setDescription(project.description || "");
        setCustomerId(project.customerId != null ? String(project.customerId) : "");
        setStartDate(project.startDate || "");
        setEndDate(project.endDate || "");
        setBudget(project.budget != null ? String(project.budget) : "");
        setPriority(project.priority || "");
        setStatus(project.status || "");
      } catch (err: any) {
        setError(err?.message || "Erreur lors du chargement du projet");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async () => {
    if (!id) return;

    if (!title.trim()) {
      toast({
        title: "Titre manquant",
        description: "Merci de renseigner le titre du projet.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload: any = {
        title,
        description,
        customerId: customerId ? Number(customerId) : null,
        startDate,
        endDate: endDate || null,
        budget: budget ? Number(budget) : 0,
        priority: priority || "MEDIUM",
        status: status || "PENDING",
      };

      await updateProject(id, payload);

      toast({
        title: "Projet mis à jour",
        description: "Les informations du projet ont été enregistrées.",
      });

      navigate(`/projects/${id}`);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la mise à jour du projet");
      toast({
        title: "Erreur",
        description: err?.message || "Impossible de mettre à jour le projet.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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

  if (error) {
    return (
      <AppLayout>
        <div className="p-8">
          <ErrorState
            title="Projet introuvable"
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Modifier le projet</h1>
            <p className="text-sm text-muted-foreground">Mettez à jour les informations du projet puis enregistrez.</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Annuler
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations principales</CardTitle>
            <CardDescription>Champs principaux du projet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Client (ID)</Label>
                <Input
                  id="customerId"
                  type="number"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select value={priority || undefined} onValueChange={setPriority}>
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
                <Label>Statut</Label>
                <Select value={status || undefined} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="ON_HOLD">En pause</SelectItem>
                    <SelectItem value="COMPLETED">Complété</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-2">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProjectEdit;
