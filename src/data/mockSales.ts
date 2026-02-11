export interface SalesRecord {
  id: number;
  consultant: string;
  rate: number; // e.g. 0.63
  client: string;
  type: '自然人' | '法人';
  item: string; // 服務項目
  dealDate: string;
  amount: number; // 顧問約金額
  serviceFee: number; // 服務費
  paidAmount: number; // 已匯款金額
  status: '已付款' | '部分付款' | '未付款';
  commissionDate: string; // 佣金發放日
}

export const mockSales: SalesRecord[] = [
  {
    id: 1,
    consultant: "Karen",
    rate: 0.63,
    client: "長榮海運 (林先生)",
    type: "自然人",
    item: "基金標的",
    dealDate: "2026-01-05",
    amount: 150000,
    serviceFee: 0,
    paidAmount: 150000,
    status: "已付款",
    commissionDate: "2026-02-10"
  },
  {
    id: 2,
    consultant: "Karen",
    rate: 0.63,
    client: "傳產老闆 (王董)",
    type: "法人",
    item: "顧問約",
    dealDate: "2026-01-21",
    amount: 150000,
    serviceFee: 50000,
    paidAmount: 200000,
    status: "已付款",
    commissionDate: "2026-02-10"
  },
  {
    id: 3,
    consultant: "Vincent",
    rate: 0.50,
    client: "科技業業務 (陳小姐)",
    type: "自然人",
    item: "個人財務",
    dealDate: "2026-01-15",
    amount: 50000,
    serviceFee: 10000,
    paidAmount: 0,
    status: "未付款",
    commissionDate: "2026-02-10"
  },
  {
    id: 4,
    consultant: "Alex",
    rate: 0.50,
    client: "房仲老闆 (張先生)",
    type: "法人",
    item: "企業融資",
    dealDate: "2026-02-02",
    amount: 300000,
    serviceFee: 0,
    paidAmount: 150000,
    status: "部分付款",
    commissionDate: "2026-03-10"
  },
  {
    id: 5,
    consultant: "Vincent",
    rate: 0.50,
    client: "建設公司",
    type: "法人",
    item: "顧問約",
    dealDate: "2026-02-05",
    amount: 150000,
    serviceFee: 0,
    paidAmount: 0,
    status: "未付款",
    commissionDate: "2026-03-10"
  }
];

export const consultantPerformance = [
  { name: 'Karen', revenue: 350000, deals: 2 },
  { name: 'Alex', revenue: 300000, deals: 1 },
  { name: 'Vincent', revenue: 210000, deals: 2 },
  { name: 'Brain', revenue: 150000, deals: 1 },
  { name: 'Jira', revenue: 120000, deals: 1 },
];
