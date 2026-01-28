import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/dataService';

interface AgencyChartProps {
  data: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-lg font-bold text-accent">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function AgencyChart({ data }: AgencyChartProps) {
  const topAgencies = data.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Saldo por Agência</h3>
        <p className="text-sm text-muted-foreground">Top 8 agências por saldo total</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={topAgencies} 
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" horizontal={false} />
            <XAxis 
              type="number"
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="hsl(215, 20%, 55%)"
              fontSize={11}
              width={120}
              tickFormatter={(value) => value.replace('Agência ', '')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="hsl(172, 66%, 50%)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
