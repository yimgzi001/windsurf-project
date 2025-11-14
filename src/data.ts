import { PromptData } from './types';

export const initialData: PromptData = {
  categories: [
    { id: '1', name: '写作助手', icon: '✍️' },
    { id: '2', name: '编程开发', icon: '💻' },
    { id: '3', name: '创意设计', icon: '🎨' },
    { id: '4', name: '商务办公', icon: '💼' },
    { id: '5', name: '学习教育', icon: '📚' },
  ],
  prompts: [
    {
      id: '1',
      content: '请帮我写一篇关于[主题]的文章，要求结构清晰，语言流畅，字数控制在[字数]字左右。',
      categoryId: '1'
    },
    {
      id: '2',
      content: '请帮我写一封关于[事项]的邮件，收件人是[收件人]，语气要[正式/友好]。',
      categoryId: '1'
    },
    {
      id: '3',
      content: '请帮我审查以下代码，指出潜在问题并提供改进建议：\n[代码内容]',
      categoryId: '2'
    },
    {
      id: '4',
      content: '请帮我实现一个[功能描述]的功能，使用[编程语言]，要求[具体要求]。',
      categoryId: '2'
    },
    {
      id: '5',
      content: '请为[项目类型]设计一个[页面/组件]的UI界面，风格要求[设计风格]，目标用户是[用户群体]。',
      categoryId: '3'
    },
    {
      id: '6',
      content: '请帮我整理以下会议内容为规范的会议纪要：\n会议时间：[时间]\n参会人员：[人员]\n会议内容：[内容]',
      categoryId: '4'
    },
    {
      id: '7',
      content: '请详细解释[知识点/概念]，包括定义、原理、应用场景和相关例子，要求通俗易懂。',
      categoryId: '5'
    }
  ]
};

const STORAGE_KEY = 'prompt-manager-data';

export const loadData = (): PromptData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  } catch {
    return initialData;
  }
};

export const saveData = (data: PromptData): void => {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, jsonData);
    console.log('数据已自动保存到localStorage', {
      categories: data.categories.length,
      prompts: data.prompts.length
    });
  } catch (error) {
    console.error('Failed to save data:', error);
    alert('数据保存失败，请检查浏览器存储空间');
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
};
