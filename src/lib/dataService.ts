// Data service for banking analytics dashboard

export interface Agency {
  cod_agencia: number;
  nome: string;
  endereco: string;
  cidade: string;
  uf: string;
  data_abertura: Date;
  tipo_agencia: string;
}

export interface Customer {
  cod_cliente: number;
  primeiro_nome: string;
  ultimo_nome: string;
  email: string;
  tipo_cliente: string;
  data_inclusao: Date;
  cpfcnpj: string;
  data_nascimento: Date;
  endereco: string;
  cep: string;
}

export interface Employee {
  cod_colaborador: number;
  primeiro_nome: string;
  ultimo_nome: string;
  email: string;
  cpf: string;
  data_nascimento: Date;
  endereco: string;
  cep: string;
}

export interface Account {
  num_conta: number;
  cod_cliente: number;
  cod_agencia: number;
  cod_colaborador: number;
  tipo_conta: string;
  data_abertura: Date;
  saldo_total: number;
  saldo_disponivel: number;
  data_ultimo_lancamento: Date;
}

export interface Transaction {
  cod_transacao: number;
  num_conta: number;
  data_transacao: Date;
  nome_transacao: string;
  valor_transacao: number;
}

export interface CreditProposal {
  cod_proposta: number;
  cod_cliente: number;
  cod_colaborador: number;
  data_entrada_proposta: Date;
  taxa_juros_mensal: number;
  valor_proposta: number;
  valor_financiamento: number;
  valor_entrada: number;
  valor_prestacao: number;
  quantidade_parcelas: number;
  carencia: number;
  status_proposta: string;
}

export interface DashboardData {
  agencies: Agency[];
  customers: Customer[];
  employees: Employee[];
  accounts: Account[];
  transactions: Transaction[];
  proposals: CreditProposal[];
  kpis: {
    // Accounts KPIs
    totalAccounts: number;
    totalBalance: number;
    averageBalance: number;
    
    // Transaction KPIs
    totalTransactions: number;
    totalDeposits: number;
    totalWithdrawals: number;
    netFlow: number;
    
    // Credit KPIs
    totalProposals: number;
    totalCreditValue: number;
    averageCreditValue: number;
    averageInterestRate: number;
    averageInstallments: number;
    
    // Customer KPIs
    totalCustomers: number;
    totalEmployees: number;
    
    // Aggregations
    balanceByAgency: { name: string; value: number }[];
    transactionsByMonth: { month: string; deposits: number; withdrawals: number }[];
    proposalsByStatus: { status: string; count: number; value: number }[];
    proposalsByMonth: { month: string; count: number; value: number }[];
    topCustomersByBalance: { name: string; balance: number; accounts: number }[];
    creditByAgency: { name: string; value: number; count: number }[];
    interestRateDistribution: { range: string; count: number }[];
    balanceByState: { uf: string; value: number }[];
  };
}

let cachedData: DashboardData | null = null;

async function parseCSV<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  const text = await response.text();
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const obj: any = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i] || '';
    });
    return obj as T;
  });
}

