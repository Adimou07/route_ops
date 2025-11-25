import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <AppLayout>
      <div className="p-8 space-y-6 bg-muted/40">
        {/* Page Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-2xl mb-4">
          <div className="px-6 py-6 sm:px-10 sm:py-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground flex items-center gap-3">
                <SettingsIcon className="h-8 w-8" />
                Paramètres
              </h1>
              <p className="text-sm sm:text-base text-primary-foreground/80 mt-1">
                Gérez les paramètres de votre plateforme.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>Configuration de base de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nom de l'entreprise</Label>
                <Input id="company-name" placeholder="Votre entreprise" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Email de contact</Label>
                <Input id="company-email" type="email" placeholder="contact@entreprise.fr" />
              </div>
              <Button>Enregistrer les modifications</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications en temps réel</Label>
                  <p className="text-sm text-muted-foreground">Afficher les notifications dans l'app</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rapports hebdomadaires</Label>
                  <p className="text-sm text-muted-foreground">Recevoir un résumé chaque semaine</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Paramètres de sécurité et d'authentification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">Sécurité renforcée pour votre compte</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Modifier le mot de passe</Label>
                <Button variant="outline">Changer le mot de passe</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des rôles (RBAC)</CardTitle>
              <CardDescription>Configuration du contrôle d'accès basé sur les rôles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gérez les modules, permissions et rôles depuis la section Utilisateurs.
              </p>
              <Button variant="outline">Accéder à la gestion RBAC</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
