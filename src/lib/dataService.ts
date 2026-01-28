import * as XLSX from 'xlsx';

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

export interface Order {
  cod_pedido: number;
  cod_cliente: number;
  cod_agencia: number;
  data_pedido: Date;
  quantidade: number;
  valor_total: number;
  valor_unitario: number;
  valor_desconto: number;
  valor_frete: number;
  dias_atraso: number;
  parcelas: number;
  status: string;
}

export interface DashboardData {
  agencies: Agency[];
  customers: Customer[];
  orders: Order[];
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageTicket: number;
    averageDelay: number;
    lateOrders: number;
    lateOrdersPercentage: number;
    ordersOnTime: number;
    revenueByAgency: { name: string; value: number }[];
    revenueByMonth: { month: string; value: number }[];
    ordersByStatus: { status: string; count: number }[];
    topCustomers: { name: string; orders: number; revenue: number }[];
    revenueByState: { uf: string; value: number }[];
  };
}

let cachedData: DashboardData | null = null;

export async function loadData(): Promise<DashboardData> {
  if (cachedData) return cachedData;

  const response = await fetch('/data/DADOS.xlsx');
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });

  // Parse agencies (first sheet)
  const agenciesSheet = workbook.Sheets[workbook.SheetNames[0]];
  const agenciesRaw = XLSX.utils.sheet_to_json<any>(agenciesSheet);
  
  const agencies: Agency[] = agenciesRaw.map((row: any) => ({
    cod_agencia: parseInt(row.cod_agencia || row['cod_agencia']),
    nome: row.nome || '',
    endereco: row.endereco || '',
    cidade: row.cidade || '',
    uf: row.uf || '',
    data_abertura: new Date(row.data_abertura || row['data_abertura']),
    tipo_agencia: row.tipo_agencia || row['tipo_agencia'] || '',
  }));

  // Parse customers (second sheet)
  const customersSheet = workbook.Sheets[workbook.SheetNames[1]];
  const customersRaw = XLSX.utils.sheet_to_json<any>(customersSheet);
  
  const customers: Customer[] = customersRaw.map((row: any) => ({
    cod_cliente: parseInt(row.cod_cliente || row['cod_cliente']),
    primeiro_nome: row.primeiro_nome || '',
    ultimo_nome: row.ultimo_nome || '',
    email: row.email || '',
    tipo_cliente: row.tipo_cliente || '',
    data_inclusao: new Date(row.data_inclusao || row['data_inclusao']),
    cpfcnpj: row.cpfcnpj || '',
    data_nascimento: new Date(row.data_nascimento || row['data_nascimento']),
    endereco: row.endereco || '',
    cep: row.cep || '',
  }));

  // Parse orders (third sheet or look for it)
  let ordersSheet = workbook.Sheets[workbook.SheetNames[2]];
  if (!ordersSheet) {
    // Try to find orders sheet by name
    const ordersSheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('pedido') || name.toLowerCase().includes('order')
    );
    if (ordersSheetName) {
      ordersSheet = workbook.Sheets[ordersSheetName];
    }
  }

  const ordersRaw = ordersSheet ? XLSX.utils.sheet_to_json<any>(ordersSheet) : [];
  
  const orders: Order[] = ordersRaw.map((row: any) => ({
    cod_pedido: parseInt(row.cod_pedido || row['cod_pedido'] || 0),
    cod_cliente: parseInt(row.cod_cliente || row['cod_cliente'] || 0),
    cod_agencia: parseInt(row.cod_agencia || row['cod_agencia'] || 0),
    data_pedido: new Date(row.data_pedido || row['data_pedido'] || Date.now()),
    quantidade: parseInt(row.quantidade || row['quantidade'] || 0),
    valor_total: parseFloat(row.valor_total || row['valor_total'] || 0),
    valor_unitario: parseFloat(row.valor_unitario || row['valor_unitario'] || 0),
    valor_desconto: parseFloat(row.valor_desconto || row['valor_desconto'] || 0),
    valor_frete: parseFloat(row.valor_frete || row['valor_frete'] || 0),
    dias_atraso: parseInt(row.dias_atraso || row['dias_atraso'] || 0),
    parcelas: parseInt(row.parcelas || row['parcelas'] || 0),
    status: row.status || 'Enviada',
  }));

  // Calculate KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.valor_total || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const lateOrders = orders.filter(o => o.dias_atraso > 0).length;
  const averageDelay = lateOrders > 0 
    ? orders.filter(o => o.dias_atraso > 0).reduce((sum, o) => sum + o.dias_atraso, 0) / lateOrders 
    : 0;
  const lateOrdersPercentage = totalOrders > 0 ? (lateOrders / totalOrders) * 100 : 0;
  const ordersOnTime = totalOrders - lateOrders;

  // Revenue by agency
  const revenueByAgencyMap = new Map<number, number>();
  orders.forEach(o => {
    const current = revenueByAgencyMap.get(o.cod_agencia) || 0;
    revenueByAgencyMap.set(o.cod_agencia, current + (o.valor_total || 0));
  });
  const revenueByAgency = Array.from(revenueByAgencyMap.entries())
    .map(([cod, value]) => {
      const agency = agencies.find(a => a.cod_agencia === cod);
      return { name: agency?.nome || `Agência ${cod}`, value };
    })
    .sort((a, b) => b.value - a.value);

  // Revenue by month
  const revenueByMonthMap = new Map<string, number>();
  orders.forEach(o => {
    if (o.data_pedido instanceof Date && !isNaN(o.data_pedido.getTime())) {
      const monthKey = `${o.data_pedido.getFullYear()}-${String(o.data_pedido.getMonth() + 1).padStart(2, '0')}`;
      const current = revenueByMonthMap.get(monthKey) || 0;
      revenueByMonthMap.set(monthKey, current + (o.valor_total || 0));
    }
  });
  const revenueByMonth = Array.from(revenueByMonthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12) // Last 12 months
    .map(([month, value]) => ({ month, value }));

  // Orders by status
  const ordersByStatusMap = new Map<string, number>();
  orders.forEach(o => {
    const status = o.status || 'Desconhecido';
    const current = ordersByStatusMap.get(status) || 0;
    ordersByStatusMap.set(status, current + 1);
  });
  const ordersByStatus = Array.from(ordersByStatusMap.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  // Top customers
  const customerOrdersMap = new Map<number, { orders: number; revenue: number }>();
  orders.forEach(o => {
    const current = customerOrdersMap.get(o.cod_cliente) || { orders: 0, revenue: 0 };
    customerOrdersMap.set(o.cod_cliente, {
      orders: current.orders + 1,
      revenue: current.revenue + (o.valor_total || 0),
    });
  });
  const topCustomers = Array.from(customerOrdersMap.entries())
    .map(([cod, data]) => {
      const customer = customers.find(c => c.cod_cliente === cod);
      return {
        name: customer ? `${customer.primeiro_nome} ${customer.ultimo_nome}` : `Cliente ${cod}`,
        orders: data.orders,
        revenue: data.revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Revenue by state (from agencies)
  const revenueByStateMap = new Map<string, number>();
  orders.forEach(o => {
    const agency = agencies.find(a => a.cod_agencia === o.cod_agencia);
    if (agency) {
      const current = revenueByStateMap.get(agency.uf) || 0;
      revenueByStateMap.set(agency.uf, current + (o.valor_total || 0));
    }
  });
  const revenueByState = Array.from(revenueByStateMap.entries())
    .map(([uf, value]) => ({ uf, value }))
    .sort((a, b) => b.value - a.value);

  cachedData = {
    agencies,
    customers,
    orders,
    kpis: {
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageTicket,
      averageDelay,
      lateOrders,
      lateOrdersPercentage,
      ordersOnTime,
      revenueByAgency,
      revenueByMonth,
      ordersByStatus,
      topCustomers,
      revenueByState,
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
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}
