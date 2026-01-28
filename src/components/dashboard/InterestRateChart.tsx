import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface InterestRateChartProps {
  data: { range: string; count: number }[];
}

const COLORS = [
  'hsl(142, 76%, 36%)',
  'hsl(172, 66%, 50%)',
  'hsl(199, 89%, 48%)',
  'hsl(45, 93%, 47%)',
  'hsl(0, 84%, 60%)',
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-lg font-bold" style={{ color: payload[0].payload.fill }}>
          {payload[0].value} propostas
        </p>
      </div>
    );
  }
  return null;
};

export function InterestRateChart({ data }: InterestRateChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.range,
    value: item.count,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Distribuição de Taxa de Juros</h3>
        <p className="text-sm text-muted-foreground">Propostas por faixa de taxa mensal</p>
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
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => <span className="text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
