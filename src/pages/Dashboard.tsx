import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FolderKanban, 
  ShoppingCart, 
  Package, 
  FileText, 
  TrendingUp,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const recentProjects = [
    { id: "PROJ-00123", name: "Installation Réseau Client A", status: "En cours", progress: 65 },
    { id: "PROJ-00124", name: "Migration Datacenter B", status: "En attente", progress: 30 },
    { id: "PROJ-00125", name: "Déploiement Serveurs C", status: "Terminé", progress: 100 },
  ];

  const recentOrders = [
    { id: "SO-00456", customer: "Entreprise Alpha", amount: "45 000€", status: "Approuvé" },
    { id: "SO-00457", customer: "Société Beta", amount: "32 500€", status: "En attente" },
    { id: "PO-00234", supplier: "Fournisseur Gamma", amount: "28 000€", status: "En cours" },
  ];

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de votre activité</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Projets actifs"
            value={24}
            icon={FolderKanban}
            trend={{ value: "+12%", isPositive: true }}
            description="vs mois dernier"
          />
          <StatsCard
            title="Commandes clients"
            value={156}
            icon={ShoppingCart}
            trend={{ value: "+8%", isPositive: true }}
            description="ce mois"
          />
          <StatsCard
            title="Commandes fournisseurs"
            value={89}
            icon={Package}
            trend={{ value: "-3%", isPositive: false }}
            description="en cours"
          />
          <StatsCard
            title="RFQ en attente"
            value={12}
            icon={FileText}
            description="nécessitent une action"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Projets récents
              </CardTitle>
              <CardDescription>Vos derniers projets en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{project.name}</p>
                        <Badge variant={project.status === "Terminé" ? "default" : "secondary"} className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{project.id}</p>
                      <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Commandes récentes
              </CardTitle>
              <CardDescription>Dernières transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{order.id}</p>
                        <Badge variant="outline" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {'customer' in order ? order.customer : order.supplier}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{order.amount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance mensuelle
            </CardTitle>
            <CardDescription>Aperçu des indicateurs clés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-muted-foreground">Revenus du mois</p>
                <p className="text-2xl font-bold text-success mt-1">387 500€</p>
                <p className="text-xs text-success mt-1">+15% vs mois dernier</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">Projets livrés</p>
                <p className="text-2xl font-bold text-primary mt-1">18</p>
                <p className="text-xs text-primary mt-1">Objectif: 20 projets</p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-muted-foreground">Taux de satisfaction</p>
                <p className="text-2xl font-bold text-warning mt-1">94%</p>
                <p className="text-xs text-warning mt-1">Très bon niveau</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
