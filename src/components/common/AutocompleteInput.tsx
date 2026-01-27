import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';

interface AutocompleteItem {
  id: string;
  navn: string;
}

interface AutocompleteInputProps<T extends AutocompleteItem> {
  label: string;
  value: string;
  onChange: (text: string) => void;
  onSelect: (item: T) => void;
  items: T[];
  placeholder?: string;
  renderItem?: (item: T) => React.ReactNode;
}

export function AutocompleteInput<T extends AutocompleteItem>({
  label,
  value,
  onChange,
  onSelect,
  items,
  placeholder,
  renderItem,
}: AutocompleteInputProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<TextInput>(null);

  // Filter items based on input
  const filteredItems = items.filter((item) =>
    item.navn.toLowerCase().includes(value.toLowerCase())
  );

  // Reset highlighted index when filtered items change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [value]);

  // Show dropdown when focused and has matching items
  useEffect(() => {
    if (isFocused && filteredItems.length > 0) {
      setShowDropdown(true);
    } else if (!isFocused) {
      // Delay hiding to allow item selection
      const timeout = setTimeout(() => setShowDropdown(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [isFocused, filteredItems.length]);

  const handleSelect = useCallback(
    (item: T) => {
      onSelect(item);
      onChange('');
      setShowDropdown(false);
      setHighlightedIndex(-1);
      Keyboard.dismiss();
    },
    [onSelect, onChange]
  );

  const handleClear = () => {
    onChange('');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Store refs for use in event handler
  const showDropdownRef = useRef(showDropdown);
  const filteredItemsRef = useRef(filteredItems);
  const highlightedIndexRef = useRef(highlightedIndex);

  useEffect(() => {
    showDropdownRef.current = showDropdown;
  }, [showDropdown]);

  useEffect(() => {
    filteredItemsRef.current = filteredItems;
  }, [filteredItems]);

  useEffect(() => {
    highlightedIndexRef.current = highlightedIndex;
  }, [highlightedIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showDropdownRef.current || filteredItemsRef.current.length === 0)
        return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredItemsRef.current.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItemsRef.current.length - 1
        );
      } else if (e.key === 'Enter') {
        const idx = highlightedIndexRef.current;
        if (idx >= 0 && idx < filteredItemsRef.current.length) {
          e.preventDefault();
          handleSelect(filteredItemsRef.current[idx]);
        }
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    },
    [handleSelect]
  );

  // Attach keyboard event listener directly to the input element on web
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const input = inputRef.current as unknown as HTMLInputElement | null;
    if (!input) return;

    input.addEventListener('keydown', handleKeyDown);
    return () => {
      input.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <View className="relative z-50">
      <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        {label}
      </Text>
      <View
        className={`flex-row items-center rounded-lg border bg-surface-elevated dark:bg-surface-elevated-dark ${
          isFocused
            ? 'border-primary dark:border-primary-light'
            : 'border-border dark:border-border-dark'
        }`}
      >
        <TextInput
          ref={inputRef}
          className="flex-1 px-4 py-3 text-text-primary dark:text-text-primary-dark"
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor="#a3a3a3"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} className="px-3">
            <Ionicons name="close-circle" size={20} color="#a3a3a3" />
          </TouchableOpacity>
        )}
      </View>

      {showDropdown && filteredItems.length > 0 && (
        <View className="absolute left-0 right-0 top-[72px] z-50 max-h-48 rounded-lg border border-border bg-surface-elevated shadow-lg dark:border-border-dark dark:bg-surface-elevated-dark">
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
                className={`border-b border-border-subtle px-4 py-3 dark:border-border-subtle-dark ${
                  index === highlightedIndex
                    ? 'bg-primary-subtle dark:bg-surface-dark'
                    : ''
                }`}
              >
                {renderItem ? (
                  renderItem(item)
                ) : (
                  <Text className="text-text-primary dark:text-text-primary-dark">
                    {item.navn}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
