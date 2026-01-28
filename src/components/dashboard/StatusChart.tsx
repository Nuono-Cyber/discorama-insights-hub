import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { formatNumber } from '@/lib/dataService';

interface StatusChartProps {
  data: { status: string; count: number }[];
}

const COLORS = [
  'hsl(187, 85%, 53%)',  // Primary cyan
  'hsl(142, 76%, 36%)',  // Success green
  'hsl(38, 92%, 50%)',   // Warning orange
  'hsl(262, 83%, 58%)',  // Purple
  'hsl(0, 72%, 51%)',    // Danger red
  'hsl(199, 89%, 48%)',  // Info blue
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].payload.status}</p>
        <p className="text-lg font-bold" style={{ color: payload[0].payload.fill }}>
          {formatNumber(payload[0].value)} pedidos
        </p>
      </div>
    );
  }
  return null;
};

export function StatusChart({ data }: StatusChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Pedidos por Status</h3>
        <p className="text-sm text-muted-foreground">Distribuição atual dos pedidos</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value: string) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
