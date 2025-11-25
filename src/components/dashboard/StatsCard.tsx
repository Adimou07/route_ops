import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
}

export const StatsCard = ({ title, value, icon: Icon, trend, description }: StatsCardProps) => {
  return (
    <Card className="border-border/60 bg-card/95 shadow-sm hover:shadow-md hover:border-primary/60 hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-200 min-h-[120px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-2 px-3">
        <CardTitle className="text-xs font-medium text-muted-foreground truncate">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-1 pb-3 px-3 flex-1 flex flex-col justify-center">
        <div className="text-xl font-semibold leading-tight">{value}</div>
        {trend && (
          <p className={`text-[11px] mt-0.5 ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </p>
        )}
        {description && (
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
