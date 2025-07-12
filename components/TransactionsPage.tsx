'use client';

import { useState } from 'react';
import { Clock, MapPin, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useAppStore } from '@/store';
import { Transaction } from '@/types';

export default function TransactionsPage() {
  const { transactions } = useAppStore();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'processing':
        return <Clock size={16} />;
      case 'pending':
        return <AlertCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'processing':
        return '办理中';
      case 'pending':
        return '待处理';
      case 'rejected':
        return '已拒绝';
      default:
        return '未知状态';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">我的事务</h1>
        <p className="text-gray-600">查看您正在办理的事务进度</p>
      </div>

      {/* 事务列表 */}
      <div className="px-4 py-6">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无正在办理的事务</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => setSelectedTransaction(transaction)}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {transaction.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {transaction.description}
                    </p>
                  </div>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {getStatusIcon(transaction.status)}
                    <span className="ml-1">{getStatusText(transaction.status)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span>{transaction.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{transaction.estimatedTime}</span>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>办理进度</span>
                    <span>
                      {transaction.steps.filter(step => step.status === 'completed').length}/
                      {transaction.steps.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(transaction.steps.filter(step => step.status === 'completed').length / transaction.steps.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 事务详情模态框 */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTransaction.title}
                </h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">基本信息</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">状态：</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                        {getStatusText(selectedTransaction.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">办理地点：</span>
                      <span>{selectedTransaction.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">预计时间：</span>
                      <span>{selectedTransaction.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">办理步骤</h3>
                  <div className="space-y-3">
                    {selectedTransaction.steps.map((step, index) => (
                      <div key={step.id} className="flex items-start">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                          step.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : step.status === 'current'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {step.status === 'completed' ? '✓' : index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {step.title}
                          </h4>
                          <p className="text-gray-600 text-xs mt-1">
                            {step.description}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <MapPin size={12} className="mr-1" />
                            <span className="mr-4">{step.location}</span>
                            <Clock size={12} className="mr-1" />
                            <span>{step.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">所需材料</h3>
                  <div className="space-y-1">
                    {selectedTransaction.requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <FileText size={14} className="text-gray-400 mr-2" />
                        <span>{doc}</span>
                      </div>
                    ))}
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