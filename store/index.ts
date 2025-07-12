import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User, Transaction, Policy, SearchHistory, CommonTransaction } from '@/types';

// 静态事务数据
export const commonTransactions: CommonTransaction[] = [
  {
    id: '1',
    title: '身份证办理',
    description: '居民身份证申领、换领、补领服务',
    icon: '🪪',
    category: '户政服务',
    estimatedTime: '7个工作日',
    requiredDocuments: ['户口本', '照片'],
    process: [
      '1. 前往就近的户政服务中心',
      '2. 填写《居民身份证申领登记表》',
      '3. 现场拍照或提交电子照片',
      '4. 缴纳工本费',
      '5. 等待制作完成',
      '6. 领取身份证'
    ],
    materials: [
      '户口本原件',
      '近期免冠照片（也可现场拍摄）',
      '办理费用（首次办理20元，换领/补领40元）'
    ],
    address: '各区县户政服务中心或派出所户籍窗口',
    onlineFormFields: [
      '姓名',
      '性别',
      '民族',
      '出生日期',
      '住址',
      '联系电话',
      '申办类型（首次/换领/补领）'
    ]
  },
  {
    id: '2',
    title: '驾驶证办理',
    description: '机动车驾驶证申领服务',
    icon: '🚗',
    category: '交通服务',
    estimatedTime: '15-30个工作日',
    requiredDocuments: ['身份证', '体检报告'],
    process: [
      '1. 预约体检',
      '2. 参加科目一考试',
      '3. 参加科目二考试',
      '4. 参加科目三考试',
      '5. 参加科目四考试',
      '6. 领取驾驶证'
    ],
    materials: [
      '身份证原件及复印件',
      '体检报告',
      '近期免冠彩色照片',
      '考试费用'
    ],
    address: '当地车管所或驾驶员培训学校',
    onlineFormFields: [
      '姓名',
      '性别',
      '身份证号',
      '联系电话',
      '申请驾驶证类型',
      '是否有驾驶经历',
      '培训学校选择'
    ]
  },
  {
    id: '3',
    title: '结婚登记',
    description: '办理结婚证书服务',
    icon: '💍',
    category: '民政服务',
    estimatedTime: '当场办理，约30分钟',
    requiredDocuments: ['身份证', '户口本', '照片'],
    process: [
      '1. 双方携带证件前往民政局婚姻登记处',
      '2. 填写《结婚登记申请书》',
      '3. 提交证件和照片',
      '4. 缴纳登记费',
      '5. 领取结婚证'
    ],
    materials: [
      '双方身份证原件',
      '双方户口本原件',
      '双方近期2寸免冠彩色照片（红底或蓝底）各2张',
      '未婚声明书'
    ],
    address: '户口所在地的民政局婚姻登记处',
    onlineFormFields: [
      '双方姓名',
      '双方身份证号',
      '双方户籍地址',
      '双方联系电话',
      '预约登记日期',
      '是否有特殊情况说明'
    ]
  },
  {
    id: '4',
    title: '社保卡办理',
    description: '社会保障卡申领服务',
    icon: '💳',
    category: '社保服务',
    estimatedTime: '15-20个工作日',
    requiredDocuments: ['身份证', '照片'],
    process: [
      '1. 前往社保服务中心或银行网点',
      '2. 填写《社会保障卡申领表》',
      '3. 提交身份证和照片',
      '4. 等待制卡',
      '5. 领取社保卡'
    ],
    materials: [
      '身份证原件及复印件',
      '近期1寸免冠彩色照片',
      '首次办理免费，补办需缴纳工本费'
    ],
    address: '各区县社保服务中心或指定银行网点',
    onlineFormFields: [
      '姓名',
      '身份证号',
      '联系电话',
      '家庭住址',
      '工作单位',
      '社保账号（如有）',
      '银行账号（如需关联）'
    ]
  },
  {
    id: '5',
    title: '营业执照办理',
    description: '工商营业执照申领服务',
    icon: '🏢',
    category: '工商服务',
    estimatedTime: '3-5个工作日',
    requiredDocuments: ['身份证', '场地证明', '公司章程'],
    process: [
      '1. 企业名称预先核准',
      '2. 提交工商注册申请材料',
      '3. 领取营业执照',
      '4. 刻制公章',
      '5. 办理税务登记',
      '6. 开立银行账户'
    ],
    materials: [
      '法定代表人身份证原件及复印件',
      '股东身份证原件及复印件',
      '公司章程',
      '场地使用证明（房产证或租赁合同）',
      '企业名称预先核准通知书'
    ],
    address: '各区县市场监督管理局或政务服务中心',
    onlineFormFields: [
      '企业名称',
      '企业类型',
      '注册资本',
      '经营范围',
      '法定代表人信息',
      '股东信息',
      '企业住所',
      '联系电话'
    ]
  }
];

interface AppStore extends AppState {
  // 用户相关
  login: (user: User) => void;
  logout: () => void;
  switchToGovernment: () => void;
  
  // 导航相关
  setCurrentTab: (tab: AppState['currentTab']) => void;
  
