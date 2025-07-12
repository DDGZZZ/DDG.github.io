'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, FileText, MapPin, Clipboard, ListChecks } from 'lucide-react';
import { commonTransactions } from '@/store';
import { CommonTransaction } from '@/types';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<CommonTransaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundTransaction = commonTransactions.find(t => t.id === id);
      
      if (foundTransaction) {
        setTransaction(foundTransaction);
      }
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen p-4">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-blue-600 mb-6"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>返回</span>
        </button>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-700 mb-2">未找到事务</h1>
          <p className="text-gray-500">该事务不存在或已被删除</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 头部 */}
      <div className="bg-white shadow-sm p-4">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-blue-600 mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>返回</span>
        </button>
        <div className="flex items-start">
          <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center text-3xl mr-4">
            {transaction.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{transaction.title}</h1>
            <p className="text-gray-600 mt-1">{transaction.description}</p>
            <div className="flex flex-wrap items-center mt-3 text-sm text-gray-500">
              <div className="flex items-center mr-4 mb-2">
                <Clock size={16} className="mr-1" />
                <span>{transaction.estimatedTime}</span>
              </div>
              <div className="flex items-center mr-4 mb-2">
                <MapPin size={16} className="mr-1" />
                <span>{transaction.address}</span>
              </div>
              <div className="flex items-center mb-2">
                <FileText size={16} className="mr-1" />
                <span>{transaction.requiredDocuments.length}项材料</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 详情内容 */}
      <div className="px-4 py-6">
        {/* 办理流程 */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-5">
          <div className="flex items-center mb-4">
            <ListChecks size={20} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">办理流程</h2>
          </div>
          <div className="pl-2">
            {transaction.process.map((step, index) => (
              <div key={index} className="relative pl-8 pb-5 last:pb-0">
                <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  {index < transaction.process.length - 1 && (
                    <div className="w-0.5 bg-blue-100 flex-grow mt-1"></div>
                  )}
                </div>
                <div className="text-gray-700">{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 所需材料 */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-5">
          <div className="flex items-center mb-4">
            <FileText size={20} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">所需材料</h2>
          </div>
          <ul className="pl-2">
            {transaction.materials.map((material, index) => (
              <li key={index} className="flex items-start mb-3 last:mb-0">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-gray-700">{material}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 办理地址 */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-5">
          <div className="flex items-center mb-4">
            <MapPin size={20} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">办理地址</h2>
          </div>
          <div className="pl-2 text-gray-700">
            {transaction.address}
          </div>
        </div>

        {/* 网上需要填写的信息 */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center mb-4">
            <Clipboard size={20} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">网上需要填写的信息</h2>
          </div>
          <ul className="pl-2">
            {transaction.onlineFormFields.map((field, index) => (
              <li key={index} className="flex items-start mb-3 last:mb-0">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-gray-700">{field}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex">
        <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg mr-3 font-medium">
          收藏
        </button>
        <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium">
          在线办理
        </button>
      </div>

      {/* 底部间距 */}
      <div className="h-32"></div>
    </div>
  );
} 