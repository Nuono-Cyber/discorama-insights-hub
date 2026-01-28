import { motion } from 'framer-motion';
import { formatCurrency, formatNumber } from '@/lib/dataService';
import { Medal, TrendingUp } from 'lucide-react';

interface TopCustomersTableProps {
  data: { name: string; orders: number; revenue: number }[];
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
          <p className="text-sm text-muted-foreground">Por receita gerada</p>
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              {index < 3 ? (
                <Medal className={`h-4 w-4 ${
                  index === 0 ? 'text-warning' : 
                  index === 1 ? 'text-muted-foreground' : 
                  'text-orange-600'
                }`} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">{customer.name}</p>
              <p className="text-xs text-muted-foreground">{formatNumber(customer.orders)} pedidos</p>
            </div>
            
            <div className="text-right">
              <p className="font-mono font-semibold text-primary">
                {formatCurrency(customer.revenue)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