  // 搜索相关
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  // 位置相关
  setLocation: (location: AppState['location']) => void;
  
  // 模拟数据
  transactions: Transaction[];
  policies: Policy[];
  commonTransactions: CommonTransaction[];
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isLoggedIn: false,
      currentTab: 'home',
      searchHistory: [],
      location: null,
      
      // 模拟数据
      transactions: [
        {
          id: '1',
          title: '身份证办理',
          description: '新办身份证业务',
          status: 'processing',
          type: '身份证',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-16',
          location: '市民服务中心',
          estimatedTime: '5个工作日',
          requiredDocuments: ['户口本', '照片'],
          steps: [
            {
              id: '1-1',
              title: '提交申请',
              description: '携带相关证件到窗口提交申请',
              status: 'completed',
              order: 1,
              location: '市民服务中心1楼',
              estimatedTime: '30分钟',
              requiredDocuments: ['户口本', '照片']
            },
            {
              id: '1-2',
              title: '信息审核',
              description: '工作人员审核信息',
              status: 'current',
              order: 2,
              location: '市民服务中心2楼',
              estimatedTime: '2个工作日',
              requiredDocuments: []
            },
            {
              id: '1-3',
              title: '制证完成',
              description: '身份证制作完成，可领取',
              status: 'pending',
              order: 3,
              location: '市民服务中心1楼',
              estimatedTime: '3个工作日',
              requiredDocuments: ['领取凭证']
            }
          ]
        },
        {
          id: '2',
          title: '营业执照办理',
          description: '个体工商户营业执照申请',
          status: 'pending',
          type: '营业执照',
          createdAt: '2024-01-10',
          updatedAt: '2024-01-10',
          location: '市场监督管理局',
          estimatedTime: '10个工作日',
          requiredDocuments: ['身份证', '经营场所证明', '申请表'],
          steps: [
            {
              id: '2-1',
              title: '提交材料',
              description: '提交营业执照申请材料',
              status: 'completed',
              order: 1,
              location: '市场监督管理局窗口',
              estimatedTime: '1小时',
              requiredDocuments: ['身份证', '经营场所证明', '申请表']
            },
            {
              id: '2-2',
              title: '材料审核',
              description: '审核申请材料',
              status: 'current',
              order: 2,
              location: '市场监督管理局',
              estimatedTime: '5个工作日',
              requiredDocuments: []
            },
            {
              id: '2-3',
              title: '现场核查',
              description: '对经营场所进行现场核查',
              status: 'pending',
              order: 3,
              location: '经营场所',
              estimatedTime: '1个工作日',
              requiredDocuments: []
            },
            {
              id: '2-4',
              title: '审批通过',
              description: '审批通过，发放营业执照',
              status: 'pending',
              order: 4,
              location: '市场监督管理局窗口',
              estimatedTime: '3个工作日',
              requiredDocuments: ['领取凭证']
            }
          ]
        }
      ],
      
      policies: [
        {
          id: '1',
          title: '关于进一步优化营商环境的实施意见',
          summary: '为持续优化营商环境，激发市场活力，现就进一步优化营商环境提出如下实施意见...',
          content: '为持续优化营商环境，激发市场活力，现就进一步优化营商环境提出如下实施意见：\n\n一、总体要求\n以习近平新时代中国特色社会主义思想为指导，全面贯彻党的二十大精神...',
          category: '营商环境',
          publishDate: '2024-01-15',
          effectiveDate: '2024-02-01',
          location: '北京市',
          tags: ['营商环境', '政策解读', '新政策'],
          author: '市政府办公厅',
          isNew: true
        },
        {
          id: '2',
          title: '关于促进民营经济发展的若干措施',
          summary: '为促进民营经济健康发展，激发民营经济活力，制定以下措施...',
          content: '为促进民营经济健康发展，激发民营经济活力，制定以下措施：\n\n一、加大金融支持力度\n1. 设立民营企业发展专项资金...',
          category: '民营经济',
          publishDate: '2024-01-10',
          effectiveDate: '2024-01-15',
          location: '北京市',
          tags: ['民营经济', '金融支持', '政策解读'],
          author: '市发展改革委',
          isNew: false
        }
      ],
      
      commonTransactions: commonTransactions,
      
      // 用户相关方法
      login: (user: User) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      switchToGovernment: () => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, userType: 'government' as const }
          });
        }
      },
      
      // 导航相关方法
      setCurrentTab: (tab) => set({ currentTab: tab }),
      
      // 搜索相关方法
      addSearchHistory: (query: string) => {
        const history = get().searchHistory;
        const newHistory: SearchHistory = {
          id: Date.now().toString(),
          query,
          timestamp: new Date().toISOString()
        };
        set({ searchHistory: [newHistory, ...history.slice(0, 9)] });
      },
      clearSearchHistory: () => set({ searchHistory: [] }),
      
      // 位置相关方法
      setLocation: (location) => set({ location })
    }),
    {
      name: 'government-app-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        searchHistory: state.searchHistory,
        location: state.location
      })
    }
  )
); 