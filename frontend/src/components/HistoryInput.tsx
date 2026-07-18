import React, { useState, useEffect } from 'react';

interface HistoryInputProps {
  storageKey: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export function HistoryInput({ storageKey, value, onChange, onBlur, ...props }: HistoryInputProps) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`iqassess_history_${storageKey}`);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history for", storageKey, e);
    }
  }, [storageKey]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (val) {
      setHistory(prev => {
        const next = [val, ...prev.filter(i => i !== val)].slice(0, 10);
        try {
          localStorage.setItem(`iqassess_history_${storageKey}`, JSON.stringify(next));
        } catch (err) {}
        return next;
      });
    }
    if (onBlur) onBlur(e);
  };

  const listId = `list-${storageKey}`;

  return (
    <>
      <input 
        list={listId} 
        value={value} 
        onChange={onChange} 
        onBlur={handleBlur} 
        {...props} 
      />
      <datalist id={listId}>
        {history.map((item, idx) => (
          <option key={idx} value={item} />
        ))}
      </datalist>
    </>
  );
}
