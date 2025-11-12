import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "./ProjectCard";

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

interface KanbanColumnProps {
  title: string;
  projects: any[];
  onViewProject: (id: string | number) => void;
}

export const KanbanColumn = ({ title, projects, onViewProject }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: title,
  });

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "HIGH": return "bg-destructive/10 text-destructive";
      case "MEDIUM": return "bg-warning/10 text-warning";
      case "LOW": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <h3 className="font-semibold text-sm">{title}</h3>
        <Badge variant="secondary">{projects.length}</Badge>
      </div>
      <div
        ref={setNodeRef}
        className={`space-y-3 min-h-[400px] p-2 rounded-lg transition-colors ${
          isOver ? "bg-primary/5 ring-2 ring-primary/20" : ""
        }`}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            getPriorityColor={getPriorityColor}
            onViewProject={onViewProject}
          />
        ))}
        {projects.length === 0 && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">Aucun projet</p>
          </div>
        )}
      </div>
    </div>
  );
};
