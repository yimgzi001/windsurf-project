import { PromptData } from '../types';

export const exportData = (data: PromptData): void => {
  try {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-manager-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出数据失败:', error);
    alert('导出失败，请重试');
  }
};

export const importData = (): Promise<PromptData> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('未选择文件'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          // 验证数据格式
          if (validateImportData(data)) {
            resolve(data);
          } else {
            reject(new Error('文件格式不正确'));
          }
        } catch (error) {
          reject(new Error('文件解析失败，请检查文件格式'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };
      
      reader.readAsText(file);
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
};

const validateImportData = (data: any): data is PromptData => {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // 检查是否有必需的字段
  if (!Array.isArray(data.categories) || !Array.isArray(data.prompts)) {
    return false;
  }
  
  // 检查分类格式
  for (const category of data.categories) {
    if (!category.id || !category.name || !category.icon) {
      return false;
    }
  }
  
  // 检查提示词格式
  for (const prompt of data.prompts) {
    if (!prompt.id || !prompt.content || !prompt.categoryId) {
      return false;
    }
  }
  
  return true;
};

export const mergeData = (currentData: PromptData, importedData: PromptData): PromptData => {
  // 合并分类，避免重复
  const existingCategoryNames = new Set(currentData.categories.map(c => c.name));
  const newCategories = importedData.categories.filter(c => !existingCategoryNames.has(c.name));
  
  // 为新分类生成新的ID
  const categoryIdMap = new Map<string, string>();
  newCategories.forEach(category => {
    const newId = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    categoryIdMap.set(category.id, newId);
    category.id = newId;
  });
  
  // 更新导入的提示词的分类ID
  const updatedPrompts = importedData.prompts.map(prompt => ({
    ...prompt,
    id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    categoryId: categoryIdMap.get(prompt.categoryId) || prompt.categoryId
  }));
  
  return {
    categories: [...currentData.categories, ...newCategories],
    prompts: [...currentData.prompts, ...updatedPrompts]
  };
};
