export interface Announcement {
  id: number;
  title: string;
  date: string;
  category: '昱成公告' | '公勝公告' | '聯眾公告';
  content: string;
  isImportant: boolean;
}

export interface ResourceFile {
  id: number;
  name: string;
  type: 'PDF' | 'PPT' | 'Excel' | 'Link' | 'Image';
  category: '銷售資源' | '行政規章' | 'SOP' | '申請表格';
  updatedAt: string;
  size?: string;
  url: string;
}

export const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "2026年第一季業績競賽辦法公布",
    date: "2026-02-01",
    category: "昱成公告",
    content: "各位同仁大家好，Q1 業績競賽辦法已公布，詳情請見附件...",
    isImportant: true
  },
  {
    id: 2,
    title: "公勝保經佣金調整通知",
    date: "2026-01-28",
    category: "公勝公告",
    content: "自 2026/2/1 起，部分壽險商品佣金率調整...",
    isImportant: true
  },
  {
    id: 3,
    title: "聯眾保經新商品上架說明會",
    date: "2026-01-25",
    category: "聯眾公告",
    content: "時間：2026/2/15 (五) 下午 14:00，地點：總公司會議室...",
    isImportant: false
  }
];

export const mockResources: ResourceFile[] = [
  {
    id: 1,
    name: "昱成公司簡介 (2026版)",
    type: "PPT",
    category: "銷售資源",
    updatedAt: "2026-01-10",
    size: "15.4 MB",
    url: "#"
  },
  {
    id: 2,
    name: "企業融資服務 SOP",
    type: "PDF",
    category: "SOP",
    updatedAt: "2026-01-15",
    size: "2.1 MB",
    url: "#"
  },
  {
    id: 3,
    name: "業務報件申請表",
    type: "Excel",
    category: "申請表格",
    updatedAt: "2025-12-20",
    size: "45 KB",
    url: "#"
  },
  {
    id: 4,
    name: "客戶 KYC 訪談紀錄表",
    type: "PDF",
    category: "申請表格",
    updatedAt: "2026-01-05",
    size: "1.2 MB",
    url: "#"
  },
  {
    id: 5,
    name: "節稅規劃案例分享",
    type: "PPT",
    category: "銷售資源",
    updatedAt: "2026-02-02",
    size: "8.7 MB",
    url: "#"
  },
  {
    id: 6,
    name: "員工請假規則",
    type: "PDF",
    category: "行政規章",
    updatedAt: "2025-11-30",
    size: "500 KB",
    url: "#"
  },
  {
    id: 7,
    name: "昱成官網",
    type: "Link",
    category: "銷售資源",
    updatedAt: "2026-01-01",
    url: "https://www.yucheng.com"
  }
];
