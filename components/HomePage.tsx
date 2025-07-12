'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Clock, FileText } from 'lucide-react';
import { useAppStore } from '@/store';
import { useRouter } from 'next/navigation';
import { CommonTransaction } from '@/types';

export default function HomePage() {
  const { user, commonTransactions, addSearchHistory, searchHistory, setCurrentTab } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [searchResults, setSearchResults] = useState<CommonTransaction[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleSearch = (query: string) => {
    console.log('handleSearch called with query:', query);
    if (query.trim()) {
      addSearchHistory(query);
      // 模糊搜索事务
      const results = commonTransactions.filter(
        transaction => 
          transaction.title.toLowerCase().includes(query.toLowerCase()) || 
          transaction.description.toLowerCase().includes(query.toLowerCase()) ||
          transaction.category.toLowerCase().includes(query.toLowerCase())
      );
      console.log('Search results:', results);
      setSearchResults(results);
      setShowSearchHistory(false);
      if (results.length === 1) {
        console.log('Single result found, navigating to:', `/transaction/${results[0].id}`);
        setCurrentTab('transactions');
        router.push(`/transaction/${results[0].id}`);
        setShowResults(false);
      } else if (results.length > 1) {
        console.log('Multiple results found, showing dropdown');
        setShowResults(true);
      } else {
        console.log('No results found');
        setShowResults(true);
      }
    }
  };

  const handleCommonTransactionClick = (transaction: CommonTransaction) => {
    console.log('handleCommonTransactionClick called with transaction:', transaction);
    console.log('Navigating to:', `/transaction/${transaction.id}`);
    setCurrentTab('transactions');
    router.push(`/transaction/${transaction.id}`);
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSearchHistory(false);
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-0">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                您好，{user?.name}
              </h1>
              <p className="text-gray-600 text-sm">
                {user?.location.city} · {user?.location.district}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {user?.name?.charAt(0)}
              </span>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="relative search-container">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchHistory(true);
                  setShowResults(false);
                }}
                onFocus={() => {
                  setShowSearchHistory(true);
                  setShowResults(false);
                }}
                placeholder="搜索要办理的事务..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 搜索历史 */}
            {showSearchHistory && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                {searchHistory.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearch(item.query)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center"
                  >
                    <Search size={16} className="text-gray-400 mr-3" />
                    <span className="text-gray-700">{item.query}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 搜索结果 */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((transaction) => (
                    <button
                      key={transaction.id}
                      onClick={() => handleCommonTransactionClick(transaction)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{transaction.icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {transaction.title}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {transaction.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Clock size={12} className="mr-1" />
                            <span className="mr-3">{transaction.estimatedTime}</span>
                            <FileText size={12} className="mr-1" />
                            <span>{transaction.requiredDocuments.length}项材料</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    未找到相关事务
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 搜索按钮 */}
          <button
            onClick={() => handleSearch(searchQuery)}
            className="w-full mt-3 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>
        </div>
      </div>

      {/* 常见事务 */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">常见事务</h2>
        <div className="grid grid-cols-2 gap-4">
          {commonTransactions.map((transaction) => (
            <button
              key={transaction.id}
              onClick={() => handleCommonTransactionClick(transaction)}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{transaction.icon}</span>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {transaction.title}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {transaction.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>{transaction.estimatedTime}</span>
                </div>
                <div className="flex items-center">
                  <FileText size={12} className="mr-1" />
                  <span>{transaction.requiredDocuments.length}项材料</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 快速入口 */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">快速入口</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: '📋', label: '办事指南', color: 'bg-blue-100' },
            { icon: '📍', label: '附近网点', color: 'bg-green-100' },
            { icon: '📞', label: '在线咨询', color: 'bg-purple-100' },
            { icon: '📱', label: '进度查询', color: 'bg-orange-100' }
          ].map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${item.color}`}>
                <span className="text-xl">{item.icon}</span>
              </div>
              <span className="text-xs text-gray-700">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 最新动态 */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">最新动态</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 text-sm">📢</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">系统维护通知</h3>
                <p className="text-gray-600 text-xs mt-1">系统将于今晚22:00-24:00进行维护，期间部分功能可能无法使用</p>
                <span className="text-gray-400 text-xs">2小时前</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 text-sm">✅</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">新功能上线</h3>
                <p className="text-gray-600 text-xs mt-1">身份证办理在线预约功能已上线，支持提前预约办理时间</p>
                <span className="text-gray-400 text-xs">1天前</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-orange-600 text-sm">📋</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">政策更新</h3>
                <p className="text-gray-600 text-xs mt-1">《关于进一步优化营商环境的实施意见》已发布</p>
                <span className="text-gray-400 text-xs">3天前</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 便民服务 */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">便民服务</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 text-sm">🏥</span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">医疗健康</h3>
            </div>
            <p className="text-gray-600 text-xs">预约挂号、健康档案查询</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 text-sm">🎓</span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">教育服务</h3>
            </div>
            <p className="text-gray-600 text-xs">学籍查询、教育缴费</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 text-sm">🏠</span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">住房服务</h3>
            </div>
            <p className="text-gray-600 text-xs">房产查询、公积金服务</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-orange-600 text-sm">🚗</span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">交通出行</h3>
            </div>
            <p className="text-gray-600 text-xs">违章查询、公交查询</p>
          </div>
        </div>
      </div>

      {/* 底部间距 */}
      <div className="h-8"></div>
    </div>
  );
} 