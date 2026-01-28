import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  delay?: number;
}

const variantStyles = {
  default: 'from-primary/20 to-primary/5 border-primary/30',
  success: 'from-success/20 to-success/5 border-success/30',
  warning: 'from-warning/20 to-warning/5 border-warning/30',
  danger: 'from-destructive/20 to-destructive/5 border-destructive/30',
  info: 'from-info/20 to-info/5 border-info/30',
};

const iconStyles = {
  default: 'text-primary bg-primary/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-destructive bg-destructive/10',
  info: 'text-info bg-info/10',
};

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default',
  delay = 0 
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br p-6',
        'backdrop-blur-sm transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02]',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'inline-flex items-center gap-1 text-xs font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs período anterior</span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl',
          iconStyles[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Decorative gradient blur */}
      <div className={cn(
        'absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-20 blur-2xl',
        variant === 'default' && 'bg-primary',
        variant === 'success' && 'bg-success',
        variant === 'warning' && 'bg-warning',
        variant === 'danger' && 'bg-destructive',
        variant === 'info' && 'bg-info',
      )} />
    </motion.div>
  );
}
