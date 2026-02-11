export interface CheckInRecord {
  consultant: string;
  month: string; // YYYY-MM
  count: number;
}

export const mockCheckIns: CheckInRecord[] = [
  { consultant: 'Karen', month: '2025-09', count: 7 },
  { consultant: 'Karen', month: '2025-10', count: 24 },
  { consultant: 'Karen', month: '2025-11', count: 23 },
  { consultant: 'Karen', month: '2025-12', count: 23 },
  
  { consultant: 'Vincent', month: '2025-09', count: 8 },
  { consultant: 'Vincent', month: '2025-10', count: 14 },
  { consultant: 'Vincent', month: '2025-11', count: 13 },
  { consultant: 'Vincent', month: '2025-12', count: 16 },

  { consultant: 'Alex', month: '2025-09', count: 7 },
  { consultant: 'Alex', month: '2025-10', count: 17 },
  { consultant: 'Alex', month: '2025-11', count: 15 },
  { consultant: 'Alex', month: '2025-12', count: 12 },

  { consultant: 'Brain', month: '2025-09', count: 6 },
  { consultant: 'Brain', month: '2025-10', count: 8 },
  { consultant: 'Brain', month: '2025-11', count: 6 },
  { consultant: 'Brain', month: '2025-12', count: 6 },
];

export const mockBankInfo = [
  { bank: '中國信託', product: '企業融資 A', rate: '2.5%', limit: '3000萬', contact: '林襄理 0912-345-678' },
  { bank: '國泰世華', product: '中小企業貸', rate: '2.3%', limit: '2000萬', contact: '陳經理 0988-777-666' },
  { bank: '玉山銀行', product: '微型創業', rate: '1.98%', limit: '500萬', contact: '王專員 02-2345-6789' },
];

export const mockCommissionRates = [
  { product: '富邦人壽 - 終身壽險', code: 'UL001', year1: '40%', year2: '10%', year3: '5%' },
  { product: '國泰人壽 - 醫療險', code: 'HS002', year1: '50%', year2: '15%', year3: '5%' },
  { product: '全球人壽 - 重大傷病', code: 'CI003', year1: '55%', year2: '20%', year3: '10%' },
];
