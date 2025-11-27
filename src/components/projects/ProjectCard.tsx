import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  priority: string;
  progress: number;
  budget: string;
  startDate: string;
  endDate: string;
  description: string;
  manager: string;
}

interface ProjectCardProps {
  project: any;
  getPriorityColor: (priority: string) => string;
  onViewProject: (id: string | number) => void;
  onEditProject: (id: string | number) => void;
}

export const ProjectCard = ({ project, getPriorityColor, onViewProject, onEditProject }: ProjectCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project.id.toString(),
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <span className="text-xs font-mono text-muted-foreground">{project.id}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityColor(project.priority)}`}>
            {project.priority}
          </span>
        </div>
        <h4 className="font-semibold text-sm leading-tight line-clamp-2">{project.title || project.name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Client:</span>
            <span className="font-medium">{project.customer?.name || project.client || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Budget:</span>
            <span className="font-semibold">{project.budget?.toLocaleString?.() || project.budget} €</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 flex-1 min-w-[90px] justify-center text-xs px-2"
            onClick={(e) => {
              e.stopPropagation();
              onViewProject(project.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Eye className="h-3 w-3 mr-1" />
            Voir
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 flex-1 min-w-[90px] justify-center text-xs px-2"
            onClick={(e) => {
              e.stopPropagation();
              onEditProject(project.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Edit className="h-3 w-3 mr-1" />
            Modifier
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
