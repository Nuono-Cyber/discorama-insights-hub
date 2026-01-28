import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  CreditCard, 
  Users, 
  Building2,
  TrendingUp,
  Percent,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { loadData, DashboardData, formatCurrency, formatNumber } from '@/lib/dataService';
import { KPICard } from '@/components/dashboard/KPICard';
import { TransactionsChart } from '@/components/dashboard/TransactionsChart';
import { CreditChart } from '@/components/dashboard/CreditChart';
import { InterestRateChart } from '@/components/dashboard/InterestRateChart';
import { AgencyChart } from '@/components/dashboard/AgencyChart';
import { TopCustomersTable } from '@/components/dashboard/TopCustomersTable';
import { CreditMetrics } from '@/components/dashboard/CreditMetrics';
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
          <p className="text-muted-foreground">Processando dados bancários...</p>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">Não foi possível processar os dados bancários.</p>
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
                title="Saldo Total em Contas"
                value={formatCurrency(kpis.totalBalance)}
                subtitle={`${formatNumber(kpis.totalAccounts)} contas`}
                icon={DollarSign}
                variant="default"
                delay={0}
              />
              <KPICard
                title="Volume de Crédito"
                value={formatCurrency(kpis.totalCreditValue)}
                subtitle={`${formatNumber(kpis.totalProposals)} propostas`}
                icon={CreditCard}
                variant="info"
                delay={0.1}
              />
              <KPICard
                title="Total de Clientes"
                value={formatNumber(kpis.totalCustomers)}
                subtitle={`${kpis.totalEmployees} colaboradores`}
                icon={Users}
                variant="success"
                delay={0.2}
              />
              <KPICard
                title="Taxa Média de Juros"
                value={`${kpis.averageInterestRate.toFixed(2)}%`}
                subtitle="Taxa mensal média"
                icon={Percent}
                variant="warning"
                delay={0.3}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <TransactionsChart data={kpis.transactionsByMonth} />
              <CreditChart data={kpis.proposalsByMonth} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <AgencyChart data={kpis.balanceByAgency} />
              <InterestRateChart data={kpis.interestRateDistribution} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <TopCustomersTable data={kpis.topCustomersByBalance} />
              <CreditMetrics
                totalProposals={kpis.totalProposals}
                totalCreditValue={kpis.totalCreditValue}
                averageCreditValue={kpis.averageCreditValue}
                averageInterestRate={kpis.averageInterestRate}
                averageInstallments={kpis.averageInstallments}
                proposalsByStatus={kpis.proposalsByStatus}
              />
            </div>

            <div className="mt-6">
              <StateChart data={kpis.balanceByState} />
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
                  <h4 className="font-medium text-primary mb-2">💰 Carteira de Crédito</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Evolução do volume de crédito por período?</li>
                    <li>• Ticket médio de financiamento por agência?</li>
                    <li>• Concentração de risco por faixa de taxa?</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="font-medium text-warning mb-2">📊 Movimentação</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Fluxo líquido de recursos por período?</li>
                    <li>• Proporção depósitos vs saques por agência?</li>
                    <li>• Sazonalidade nas transações?</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="font-medium text-destructive mb-2">⚠️ Risco</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Distribuição de taxas de juros?</li>
                    <li>• Perfil de clientes por valor de crédito?</li>
                    <li>• Concentração geográfica da carteira?</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="font-medium text-success mb-2">👥 Clientes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Segmentação por saldo e movimentação?</li>
                    <li>• Penetração de crédito na base?</li>
                    <li>• Rentabilidade por segmento de cliente?</li>
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
              <h3 className="mb-4 text-lg font-semibold">🎯 Recomendações Estratégicas</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-card/50 p-4 border border-border">
                  <h4 className="font-semibold mb-2 text-primary">Curto Prazo</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Dashboard de monitoramento de crédito em tempo real</li>
                    <li>✓ Alertas de concentração de risco</li>
                    <li>✓ Segmentação de clientes por potencial</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-card/50 p-4 border border-border">
                  <h4 className="font-semibold mb-2 text-accent">Médio Prazo</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Modelo de scoring de crédito</li>
                    <li>✓ Automação de análise de propostas</li>
                    <li>✓ Integração com bureaus de crédito</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-card/50 p-4 border border-border">
                  <h4 className="font-semibold mb-2 text-success">Longo Prazo</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Data lake unificado</li>
                    <li>✓ Machine Learning para precificação</li>
                    <li>✓ Open Banking e APIs</li>
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
