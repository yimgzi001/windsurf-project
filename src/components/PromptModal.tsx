import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Prompt, Category } from '../types';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Omit<Prompt, 'id'>) => void;
  categories: Category[];
  editingPrompt?: Prompt | null;
  selectedCategoryId?: string;
}

const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  editingPrompt,
  selectedCategoryId
}) => {
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingPrompt) {
        setContent(editingPrompt.content);
        setCategoryId(editingPrompt.categoryId);
      } else {
        setContent('');
        setCategoryId(selectedCategoryId || (categories[0]?.id ?? ''));
      }
    }
  }, [isOpen, editingPrompt, selectedCategoryId, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && categoryId) {
      onSave({
        content: content.trim(),
        categoryId
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingPrompt ? '编辑提示词' : '添加提示词'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="p-6 space-y-4 flex-1">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                分类 *
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                提示词内容 *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="请输入提示词内容，可以使用 [参数] 来标记需要替换的部分"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!content.trim() || !categoryId}
            >
              {editingPrompt ? '保存修改' : '添加提示词'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptModal;
