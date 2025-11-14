import React, { useState } from 'react';
import { X, Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { PromptData } from '../types';
import { exportData, importData, mergeData } from '../utils/dataManager';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: PromptData;
  onDataUpdate: (newData: PromptData) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  data,
  onDataUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    try {
      exportData(data);
      setMessage({ type: 'success', text: '数据导出成功！' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '导出失败，请重试' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleImport = async (mergeMode: boolean = false) => {
    setIsLoading(true);
    try {
      const importedData = await importData();
      
      if (mergeMode) {
        // 合并模式：保留现有数据，添加导入的数据
        const mergedData = mergeData(data, importedData);
        onDataUpdate(mergedData);
        setMessage({ type: 'success', text: `成功导入 ${importedData.categories.length} 个分类和 ${importedData.prompts.length} 个提示词！` });
      } else {
        // 替换模式：完全替换现有数据
        if (window.confirm('此操作将覆盖所有现有数据，是否继续？')) {
          onDataUpdate(importedData);
          setMessage({ type: 'success', text: '数据导入成功！' });
        }
      }
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '导入失败' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">设置</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">数据管理</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">导出数据</h4>
                  <p className="text-sm text-gray-500">将所有分类和提示词导出为JSON文件</p>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  <span>导出</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">合并导入</h4>
                  <p className="text-sm text-gray-500">导入数据并与现有数据合并</p>
                </div>
                <button
                  onClick={() => handleImport(true)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Upload size={16} />
                  <span>{isLoading ? '导入中...' : '合并'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">替换导入</h4>
                  <p className="text-sm text-gray-500">导入数据并替换所有现有数据</p>
                </div>
                <button
                  onClick={() => handleImport(false)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Upload size={16} />
                  <span>{isLoading ? '导入中...' : '替换'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>• 所有数据都会自动保存到浏览器本地存储</p>
              <p>• 导出的文件包含所有分类和提示词数据</p>
              <p>• 合并导入会保留现有数据并添加新数据</p>
              <p>• 替换导入会完全覆盖现有数据</p>
              <p className="text-green-600 font-medium">• 当前数据：{data.categories.length} 个分类，{data.prompts.length} 个提示词</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
