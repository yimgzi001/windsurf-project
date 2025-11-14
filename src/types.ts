export interface Prompt {
  id: string;
  content: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface PromptData {
  categories: Category[];
  prompts: Prompt[];
}
