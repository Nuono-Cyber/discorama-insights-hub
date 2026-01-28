import { motion } from 'framer-motion';
import { TrendingUp, Percent, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/dataService';
import { Progress } from '@/components/ui/progress';

interface CreditMetricsProps {
  totalProposals: number;
  totalCreditValue: number;
  averageCreditValue: number;
  averageInterestRate: number;
  averageInstallments: number;
  proposalsByStatus: { status: string; count: number; value: number }[];
}

export function CreditMetrics({
  totalProposals,
  totalCreditValue,
  averageCreditValue,
  averageInterestRate,
  averageInstallments,
  proposalsByStatus,
}: CreditMetricsProps) {
  const totalCount = proposalsByStatus.reduce((sum, s) => sum + s.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Métricas de Crédito</h3>
        <p className="text-sm text-muted-foreground">Análise das propostas de financiamento</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Ticket Médio</span>
          </div>
          <p className="text-lg font-bold">{formatCurrency(averageCreditValue)}</p>
        </div>
        
        <div className="rounded-lg bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-4 w-4 text-warning" />
            <span className="text-xs text-muted-foreground">Taxa Média</span>
          </div>
          <p className="text-lg font-bold">{averageInterestRate.toFixed(2)}% a.m.</p>
        </div>
        
        <div className="rounded-lg bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-info" />
            <span className="text-xs text-muted-foreground">Parcelas Médias</span>
          </div>
          <p className="text-lg font-bold">{averageInstallments.toFixed(0)}x</p>
        </div>
        
        <div className="rounded-lg bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground">Total Propostas</span>
          </div>
          <p className="text-lg font-bold">{formatNumber(totalProposals)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Por Status</h4>
        {proposalsByStatus.slice(0, 4).map((status, index) => {
          const percentage = totalCount > 0 ? (status.count / totalCount) * 100 : 0;
          return (
            <div key={status.status} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{status.status}</span>
                <span className="font-medium">
                  {status.count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
