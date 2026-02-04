import { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';

interface NumberInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  decimals?: number;
  className?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  unit,
  placeholder,
  min,
  max,
  decimals: _decimals = 0,
  className = '',
}: NumberInputProps) {
  const [localText, setLocalText] = useState(
    value !== null ? value.toString() : ''
  );
  const [isFocused, setIsFocused] = useState(false);

  // Sync local text from prop when not focused (external changes)
  useEffect(() => {
    if (!isFocused) {
      setLocalText(value !== null ? value.toString() : '');
    }
  }, [value, isFocused]);

  const handleChange = (text: string) => {
    if (text === '') {
      setLocalText('');
      onChange(null);
      return;
    }

    // Allow decimal input
    const cleanText = text.replace(',', '.');

    // Check if valid number format
    if (!/^-?\d*\.?\d*$/.test(cleanText)) {
      return;
    }

    // Always update local text to preserve intermediate states like "1." or "1.0"
    setLocalText(cleanText);

    const num = parseFloat(cleanText);

    if (isNaN(num)) {
      return;
    }

    // Validate range
    if (min !== undefined && num < min) return;
    if (max !== undefined && num > max) return;

    onChange(num);
  };

  return (
    <View className={`${className}`}>
      <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        {label}
      </Text>
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 rounded-lg border border-border bg-surface-elevated px-4 py-3 text-text-primary dark:border-border-dark dark:bg-surface-elevated-dark dark:text-text-primary-dark"
          value={localText}
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor="#a3a3a3"
          keyboardType="decimal-pad"
          inputMode="decimal"
        />
        {unit && (
          <Text className="ml-3 min-w-[32px] text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
            {unit}
          </Text>
        )}
      </View>
    </View>
  );
}
