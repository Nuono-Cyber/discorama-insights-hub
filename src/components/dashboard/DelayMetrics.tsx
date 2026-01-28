import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { formatNumber, formatPercent } from '@/lib/dataService';

interface DelayMetricsProps {
  averageDelay: number;
  lateOrders: number;
  lateOrdersPercentage: number;
  ordersOnTime: number;
}

export function DelayMetrics({ 
  averageDelay, 
  lateOrders, 
  lateOrdersPercentage, 
  ordersOnTime 
}: DelayMetricsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Métricas de Atraso</h3>
        <p className="text-sm text-muted-foreground">Análise de devoluções</p>
      </div>

      <div className="grid gap-4">
        {/* Average Delay */}
        <div className="flex items-center gap-4 rounded-lg bg-warning/10 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/20">
            <Clock className="h-6 w-6 text-warning" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Atraso Médio</p>
            <p className="text-2xl font-bold text-warning">
              {averageDelay.toFixed(1)} dias
            </p>
          </div>
        </div>

        {/* Late Orders */}
        <div className="flex items-center gap-4 rounded-lg bg-destructive/10 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/20">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Pedidos com Atraso</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-destructive">
                {formatNumber(lateOrders)}
              </p>
              <p className="text-sm text-destructive/70">
                ({formatPercent(lateOrdersPercentage)})
              </p>
            </div>
          </div>
        </div>

        {/* On Time Orders */}
        <div className="flex items-center gap-4 rounded-lg bg-success/10 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Pedidos no Prazo</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-success">
                {formatNumber(ordersOnTime)}
              </p>
              <p className="text-sm text-success/70">
                ({formatPercent(100 - lateOrdersPercentage)})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Taxa de Pontualidade</span>
          <span className="font-medium text-success">{formatPercent(100 - lateOrdersPercentage)}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${100 - lateOrdersPercentage}%` }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-success to-accent"
          />
        </div>
      </div>
    </motion.div>
  );
}
