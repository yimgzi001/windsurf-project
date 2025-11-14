import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import PromptList from './components/PromptList';
import PromptModal from './components/PromptModal';
import CategoryModal from './components/CategoryModal';
import SettingsPanel from './components/SettingsPanel';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import { Prompt, Category, PromptData } from './types';
import { loadData, saveData } from './data';

const App: React.FC = () => {
  const [data, setData] = useState<PromptData>({ categories: [], prompts: [] });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadedData = loadData();
    setData(loadedData);
    if (loadedData.categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(loadedData.categories[0].id);
    }
    setIsInitialLoad(false);
  }, []);

  // 自动保存功能 - 只在非初始加载时保存
  useEffect(() => {
    if (!isInitialLoad) {
      saveData(data);
    }
  }, [data, isInitialLoad]);

  const selectedCategory = data.categories.find(c => c.id === selectedCategoryId) || null;

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleAddPrompt = () => {
    setEditingPrompt(null);
    setIsPromptModalOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsPromptModalOpen(true);
  };

  const handleSavePrompt = (promptData: Omit<Prompt, 'id'>) => {
    if (editingPrompt) {
      // 编辑现有提示词
      setData(prev => ({
        ...prev,
        prompts: prev.prompts.map(p => 
          p.id === editingPrompt.id 
            ? { ...promptData, id: editingPrompt.id }
            : p
        )
      }));
    } else {
      // 添加新提示词
      const newPrompt: Prompt = {
        ...promptData,
        id: Date.now().toString()
      };
      setData(prev => ({
        ...prev,
        prompts: [...prev.prompts, newPrompt]
      }));
    }
    setIsPromptModalOpen(false);
    setEditingPrompt(null);
  };

  const handleDeletePrompt = (promptId: string) => {
    if (window.confirm('确定要删除这个提示词吗？')) {
      setData(prev => ({
        ...prev,
        prompts: prev.prompts.filter(p => p.id !== promptId)
      }));
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = data.categories.find(c => c.id === categoryId);
    if (!category) return;

    const promptCount = data.prompts.filter(p => p.categoryId === categoryId).length;
    const confirmMessage = promptCount > 0 
      ? `确定要删除分类 "${category.name}" 吗？\n\n注意：该分类下有 ${promptCount} 个提示词，删除分类后这些提示词也将被删除。`
      : `确定要删除分类 "${category.name}" 吗？`;

    if (window.confirm(confirmMessage)) {
      setData(prev => ({
        categories: prev.categories.filter(c => c.id !== categoryId),
        prompts: prev.prompts.filter(p => p.categoryId !== categoryId)
      }));
      
      // 如果删除的是当前选中的分类，切换到第一个分类
      if (selectedCategoryId === categoryId) {
        const remainingCategories = data.categories.filter(c => c.id !== categoryId);
        setSelectedCategoryId(remainingCategories[0]?.id || null);
      }
    }
  };

  const handleSaveCategory = (name: string, icon: string) => {
    if (editingCategory) {
      // 编辑现有分类
      setData(prev => ({
        ...prev,
        categories: prev.categories.map(c => 
          c.id === editingCategory.id 
            ? { ...c, name, icon }
            : c
        )
      }));
    } else {
      // 添加新分类
      const newCategory: Category = {
        id: Date.now().toString(),
        name,
        icon
      };
      setData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
      // 自动选择新添加的分类
      setSelectedCategoryId(newCategory.id);
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleOpenSettings = () => {
    setIsSettingsPanelOpen(true);
  };

  const handleDataUpdate = (newData: PromptData) => {
    setData(newData);
    // 如果当前选中的分类不存在了，选择第一个分类
    if (selectedCategoryId && !newData.categories.find(c => c.id === selectedCategoryId)) {
      setSelectedCategoryId(newData.categories[0]?.id || null);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar
        categories={data.categories}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={handleCategorySelect}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onOpenSettings={handleOpenSettings}
      />
      
      <PromptList
        prompts={data.prompts}
        selectedCategory={selectedCategory}
        onAddPrompt={handleAddPrompt}
        onEditPrompt={handleEditPrompt}
        onDeletePrompt={handleDeletePrompt}
      />

      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => {
          setIsPromptModalOpen(false);
          setEditingPrompt(null);
        }}
        onSave={handleSavePrompt}
        categories={data.categories}
        editingPrompt={editingPrompt}
        selectedCategoryId={selectedCategoryId || undefined}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />

      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        data={data}
        onDataUpdate={handleDataUpdate}
      />

      <AutoSaveIndicator 
        data={data} 
        isInitialLoad={isInitialLoad}
      />
    </div>
  );
};

export default App;