export async function loadData(): Promise<DashboardData> {
  if (cachedData) return cachedData;

  // Load all CSV files in parallel
  const [
    agenciesRaw,
    customersRaw,
    employeesRaw,
    accountsRaw,
    transactionsRaw,
    proposalsRaw,
  ] = await Promise.all([
    parseCSV<any>('/data/agencias.csv'),
    parseCSV<any>('/data/clientes.csv'),
    parseCSV<any>('/data/colaboradores.csv'),
    parseCSV<any>('/data/contas.csv'),
    parseCSV<any>('/data/transacoes.csv'),
    parseCSV<any>('/data/propostas_credito.csv'),
  ]);

  // Parse agencies
  const agencies: Agency[] = agenciesRaw.map((row: any) => ({
    cod_agencia: parseInt(row.cod_agencia),
    nome: row.nome || '',
    endereco: row.endereco || '',
    cidade: row.cidade || '',
    uf: row.uf || '',
    data_abertura: new Date(row.data_abertura),
    tipo_agencia: row.tipo_agencia || '',
  }));

  // Parse customers
  const customers: Customer[] = customersRaw.map((row: any) => ({
    cod_cliente: parseInt(row.cod_cliente),
    primeiro_nome: row.primeiro_nome || '',
    ultimo_nome: row.ultimo_nome || '',
    email: row.email || '',
    tipo_cliente: row.tipo_cliente || '',
    data_inclusao: new Date(row.data_inclusao),
    cpfcnpj: row.cpfcnpj || '',
    data_nascimento: new Date(row.data_nascimento),
    endereco: row.endereco || '',
    cep: row.cep || '',
  }));

  // Parse employees
  const employees: Employee[] = employeesRaw.map((row: any) => ({
    cod_colaborador: parseInt(row.cod_colaborador),
    primeiro_nome: row.primeiro_nome || '',
    ultimo_nome: row.ultimo_nome || '',
    email: row.email || '',
    cpf: row.cpf || '',
    data_nascimento: new Date(row.data_nascimento),
    endereco: row.endereco || '',
    cep: row.cep || '',
  }));

  // Parse accounts
  const accounts: Account[] = accountsRaw.map((row: any) => ({
    num_conta: parseInt(row.num_conta),
    cod_cliente: parseInt(row.cod_cliente),
    cod_agencia: parseInt(row.cod_agencia),
    cod_colaborador: parseInt(row.cod_colaborador),
    tipo_conta: row.tipo_conta || '',
    data_abertura: new Date(row.data_abertura),
    saldo_total: parseFloat(row.saldo_total) || 0,
    saldo_disponivel: parseFloat(row.saldo_disponivel) || 0,
    data_ultimo_lancamento: new Date(row.data_ultimo_lancamento),
  }));

  // Parse transactions
  const transactions: Transaction[] = transactionsRaw.map((row: any) => ({
    cod_transacao: parseInt(row.cod_transacao),
    num_conta: parseInt(row.num_conta),
    data_transacao: new Date(row.data_transacao),
    nome_transacao: row.nome_transacao || '',
    valor_transacao: parseFloat(row.valor_transacao) || 0,
  }));

  // Parse credit proposals
  const proposals: CreditProposal[] = proposalsRaw.map((row: any) => ({
    cod_proposta: parseInt(row.cod_proposta),
    cod_cliente: parseInt(row.cod_cliente),
    cod_colaborador: parseInt(row.cod_colaborador),
    data_entrada_proposta: new Date(row.data_entrada_proposta),
    taxa_juros_mensal: parseFloat(row.taxa_juros_mensal) || 0,
    valor_proposta: parseFloat(row.valor_proposta) || 0,
    valor_financiamento: parseFloat(row.valor_financiamento) || 0,
    valor_entrada: parseFloat(row.valor_entrada) || 0,
    valor_prestacao: parseFloat(row.valor_prestacao) || 0,
    quantidade_parcelas: parseInt(row.quantidade_parcelas) || 0,
    carencia: parseInt(row.carencia) || 0,
    status_proposta: row.status_proposta || 'Enviada',
  }));

  // Calculate KPIs
  const totalAccounts = accounts.length;
  const totalBalance = accounts.reduce((sum, a) => sum + a.saldo_total, 0);
  const averageBalance = totalAccounts > 0 ? totalBalance / totalAccounts : 0;

  const totalTransactions = transactions.length;
  const deposits = transactions.filter(t => t.valor_transacao > 0);
  const withdrawals = transactions.filter(t => t.valor_transacao < 0);
  const totalDeposits = deposits.reduce((sum, t) => sum + t.valor_transacao, 0);
  const totalWithdrawals = Math.abs(withdrawals.reduce((sum, t) => sum + t.valor_transacao, 0));
  const netFlow = totalDeposits - totalWithdrawals;

  const totalProposals = proposals.length;
  const totalCreditValue = proposals.reduce((sum, p) => sum + p.valor_proposta, 0);
  const averageCreditValue = totalProposals > 0 ? totalCreditValue / totalProposals : 0;
  const averageInterestRate = totalProposals > 0 
    ? proposals.reduce((sum, p) => sum + p.taxa_juros_mensal, 0) / totalProposals * 100 
    : 0;
  const averageInstallments = totalProposals > 0
    ? proposals.reduce((sum, p) => sum + p.quantidade_parcelas, 0) / totalProposals
    : 0;

  // Balance by agency
  const balanceByAgencyMap = new Map<number, number>();
  accounts.forEach(a => {
    const current = balanceByAgencyMap.get(a.cod_agencia) || 0;
    balanceByAgencyMap.set(a.cod_agencia, current + a.saldo_total);
  });
  const balanceByAgency = Array.from(balanceByAgencyMap.entries())
    .map(([cod, value]) => {
      const agency = agencies.find(a => a.cod_agencia === cod);
      return { name: agency?.nome || `Agência ${cod}`, value };
    })
    .sort((a, b) => b.value - a.value);

  // Transactions by month
  const transactionsByMonthMap = new Map<string, { deposits: number; withdrawals: number }>();
  transactions.forEach(t => {
    if (t.data_transacao instanceof Date && !isNaN(t.data_transacao.getTime())) {
      const monthKey = `${t.data_transacao.getFullYear()}-${String(t.data_transacao.getMonth() + 1).padStart(2, '0')}`;
      const current = transactionsByMonthMap.get(monthKey) || { deposits: 0, withdrawals: 0 };
      if (t.valor_transacao > 0) {
        current.deposits += t.valor_transacao;
      } else {
        current.withdrawals += Math.abs(t.valor_transacao);
      }
      transactionsByMonthMap.set(monthKey, current);
    }
  });
  const transactionsByMonth = Array.from(transactionsByMonthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([month, data]) => ({ month, ...data }));

  // Proposals by status
  const proposalsByStatusMap = new Map<string, { count: number; value: number }>();
  proposals.forEach(p => {
    const status = p.status_proposta || 'Desconhecido';
    const current = proposalsByStatusMap.get(status) || { count: 0, value: 0 };
    proposalsByStatusMap.set(status, { count: current.count + 1, value: current.value + p.valor_proposta });
  });
  const proposalsByStatus = Array.from(proposalsByStatusMap.entries())
    .map(([status, data]) => ({ status, ...data }))
    .sort((a, b) => b.value - a.value);

  // Proposals by month
  const proposalsByMonthMap = new Map<string, { count: number; value: number }>();
  proposals.forEach(p => {
    if (p.data_entrada_proposta instanceof Date && !isNaN(p.data_entrada_proposta.getTime())) {
      const monthKey = `${p.data_entrada_proposta.getFullYear()}-${String(p.data_entrada_proposta.getMonth() + 1).padStart(2, '0')}`;
      const current = proposalsByMonthMap.get(monthKey) || { count: 0, value: 0 };
      proposalsByMonthMap.set(monthKey, { count: current.count + 1, value: current.value + p.valor_proposta });
    }
  });
  const proposalsByMonth = Array.from(proposalsByMonthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-24)
    .map(([month, data]) => ({ month, ...data }));

  // Top customers by balance
  const customerBalanceMap = new Map<number, { balance: number; accounts: number }>();
  accounts.forEach(a => {
    const current = customerBalanceMap.get(a.cod_cliente) || { balance: 0, accounts: 0 };
    customerBalanceMap.set(a.cod_cliente, {
      balance: current.balance + a.saldo_total,
      accounts: current.accounts + 1,
    });
  });
  const topCustomersByBalance = Array.from(customerBalanceMap.entries())
    .map(([cod, data]) => {
      const customer = customers.find(c => c.cod_cliente === cod);
      return {
        name: customer ? `${customer.primeiro_nome} ${customer.ultimo_nome}` : `Cliente ${cod}`,
        ...data,
      };
    })
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 10);

  // Credit by agency (via employee-agency relationship, approximated by account)
  const creditByAgencyMap = new Map<number, { value: number; count: number }>();
  proposals.forEach(p => {
    // Find account for this customer to get agency
    const account = accounts.find(a => a.cod_cliente === p.cod_cliente);
    if (account) {
      const current = creditByAgencyMap.get(account.cod_agencia) || { value: 0, count: 0 };
      creditByAgencyMap.set(account.cod_agencia, {
        value: current.value + p.valor_proposta,
        count: current.count + 1,
      });
    }
  });
  const creditByAgency = Array.from(creditByAgencyMap.entries())
    .map(([cod, data]) => {
      const agency = agencies.find(a => a.cod_agencia === cod);
      return { name: agency?.nome || `Agência ${cod}`, ...data };
    })
    .sort((a, b) => b.value - a.value);

  // Interest rate distribution
  const rateRanges = [
    { min: 0, max: 0.015, label: '0-1.5%' },
    { min: 0.015, max: 0.018, label: '1.5-1.8%' },
    { min: 0.018, max: 0.02, label: '1.8-2.0%' },
    { min: 0.02, max: 0.025, label: '2.0-2.5%' },
    { min: 0.025, max: 1, label: '>2.5%' },
  ];
  const interestRateDistribution = rateRanges.map(range => ({
    range: range.label,
    count: proposals.filter(p => p.taxa_juros_mensal >= range.min && p.taxa_juros_mensal < range.max).length,
  }));

  // Balance by state
  const balanceByStateMap = new Map<string, number>();
  accounts.forEach(a => {
    const agency = agencies.find(ag => ag.cod_agencia === a.cod_agencia);
    if (agency) {
      const current = balanceByStateMap.get(agency.uf) || 0;
      balanceByStateMap.set(agency.uf, current + a.saldo_total);
    }
  });
  const balanceByState = Array.from(balanceByStateMap.entries())
    .map(([uf, value]) => ({ uf, value }))
    .sort((a, b) => b.value - a.value);

  cachedData = {
    agencies,
    customers,
    employees,
    accounts,
    transactions,
    proposals,
    kpis: {
      totalAccounts,
      totalBalance,
      averageBalance,
      totalTransactions,
      totalDeposits,
      totalWithdrawals,
      netFlow,
      totalProposals,
      totalCreditValue,
      averageCreditValue,
      averageInterestRate,
      averageInstallments,
      totalCustomers: customers.length,
      totalEmployees: employees.length,
      balanceByAgency,
      transactionsByMonth,
      proposalsByStatus,
      proposalsByMonth,
      topCustomersByBalance,
      creditByAgency,
      interestRateDistribution,
      balanceByState,
    },
  };

  return cachedData;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}
