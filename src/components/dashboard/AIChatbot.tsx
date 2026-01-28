import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { DashboardData, formatCurrency, formatNumber } from '@/lib/dataService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatbotProps {
  data: DashboardData | null;
}

const suggestedQuestions = [
  "Qual é o volume total de crédito?",
  "Quais são as agências com maior saldo?",
  "Como está a distribuição de taxas de juros?",
  "Quais são os top clientes por saldo?",
  "Como evoluíram as transações ao longo do tempo?",
  "Quais são as recomendações para a carteira de crédito?",
];

export function AIChatbot({ data }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Olá! Sou o assistente de analytics bancário. 🏦

Posso ajudá-lo a explorar os dados e obter insights sobre:
- 💰 **Carteira de crédito** e propostas de financiamento
- 📊 **Movimentações** - depósitos e saques
- 👥 **Análise de clientes** e contas
- 📈 **Métricas por agência** e distribuição geográfica
- ⚠️ **Análise de risco** e taxas de juros

Como posso ajudá-lo hoje?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (question: string): string => {
    if (!data) {
      return "Os dados ainda estão sendo carregados. Por favor, aguarde um momento.";
    }

    const q = question.toLowerCase();
    const { kpis } = data;

    // Volume de crédito
    if (q.includes('crédito') || q.includes('credito') || q.includes('financiamento') || q.includes('volume')) {
      return `## Carteira de Crédito 💳

### Visão Geral:
- **Volume Total**: ${formatCurrency(kpis.totalCreditValue)}
- **Total de Propostas**: ${formatNumber(kpis.totalProposals)}
- **Ticket Médio**: ${formatCurrency(kpis.averageCreditValue)}

### Condições Médias:
- **Taxa de Juros Média**: ${kpis.averageInterestRate.toFixed(2)}% a.m.
- **Prazo Médio**: ${kpis.averageInstallments.toFixed(0)} parcelas

### Por Status:
${kpis.proposalsByStatus.slice(0, 4).map(s => `- **${s.status}**: ${s.count} propostas - ${formatCurrency(s.value)}`).join('\n')}

### Recomendações:
1. Monitorar concentração de risco por faixa de taxa
2. Avaliar política de precificação por perfil de cliente
3. Automatizar processo de análise de crédito`;
    }

    // Agências / Saldo
    if (q.includes('agência') || q.includes('agencias') || q.includes('saldo') || q.includes('loja')) {
      const topAgencies = kpis.balanceByAgency.slice(0, 5);
      const list = topAgencies.map((a, i) => `${i + 1}. **${a.name}**: ${formatCurrency(a.value)}`).join('\n');
      
      return `## Top 5 Agências por Saldo 🏪

${list}

### Insights:
- **${topAgencies[0]?.name}** lidera em volume de depósitos
- ${data.agencies.length} agências ativas no total
- Concentração geográfica em ${kpis.balanceByState[0]?.uf || 'SP'}

### Distribuição por Estado:
${kpis.balanceByState.slice(0, 5).map(s => `- **${s.uf}**: ${formatCurrency(s.value)}`).join('\n')}`;
    }

    // Taxa de juros
    if (q.includes('taxa') || q.includes('juros') || q.includes('rate')) {
      return `## Análise de Taxas de Juros 📊

### Taxa Média: ${kpis.averageInterestRate.toFixed(2)}% a.m.

### Distribuição por Faixa:
${kpis.interestRateDistribution.map(r => `- **${r.range}**: ${r.count} propostas`).join('\n')}

### Análise de Risco:
- Maior concentração na faixa de 1.5-2.0%
- Propostas acima de 2.5% representam maior risco
- Recomenda-se política de precificação baseada em score

### Recomendações:
1. Implementar modelo de scoring de crédito
2. Revisar política para faixas de maior risco
3. Criar ofertas personalizadas por perfil`;
    }

    // Clientes
    if (q.includes('cliente') || q.includes('top')) {
      const topCustomers = kpis.topCustomersByBalance.slice(0, 5);
      const list = topCustomers.map((c, i) => `${i + 1}. **${c.name}**: ${formatCurrency(c.balance)} (${c.accounts} conta(s))`).join('\n');
      
      return `## Top 5 Clientes por Saldo 👥

${list}

### Métricas Gerais:
- **Total de Clientes**: ${formatNumber(kpis.totalCustomers)}
- **Total de Contas**: ${formatNumber(kpis.totalAccounts)}
- **Saldo Médio por Conta**: ${formatCurrency(kpis.averageBalance)}

### Oportunidades:
- Programa de relacionamento para top clientes
- Cross-sell de produtos para alta renda
- Segmentação por potencial de investimento`;
    }

    // Transações / Movimentação
    if (q.includes('transação') || q.includes('transacao') || q.includes('movimentação') || q.includes('deposito') || q.includes('saque')) {
      return `## Movimentação Financeira 💸

### Resumo:
- **Total de Transações**: ${formatNumber(kpis.totalTransactions)}
- **Total Depósitos**: ${formatCurrency(kpis.totalDeposits)}
- **Total Saques**: ${formatCurrency(kpis.totalWithdrawals)}
- **Fluxo Líquido**: ${formatCurrency(kpis.netFlow)}

### Análise:
${kpis.netFlow >= 0 ? '✅ Fluxo positivo - mais depósitos que saques' : '⚠️ Fluxo negativo - mais saques que depósitos'}

### Últimos Meses:
${kpis.transactionsByMonth.slice(-3).map(m => `- **${m.month}**: Depósitos ${formatCurrency(m.deposits)} | Saques ${formatCurrency(m.withdrawals)}`).join('\n')}`;
    }

    // Recomendações
    if (q.includes('recomenda') || q.includes('sugest') || q.includes('melhorar') || q.includes('estratégia')) {
      return `## Recomendações Estratégicas 💡

### Para Gestão de Crédito:
1. **Modelo de Scoring**: Implementar análise preditiva de risco
2. **Precificação Dinâmica**: Ajustar taxas por perfil de risco
3. **Automação**: Acelerar processo de análise de propostas

### Para Crescimento da Base:
1. **Segmentação**: Identificar clientes com potencial de cross-sell
2. **Digital First**: Expandir canais digitais
3. **Parcerias**: Integrar com fintechs e marketplaces

### Para Gestão de Risco:
1. **Monitoramento**: Dashboard em tempo real de indicadores
2. **Alertas**: Sistema de early warning para inadimplência
3. **Diversificação**: Reduzir concentração geográfica

### Próximos Passos:
- Integrar bureaus de crédito
- Implementar Open Banking
- Desenvolver app mobile para clientes`;
    }

    // Resposta genérica
    return `Entendi sua pergunta sobre "${question}". 

Com base nos dados bancários disponíveis:
- **${formatNumber(kpis.totalProposals)}** propostas de crédito analisadas
- **${formatNumber(kpis.totalCustomers)}** clientes cadastrados
- **${formatNumber(kpis.totalAccounts)}** contas ativas
- **${data.agencies.length}** agências

Posso fornecer análises sobre: carteira de crédito, taxas de juros, movimentações, saldos por agência/estado, e recomendações estratégicas. Qual aspecto você gostaria de explorar?`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = generateResponse(userMessage.content);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="rounded-xl border border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Assistente de Analytics Bancário</h3>
          <p className="text-xs text-muted-foreground">Converse com seus dados</p>
        </div>
        <Sparkles className="ml-auto h-5 w-5 text-primary animate-pulse" />
      </div>

      {/* Messages */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`rounded-xl p-4 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
              {message.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="rounded-xl bg-muted p-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="border-t border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">Sugestões:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.slice(0, 3).map((q) => (
            <button
              key={q}
              onClick={() => handleSuggestionClick(q)}
              className="rounded-full bg-muted px-3 py-1 text-xs transition-colors hover:bg-muted/80 hover:text-primary"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre os dados bancários..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
