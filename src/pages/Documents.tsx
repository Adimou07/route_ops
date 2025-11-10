import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, FileText, File, Image } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Documents = () => {
  const documents = [
    { id: "DOC-001", name: "Contrat Client Alpha.pdf", type: "PDF", entity: "PROJ-00123", size: "2.3 MB", date: "2024-01-15" },
    { id: "DOC-002", name: "Facture SO-00456.pdf", type: "PDF", entity: "SO-00456", size: "456 KB", date: "2024-01-14" },
    { id: "DOC-003", name: "Spec technique.docx", type: "DOCX", entity: "PROJ-00124", size: "1.8 MB", date: "2024-01-13" },
    { id: "DOC-004", name: "Photo site.jpg", type: "Image", entity: "PROJ-00123", size: "3.2 MB", date: "2024-01-12" },
  ];

  const getIcon = (type: string) => {
    if (type === "Image") return <Image className="h-4 w-4" />;
    if (type === "PDF") return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-1">Gérez tous vos documents attachés</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau document
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Liste des documents</CardTitle>
                <CardDescription>Tous les documents de la plateforme</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-9 w-64" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Nom du fichier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Lié à</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{doc.id}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      {getIcon(doc.type)}
                      {doc.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.type}</Badge>
                    </TableCell>
                    <TableCell>{doc.entity}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Télécharger</Button>
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

export default Documents;
