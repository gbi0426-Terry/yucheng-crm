export interface CalendarEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: '約訪' | '訓練' | '會議' | '其他';
  consultant: string;
  details?: string;
}

export const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "長榮海運林先生 - 初次約訪",
    date: "2026-02-06",
    time: "14:00",
    type: "約訪",
    consultant: "Karen",
    details: "地點：台北市長安東路二段..."
  },
  {
    id: 2,
    title: "新人教育訓練 - 財務規劃基礎",
    date: "2026-02-09",
    time: "09:30",
    type: "訓練",
    consultant: "Vincent",
    details: "會議室 A"
  },
  {
    id: 3,
    title: "部門週會 (Review)",
    date: "2026-02-02",
    time: "10:00",
    type: "會議",
    consultant: "All",
    details: "每週例行會議"
  },
  {
    id: 4,
    title: "建設公司陳特助 - 提案說明",
    date: "2026-02-12",
    time: "15:00",
    type: "約訪",
    consultant: "Alex",
    details: "準備企業融資方案簡報"
  },
  {
    id: 5,
    title: "房仲公會演講",
    date: "2026-02-20",
    time: "13:30",
    type: "其他",
    consultant: "Karen",
    details: "受邀演講"
  },
  {
    id: 6,
    title: "科技業業務陳小姐 - 簽約",
    date: "2026-02-05",
    time: "11:00",
    type: "約訪",
    consultant: "Vincent",
    details: "確認合約細節"
  }
];
