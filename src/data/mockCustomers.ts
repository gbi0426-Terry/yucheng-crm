export interface Customer {
  id: number;
  name: string;
  type: '自然人' | '法人';
  industry: string; // 職業/產業
  source: string; // 來源
  probability: 1 | 2 | 3 | 4 | 5; // 成交機率 (1-5 stars)
  status: '新名單' | 'KYC中' | '約訪中' | '提案中' | '已成交' | '結案';
  revenue: number; // 預估/實際業績
  lastContact: string; // 最後聯繫日
  consultant: string; // 負責顧問
}

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "長榮海運 (林先生)",
    type: "自然人",
    industry: "傳產/航運",
    source: "陌生開發",
    probability: 4,
    status: "已成交",
    revenue: 150000,
    lastContact: "2026-02-06",
    consultant: "Karen"
  },
  {
    id: 2,
    name: "科技業業務 (陳小姐)",
    type: "自然人",
    industry: "科技業",
    source: "轉介紹",
    probability: 3,
    status: "提案中",
    revenue: 50000,
    lastContact: "2026-02-05",
    consultant: "Vincent"
  },
  {
    id: 3,
    name: "房仲老闆 (張先生)",
    type: "法人",
    industry: "不動產",
    source: "老闆名單",
    probability: 5,
    status: "已成交",
    revenue: 300000,
    lastContact: "2026-02-04",
    consultant: "Alex"
  },
  {
    id: 4,
    name: "傳產老闆 (王董)",
    type: "法人",
    industry: "製造業",
    source: "異業合作",
    probability: 4,
    status: "約訪中",
    revenue: 500000,
    lastContact: "2026-02-03",
    consultant: "Vincent"
  },
  {
    id: 5,
    name: "行銷主管 (李小姐)",
    type: "自然人",
    industry: "數位行銷",
    source: "網路名單",
    probability: 2,
    status: "KYC中",
    revenue: 30000,
    lastContact: "2026-02-01",
    consultant: "Karen"
  },
  {
    id: 6,
    name: "建設公司 (陳特助)",
    type: "法人",
    industry: "建築營造",
    source: "老闆名單",
    probability: 1,
    status: "新名單",
    revenue: 0,
    lastContact: "2026-01-28",
    consultant: "Alex"
  },
];
