'use client';

import { useAppStore } from '@/store';
import { Home, FileText, BookOpen, User } from 'lucide-react';

export default function BottomNavigation() {
  const { currentTab, setCurrentTab } = useAppStore();

  const navItems = [
    {
      id: 'home',
      label: '首页',
      icon: Home,
      active: currentTab === 'home'
    },
    {
      id: 'transactions',
      label: '事务',
      icon: FileText,
      active: currentTab === 'transactions'
    },
    {
      id: 'policies',
      label: '政策',
      icon: BookOpen,
      active: currentTab === 'policies'
    },
    {
      id: 'profile',
      label: '我的',
      icon: User,
      active: currentTab === 'profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id as any)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                item.active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
} 