import React, { useState } from 'react';
import { Copy, Plus, Edit3, Trash2, Check } from 'lucide-react';
import { Prompt, Category } from '../types';
import { copyToClipboard } from '../data';

interface PromptListProps {
  prompts: Prompt[];
  selectedCategory: Category | null;
  onAddPrompt: () => void;
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (promptId: string) => void;
}

const PromptList: React.FC<PromptListProps> = ({
  prompts,
  selectedCategory,
  onAddPrompt,
  onEditPrompt,
  onDeletePrompt
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (prompt: Prompt) => {
    const success = await copyToClipboard(prompt.content);
    if (success) {
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (!selectedCategory) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-medium text-gray-600 mb-2">欢迎使用提示词管理器</h2>
          <p className="text-gray-500">请选择左侧的分类来查看提示词</p>
        </div>
      </div>
    );
  }

  const categoryPrompts = prompts.filter(p => p.categoryId === selectedCategory.id);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedCategory.icon}</span>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{selectedCategory.name}</h2>
            <p className="text-sm text-gray-500">{categoryPrompts.length} 个提示词</p>
          </div>
        </div>
        <button
          onClick={onAddPrompt}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>添加提示词</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {categoryPrompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">暂无提示词</h3>
            <p className="text-gray-500 mb-4">点击上方"添加提示词"按钮来创建第一个提示词</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="group relative bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-200"
                onClick={() => handleCopy(prompt)}
              >
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(prompt);
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="复制提示词"
                  >
                    {copiedId === prompt.id ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPrompt(prompt);
                    }}
                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                    title="编辑提示词"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePrompt(prompt.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="删除提示词"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="text-sm text-gray-600 leading-relaxed line-clamp-4 pr-8">
                  {prompt.content}
                </div>
                
                {copiedId === prompt.id && (
                  <div className="absolute inset-0 bg-green-50 border-2 border-green-200 rounded-lg flex items-center justify-center">
                    <div className="text-green-600 font-medium text-sm">
                      ✓ 已复制到剪贴板
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptList;
