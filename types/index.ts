// 用户类型
export interface User {
  id: string;
  name: string;
  phone: string;
  idCard: string;
  userType: 'normal' | 'government';
  location: {
    province: string;
    city: string;
    district: string;
  };
}

// 事务类型
export interface Transaction {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  type: string;
  createdAt: string;
  updatedAt: string;
  steps: TransactionStep[];
  location: string;
  estimatedTime: string;
  requiredDocuments: string[];
}

// 事务步骤
export interface TransactionStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'current';
  order: number;
  location: string;
  estimatedTime: string;
  requiredDocuments: string[];
}

// 政策类型
export interface Policy {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  publishDate: string;
  effectiveDate: string;
  location: string;
  tags: string[];
  author: string;
  isNew: boolean;
}

// 常见事务类型
export interface CommonTransaction {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  estimatedTime: string;
  requiredDocuments: string[];
  process: string[]; // 办理流程
  materials: string[]; // 所需材料
  address: string; // 办理地址
  onlineFormFields: string[]; // 网上需要填写的信息
}

// 搜索历史
export interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
}

// 应用状态
export interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  currentTab: 'home' | 'transactions' | 'policies' | 'profile';
  searchHistory: SearchHistory[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
} 