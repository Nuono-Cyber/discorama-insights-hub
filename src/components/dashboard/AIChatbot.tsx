import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { DashboardData } from '@/lib/dataService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatbotProps {
  data: DashboardData | null;
}

const suggestedQuestions = [
  "Qual é o ticket médio da empresa?",
  "Quais são as agências com maior faturamento?",
  "Como está a taxa de atraso nas devoluções?",
  "Quais são os top 5 clientes?",
  "Como evoluiu a receita ao longo do tempo?",
  "Quais são as recomendações para melhorar os KPIs?",
];

export function AIChatbot({ data }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Olá! Sou o assistente de analytics da **Discorama**. 🎬

Posso ajudá-lo a explorar os dados e obter insights sobre:
- 📊 **KPIs e métricas** de negócio
- 💰 **Receita e faturamento** por período, agência ou estado
- 👥 **Análise de clientes** e comportamento
- ⏱️ **Métricas de atraso** e pontualidade
- 📈 **Tendências** e recomendações

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

    // Ticket médio
    if (q.includes('ticket') || q.includes('médio')) {
      const avgTicket = kpis.averageTicket;
      return `## Ticket Médio 🎫

O **ticket médio** atual da Discorama é de **R$ ${(avgTicket).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}**.

### Análise:
- Total de pedidos: ${kpis.totalOrders.toLocaleString('pt-BR')}
- Receita total: R$ ${kpis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

### Recomendações para aumentar o ticket médio:
1. **Cross-selling**: Sugerir filmes complementares no momento da locação
2. **Bundles**: Criar pacotes promocionais (ex: 3 filmes por preço especial)
3. **Programa de fidelidade**: Oferecer descontos progressivos
4. **Upselling**: Promover lançamentos e títulos premium`;
    }

    // Agências
    if (q.includes('agência') || q.includes('agencias') || q.includes('loja')) {
      const topAgencies = kpis.revenueByAgency.slice(0, 5);
      const list = topAgencies.map((a, i) => `${i + 1}. **${a.name}**: R$ ${a.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join('\n');
      
      return `## Top 5 Agências por Faturamento 🏪

${list}

### Insights:
- A **${topAgencies[0]?.name}** lidera com destaque
- ${data.agencies.length} agências ativas no total
- Concentração de receita nas principais lojas indica oportunidade de desenvolver as demais`;
    }

    // Atraso
    if (q.includes('atraso') || q.includes('devolução') || q.includes('pontualidade')) {
      return `## Métricas de Atraso ⏱️

### Situação Atual:
- **Atraso médio**: ${kpis.averageDelay.toFixed(1)} dias
- **Pedidos com atraso**: ${kpis.lateOrders.toLocaleString('pt-BR')} (${kpis.lateOrdersPercentage.toFixed(1)}%)
- **Pedidos no prazo**: ${kpis.ordersOnTime.toLocaleString('pt-BR')}

### Recomendações para reduzir atrasos:
1. **Notificações**: SMS/WhatsApp lembrando da devolução
2. **Incentivos**: Descontos para devoluções antecipadas
3. **Penalidades graduais**: Multas proporcionais ao atraso
4. **Análise de perfil**: Identificar clientes recorrentes com atraso`;
    }

    // Clientes
    if (q.includes('cliente') || q.includes('top')) {
      const topCustomers = kpis.topCustomers.slice(0, 5);
      const list = topCustomers.map((c, i) => `${i + 1}. **${c.name}**: ${c.orders} pedidos - R$ ${c.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join('\n');
      
      return `## Top 5 Clientes 👥

${list}

### Insights:
- ${kpis.totalCustomers.toLocaleString('pt-BR')} clientes cadastrados
- Os top 10 clientes representam parcela significativa da receita
- Oportunidade de programa VIP para fidelização`;
    }

    // Receita / Evolução
    if (q.includes('receita') || q.includes('evolução') || q.includes('tendência') || q.includes('faturamento')) {
      const recentMonths = kpis.revenueByMonth.slice(-3);
      const trend = recentMonths.length >= 2 
        ? ((recentMonths[recentMonths.length - 1].value - recentMonths[0].value) / recentMonths[0].value * 100).toFixed(1)
        : 'N/A';

      return `## Evolução da Receita 📈

### Visão Geral:
- **Receita Total**: R$ ${kpis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- **Total de Pedidos**: ${kpis.totalOrders.toLocaleString('pt-BR')}

### Últimos Meses:
${recentMonths.map(m => `- ${m.month}: R$ ${m.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join('\n')}

### Tendência:
Variação nos últimos 3 meses: **${trend}%**`;
    }

    // Recomendações
    if (q.includes('recomenda') || q.includes('sugest') || q.includes('melhorar') || q.includes('estratégia')) {
      return `## Recomendações Estratégicas 💡

### Para Aumentar o Ticket Médio:
1. **Bundles e combos** de filmes por categoria
2. **Programa de pontos** com recompensas
3. **Sugestões personalizadas** baseadas no histórico

### Para Reduzir Atrasos:
1. **Sistema de notificação** multicanal (SMS, Email, WhatsApp)
2. **Incentivos** para devolução antecipada
3. **Análise preditiva** de clientes com risco de atraso

### Para Crescimento Geral:
1. **Expansão** nas regiões com menor penetração
2. **Digitalização** com catálogo online
3. **Parcerias** com cinemas e eventos culturais

### Próximos Passos Sugeridos:
- Implementar dashboard de monitoramento em tempo real
- Criar alertas automáticos para KPIs críticos
- Desenvolver modelo preditivo de churn`;
    }

    // Resposta genérica
    return `Entendi sua pergunta sobre "${question}". 

Com base nos dados disponíveis:
- **${kpis.totalOrders.toLocaleString('pt-BR')}** pedidos analisados
- **${kpis.totalCustomers.toLocaleString('pt-BR')}** clientes cadastrados
- **${data.agencies.length}** agências ativas

Posso fornecer análises específicas sobre ticket médio, atrasos, receita por agência/estado, top clientes e recomendações. Qual aspecto você gostaria de explorar?`;
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
          <h3 className="font-semibold">Assistente de Analytics</h3>
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
            placeholder="Pergunte sobre os dados..."
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
