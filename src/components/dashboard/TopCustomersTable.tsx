import { motion } from 'framer-motion';
import { formatCurrency, formatNumber } from '@/lib/dataService';
import { Crown, User, TrendingUp } from 'lucide-react';

interface TopCustomersTableProps {
  data: { name: string; balance: number; accounts: number }[];
}

export function TopCustomersTable({ data }: TopCustomersTableProps) {
  const top10 = data.slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Top 10 Clientes</h3>
          <p className="text-sm text-muted-foreground">Por saldo em conta</p>
        </div>
        <TrendingUp className="h-5 w-5 text-success" />
      </div>
      
      <div className="space-y-3">
        {top10.map((customer, index) => (
          <motion.div
            key={customer.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex items-center gap-4 rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              index === 0 ? 'bg-warning/20 text-warning' :
              index === 1 ? 'bg-muted text-muted-foreground' :
              index === 2 ? 'bg-accent/20 text-accent' :
              'bg-primary/10'
            }`}>
              {index < 3 ? (
                <Crown className="h-4 w-4" />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">{customer.name}</p>
              <p className="text-xs text-muted-foreground">{formatNumber(customer.accounts)} conta(s)</p>
            </div>
            
            <div className="text-right">
              <p className="font-mono font-semibold text-primary">
                {formatCurrency(customer.balance)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
