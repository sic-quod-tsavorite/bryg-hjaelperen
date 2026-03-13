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
  status?: 'default' | 'warning' | 'error';
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
  status = 'default',
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

  // Determine colors based on status
  let textColorClass = 'text-text-primary dark:text-text-primary-dark';
  let borderClass = 'border-border dark:border-border-dark';

  if (status === 'warning') {
    textColorClass = 'text-warning';
    borderClass = 'border-warning';
  } else if (status === 'error') {
    textColorClass = 'text-error';
    borderClass = 'border-error';
  }

  return (
    <View className={`${className}`}>
      <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        {label}
      </Text>
      <View className="relative">
        <TextInput
          className={`rounded-lg border bg-surface-elevated py-3 ${textColorClass} ${borderClass} dark:bg-surface-elevated-dark ${unit ? 'pl-3 pr-10' : 'px-4'}`}
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
          <Text className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
            {unit}
          </Text>
        )}
      </View>
    </View>
  );
}
