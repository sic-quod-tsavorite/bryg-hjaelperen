import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView as RNScrollView,
  Keyboard,
  Platform,
} from 'react-native';
import {
  RectButton,
  GestureHandlerRootView,
  ScrollView as GHScrollView,
} from 'react-native-gesture-handler';

import { useScrollContext } from '../../contexts/ScrollContext';

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
  sectionRef?: React.RefObject<View | null>;
}

export function AutocompleteInput<T extends AutocompleteItem>({
  label,
  value,
  onChange,
  onSelect,
  items,
  placeholder,
  renderItem,
  sectionRef,
}: AutocompleteInputProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [_keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const containerRef = useRef<View>(null);
  const isSelectingRef = useRef(false);
  const scrollContext = useScrollContext();

  // Filter items based on input
  const filteredItems = items.filter((item) =>
    item.navn.toLowerCase().includes(value.toLowerCase())
  );

  // Whether dropdown is currently visible
  const isDropdownVisible = showDropdown && filteredItems.length > 0;

  // Reset highlighted index when filtered items change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [value]);

  // Track keyboard height
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Scroll to position the section (or input) at the top of visible area
  const scrollToShowInput = useCallback(() => {
    if (!scrollContext || Platform.OS === 'web') return;

    const targetRef = sectionRef?.current ?? containerRef.current;
    if (!targetRef) return;

    targetRef.measureInWindow((x, y) => {
      // Scroll so the section/label is near the top (with padding for header/status bar)
      const desiredTopOffset = 100;
      if (y > desiredTopOffset) {
        const scrollAmount = y - desiredTopOffset;
        scrollContext.scrollBy(scrollAmount);
      }
    });
  }, [scrollContext, sectionRef]);

  // Show dropdown when focused and has matching items
  useEffect(() => {
    if (isFocused && filteredItems.length > 0) {
      setShowDropdown(true);
    } else if (!isFocused) {
      // Delay hiding to allow item selection
      const timeout = setTimeout(() => {
        if (!isSelectingRef.current) {
          setShowDropdown(false);
        }
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [isFocused, filteredItems.length]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (Platform.OS !== 'web') {
      // Small delay to allow layout to settle
      setTimeout(() => scrollToShowInput(), 50);
    }
  }, [scrollToShowInput]);

  const handleSelect = useCallback(
    (item: T) => {
      isSelectingRef.current = false;
      onSelect(item);
      onChange('');
      setShowDropdown(false);
      setHighlightedIndex(-1);
      Keyboard.dismiss();
    },
    [onSelect, onChange]
  );

  const handlePressIn = useCallback(() => {
    // Mark that we're selecting to prevent blur from closing dropdown
    isSelectingRef.current = true;
  }, []);

  const handlePressOut = useCallback(() => {
    // Reset after a delay to allow onPress to fire first
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
  }, []);

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
    <View ref={containerRef} className="relative z-50">
      <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        {label}
      </Text>
      <View
        className={`flex-row items-center border bg-surface-elevated dark:bg-surface-elevated-dark ${
          isDropdownVisible ? 'rounded-t-lg' : 'rounded-lg'
        } ${
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
          onFocus={handleFocus}
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

      {showDropdown &&
        filteredItems.length > 0 &&
        Platform.OS === 'android' && (
          <GestureHandlerRootView
            className="absolute left-0 right-0 top-[72px] z-50 rounded-b-lg border border-t-0 border-border bg-white shadow-lg dark:border-border-dark dark:bg-surface-elevated-dark"
            style={{ maxHeight: 192 }}
          >
            <GHScrollView
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled={true}
              className="rounded-b-lg border border-t-0 border-primary bg-white dark:border-primary-light dark:bg-surface-elevated-dark"
            >
              {filteredItems.map((item) => (
                <RectButton
                  key={item.id}
                  onPress={() => handleSelect(item)}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#e5e5e5',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  {renderItem ? (
                    renderItem(item)
                  ) : (
                    <Text className="text-text-primary dark:text-text-primary-dark">
                      {item.navn}
                    </Text>
                  )}
                </RectButton>
              ))}
            </GHScrollView>
          </GestureHandlerRootView>
        )}

      {showDropdown &&
        filteredItems.length > 0 &&
        Platform.OS !== 'android' && (
          <View className="absolute left-0 right-0 top-[72px] z-50 rounded-b-lg border border-t-0 border-primary bg-white shadow-lg dark:border-primary-light dark:bg-surface-elevated-dark">
            <RNScrollView
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled={true}
              style={{ maxHeight: 192 }}
            >
              {filteredItems.map((item, index) => (
                <Pressable
                  key={item.id}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => handleSelect(item)}
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
                </Pressable>
              ))}
            </RNScrollView>
          </View>
        )}
    </View>
  );
}
