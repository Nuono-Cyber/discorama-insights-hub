import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  CreditCard,
  Clock,
  AlertTriangle,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { loadData, DashboardData, formatCurrency, formatNumber } from '@/lib/dataService';
import { KPICard } from '@/components/dashboard/KPICard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { AgencyChart } from '@/components/dashboard/AgencyChart';
import { TopCustomersTable } from '@/components/dashboard/TopCustomersTable';
import { DelayMetrics } from '@/components/dashboard/DelayMetrics';
import { StateChart } from '@/components/dashboard/StateChart';
import { ReportHeader } from '@/components/dashboard/ReportHeader';
import { AIChatbot } from '@/components/dashboard/AIChatbot';

const Index = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');

  useEffect(() => {
    loadData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mb-4 h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
            <BarChart3 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Carregando Dashboard</h2>
          <p className="text-muted-foreground">Processando dados da Discorama...</p>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">Não foi possível processar os dados.</p>
        </div>
      </div>
    );
  }

  const { kpis } = data;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ReportHeader />

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Chat com Dados
          </button>
        </div>

        {activeTab === 'dashboard' ? (
          <>
            {/* KPI Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Receita Total"
                value={formatCurrency(kpis.totalRevenue)}
                subtitle={`${formatNumber(kpis.totalOrders)} pedidos`}
                icon={DollarSign}
                variant="default"
                delay={0}
              />
              <KPICard
                title="Ticket Médio"
                value={formatCurrency(kpis.averageTicket)}
                subtitle="Por pedido"
                icon={CreditCard}
                variant="info"
                delay={0.1}
              />
              <KPICard
                title="Total de Clientes"
                value={formatNumber(kpis.totalCustomers)}
                subtitle={`${data.agencies.length} agências`}
                icon={Users}
                variant="success"
                delay={0.2}
              />
              <KPICard
                title="Atraso Médio"
                value={`${kpis.averageDelay.toFixed(1)} dias`}
                subtitle={`${kpis.lateOrders} com atraso`}
                icon={Clock}
                variant="warning"
                delay={0.3}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <RevenueChart data={kpis.revenueByMonth} />
              <StatusChart data={kpis.ordersByStatus} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <AgencyChart data={kpis.revenueByAgency} />
              <StateChart data={kpis.revenueByState} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <TopCustomersTable data={kpis.topCustomers} />
              <DelayMetrics
                averageDelay={kpis.averageDelay}
                lateOrders={kpis.lateOrders}
                lateOrdersPercentage={kpis.lateOrdersPercentage}
                ordersOnTime={kpis.ordersOnTime}
              />
            </div>

            {/* Business Questions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 rounded-xl border border-border bg-card p-6"
            >
              <h3 className="mb-4 text-lg font-semibold">Perguntas de Negócio Relevantes</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="font-medium text-primary mb-2">📊 Receita</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Evolução da receita por dia/semana/mês/ano?</li>
                    <li>• Média móvel de receita por período?</li>
                    <li>• Receita por filme, gênero ou loja?</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="font-medium text-warning mb-2">🎫 Ticket Médio</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ticket médio por gênero de filme?</li>
                    <li>• Ticket médio por agência?</li>
                    <li>• Correlação ticket x frequência?</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="font-medium text-destructive mb-2">⏱️ Atrasos</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Taxa de atraso por agência?</li>
                    <li>• Perfil de clientes com maior atraso?</li>
                    <li>• Impacto financeiro dos atrasos?</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="font-medium text-success mb-2">👥 Clientes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Segmentação de clientes por comportamento?</li>
                    <li>• Taxa de retenção por período?</li>
                    <li>• LTV (Lifetime Value) por segmento?</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Recommendations Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-6 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6"
            >
              <h3 className="mb-4 text-lg font-semibold">🎯 Recomendações para o CEO</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-card/50 p-4 border border-border">
                  <h4 className="font-semibold mb-2 text-primary">Curto Prazo</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Implementar sistema de notificações para reduzir atrasos</li>
                    <li>✓ Criar programa de fidelidade para top clientes</li>
                    <li>✓ Dashboard de KPIs em tempo real</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-card/50 p-4 border border-border">
                  <h4 className="font-semibold mb-2 text-accent">Médio Prazo</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Integrar dados do CRM Salesforce</li>
                    <li>✓ Automatizar relatórios recorrentes</li>
                    <li>✓ Desenvolver modelo preditivo de churn</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-card/50 p-4 border border-border">
                  <h4 className="font-semibold mb-2 text-success">Longo Prazo</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Data warehouse centralizado</li>
                    <li>✓ Cultura data-driven em todas as áreas</li>
                    <li>✓ Machine Learning para recomendações</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <AIChatbot data={data} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Relatório elaborado por <span className="font-medium">Gabriel Nunes Barbosa Nogueira</span> | 
            Certificado pela <span className="text-primary font-medium">Indicium Tech</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
