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
      <div className="w-full bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-2xl">
              <div className="relative px-6 py-6 sm:px-10 sm:py-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2 max-w-xl">
                  <p className="text-xs font-semibold uppercase tracking-wide/relaxed opacity-80">
                    Vue générale
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                    Tableau de bord 
                  </h1>
                  <p className="text-sm sm:text-base text-primary-foreground/90">
                    Suivez en temps réel vos projets, commandes et indicateurs clés de performance.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 text-xs sm:text-sm min-w-[220px]">
                  <div className="rounded-2xl bg-primary/20 border border-primary/40 px-3 py-2.5 sm:px-4 sm:py-3">
                    <p className="font-medium opacity-90">Activité du mois</p>
                    <p className="text-[11px] sm:text-xs opacity-80">+15% vs mois dernier</p>
                  </div>
                  <div className="rounded-2xl bg-primary/20 border border-primary/40 px-3 py-2.5 sm:px-4 sm:py-3">
                    <p className="font-medium opacity-90">Projets actifs</p>
                    <p className="text-[11px] sm:text-xs opacity-80">Pilotage en cours</p>
                  </div>
                  <div className="rounded-2xl bg-primary/20 border border-primary/40 px-3 py-2.5 sm:px-4 sm:py-3 col-span-2">
                    <p className="font-medium opacity-90">Vue consolidée</p>
                    <p className="text-[11px] sm:text-xs opacity-80">Commandes clients, fournisseurs et RFQ au même endroit.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-primary/60 bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg hover:border-primary/80 hover:-translate-y-0.5 transition-all duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FolderKanban className="h-5 w-5 text-primary" />
                  Projets récents
                </CardTitle>
                <CardDescription>Vos derniers projets en cours et leur avancement.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-muted/40">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between gap-4 px-4 py-3 first:rounded-t-xl last:rounded-b-xl hover:bg-primary/5 hover:border-primary/40 border-transparent border-l-2 transition-all cursor-pointer"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground">{project.name}</p>
                          <Badge
                            variant={project.status === "Terminé" ? "default" : "secondary"}
                            className="text-[11px] px-2 py-0.5"
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
                          {project.id}
                        </p>
                        <div className="w-full bg-secondary/60 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/95 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  Commandes récentes
                </CardTitle>
                <CardDescription>Suivi des dernières transactions clients & fournisseurs.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-muted/40">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between gap-4 px-4 py-3 first:rounded-t-xl last:rounded-b-xl hover:bg-primary/5 hover:border-primary/40 border-transparent border-l-2 transition-all cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground">{order.id}</p>
                          <Badge variant="outline" className="text-[11px] px-2 py-0.5">
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {"customer" in order ? order.customer : order.supplier}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {order.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/70 bg-card/95 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance mensuelle
              </CardTitle>
              <CardDescription>Aperçu des indicateurs clés de performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-2xl bg-success/10 border border-success/40 hover:bg-success/15 hover:border-success/60 hover:shadow-md transition-all">
                  <p className="text-xs font-medium uppercase tracking-wide text-success/80">Revenus du mois</p>
                  <p className="text-2xl font-semibold text-success mt-1">387 500€</p>
                  <p className="text-[11px] text-success/90 mt-1">+15% vs mois dernier</p>
                </div>
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/40 hover:bg-primary/15 hover:border-primary/60 hover:shadow-md transition-all">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary/80">Projets livrés</p>
                  <p className="text-2xl font-semibold text-primary mt-1">18</p>
                  <p className="text-[11px] text-primary/90 mt-1">Objectif: 20 projets</p>
                </div>
                <div className="p-4 rounded-2xl bg-warning/10 border border-warning/40 hover:bg-warning/15 hover:border-warning/60 hover:shadow-md transition-all">
                  <p className="text-xs font-medium uppercase tracking-wide text-warning/80">Taux de satisfaction</p>
                  <p className="text-2xl font-semibold text-warning mt-1">94%</p>
                  <p className="text-[11px] text-warning/90 mt-1">Très bon niveau</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
