import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface AutoSaveIndicatorProps {
  data: any;
  isInitialLoad: boolean;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ data, isInitialLoad }) => {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!isInitialLoad) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [data, isInitialLoad]);

  if (isInitialLoad || !showSaved) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in">
      <Check size={16} />
      <span className="text-sm font-medium">已自动保存</span>
    </div>
  );
};

export default AutoSaveIndicator;
