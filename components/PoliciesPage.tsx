'use client';

import { useState } from 'react';
import { Calendar, MapPin, Tag, User, BookOpen } from 'lucide-react';
import { useAppStore } from '@/store';
import { Policy } from '@/types';

export default function PoliciesPage() {
  const { policies, user } = useAppStore();
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: '全部' },
    { id: '数字经济', label: '数字经济' },
    { id: '绿色发展', label: '绿色发展' },
    { id: '科技创新', label: '科技创新' },
    { id: '智慧城市', label: '智慧城市' }
  ];

  const filteredPolicies = filterCategory === 'all' 
    ? policies 
    : policies.filter(policy => policy.category === filterCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">政策解读</h1>
        <p className="text-gray-600">了解最新政策动态和解读</p>
      </div>

      {/* 分类筛选 */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilterCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* 政策列表 */}
      <div className="px-4 py-6">
        {filteredPolicies.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无相关政策</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.id}
                onClick={() => setSelectedPolicy(policy)}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm flex-1">
                        {policy.title}
                      </h3>
                      {policy.isNew && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                          新政策
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {policy.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    <span>{formatDate(policy.publishDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={12} className="mr-1" />
                    <span>{policy.location}</span>
                  </div>
                </div>

                <div className="flex items-center mt-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <User size={12} className="mr-1" />
                    <span>{policy.author}</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <Tag size={12} className="mr-1 text-gray-400" />
                    <span className="text-xs text-gray-500">{policy.category}</span>
                  </div>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {policy.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 政策详情模态框 */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedPolicy.title}
                </h2>
                <button
                  onClick={() => setSelectedPolicy(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* 基本信息 */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">发布机构：</span>
                    <span>{selectedPolicy.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">发布时间：</span>
                    <span>{formatDate(selectedPolicy.publishDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">生效时间：</span>
                    <span>{formatDate(selectedPolicy.effectiveDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">适用范围：</span>
                    <span>{selectedPolicy.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">政策分类：</span>
                    <span>{selectedPolicy.category}</span>
                  </div>
                </div>

                {/* 标签 */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">政策标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPolicy.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 政策内容 */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">政策内容</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-700 whitespace-pre-line">
                      {selectedPolicy.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 