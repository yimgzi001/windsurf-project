import React from 'react';
import { Plus, Settings } from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string) => void;
  onAddCategory: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
  onAddCategory,
  onOpenSettings
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">提示词管理器</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-600">分类</h2>
            <button
              onClick={onAddCategory}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="添加分类"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  selectedCategoryId === category.id
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium truncate">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
        >
          <Settings size={16} />
          <span>设置</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
