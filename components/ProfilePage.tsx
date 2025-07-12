'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Phone, 
  MapPin, 
  Settings, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Building,
  UserCheck
} from 'lucide-react';
import { useAppStore } from '@/store';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, switchToGovernment } = useAppStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSwitchToGovernment = () => {
    switchToGovernment();
    // 可以添加一些提示信息
    alert('已切换到政务人员模式');
  };

  const menuItems = [
    {
      icon: Settings,
      label: '设置',
      description: '账户设置、通知设置等',
      action: () => console.log('打开设置')
    },
    {
      icon: Shield,
      label: '隐私安全',
      description: '隐私设置、安全设置',
      action: () => console.log('打开隐私设置')
    },
    {
      icon: HelpCircle,
      label: '帮助中心',
      description: '常见问题、联系客服',
      action: () => console.log('打开帮助中心')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 用户信息卡片 */}
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-blue-600 font-semibold text-xl">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {user?.name}
            </h1>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <User size={14} className="mr-1" />
              <span>
                {user?.userType === 'government' ? '政务人员' : '普通用户'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={14} className="mr-1" />
              <span>{user?.location.city} · {user?.location.district}</span>
            </div>
          </div>
        </div>

        {/* 用户详细信息 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <Phone size={16} className="text-gray-400 mr-3" />
              <span className="text-gray-700">手机号码</span>
            </div>
            <span className="text-gray-900">{user?.phone}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <User size={16} className="text-gray-400 mr-3" />
              <span className="text-gray-700">身份证号</span>
            </div>
            <span className="text-gray-900">{user?.idCard}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <MapPin size={16} className="text-gray-400 mr-3" />
              <span className="text-gray-700">所在地区</span>
            </div>
            <span className="text-gray-900">
              {user?.location.province} {user?.location.city} {user?.location.district}
            </span>
          </div>
        </div>
      </div>

      {/* 功能菜单 */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-4 ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                } hover:bg-gray-50 transition-colors`}
              >
                <div className="flex items-center">
                  <Icon size={20} className="text-gray-400 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 特殊功能 */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* 切换政务人员模式 */}
          {user?.userType === 'normal' && (
            <button
              onClick={handleSwitchToGovernment}
              className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Building size={20} className="text-blue-500 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">切换为政务人员</div>
                  <div className="text-sm text-gray-500">切换到政务人员登录模式</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          )}

          {/* 当前模式显示 */}
          {user?.userType === 'government' && (
            <div className="w-full flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <UserCheck size={20} className="text-green-500 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">政务人员模式</div>
                  <div className="text-sm text-gray-500">当前为政务人员登录模式</div>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                已激活
              </span>
            </div>
          )}

          {/* 退出登录 */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <LogOut size={20} className="text-red-500 mr-3" />
              <div className="text-left">
                <div className="font-medium text-red-600">退出登录</div>
                <div className="text-sm text-gray-500">退出当前账户</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* 退出确认模态框 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              确认退出
            </h3>
            <p className="text-gray-600 mb-6">
              确定要退出登录吗？退出后需要重新登录。
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部间距 */}
      <div className="h-32"></div>
    </div>
  );
} 