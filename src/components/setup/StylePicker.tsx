import { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';

import { BEER_STYLES, type BeerStyle } from '../../types/ingredients';

interface StylePickerProps {
  value: BeerStyle | null;
  onChange: (style: BeerStyle) => void;
  isDark?: boolean;
}

export function StylePicker({
  value,
  onChange,
  isDark = false,
}: StylePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const buttonRef = useRef<View>(null);

  const selectedStyle = BEER_STYLES.find((s) => s.id === value);

  const handleSelect = (styleId: BeerStyle) => {
    onChange(styleId);
    setIsOpen(false);
  };

  const measureButton = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPosition({
        top: y + height + 4,
        left: x,
        width: width,
      });
    });
  };

  useEffect(() => {
    if (isOpen) {
      measureButton();
    }
  }, [isOpen]);

  return (
    <View>
      <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        Øltype
      </Text>
      <View ref={buttonRef} collapsable={false}>
        <Pressable
          onPress={() => setIsOpen(true)}
          className={`flex-row items-center justify-between rounded-lg border px-4 py-3 ${
            isDark
              ? 'border-border-dark bg-surface-elevated-dark'
              : 'border-border bg-surface-elevated'
          }`}
        >
          <Text
            className={
              selectedStyle
                ? isDark
                  ? 'text-text-primary-dark'
                  : 'text-text-primary'
                : isDark
                  ? 'text-text-tertiary-dark'
                  : 'text-text-tertiary'
            }
          >
            {selectedStyle ? selectedStyle.navn : 'Vælg øltype'}
          </Text>
          <Text
            className={
              isDark ? 'text-text-secondary-dark' : 'text-text-secondary'
            }
          >
            ▼
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable className="flex-1" onPress={() => setIsOpen(false)}>
          <View
            style={{
              position: 'absolute',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              maxHeight: 300,
            }}
            className={`rounded-lg border shadow-lg ${
              isDark
                ? 'border-border-dark bg-surface-elevated-dark'
                : 'border-border bg-surface-elevated'
            }`}
          >
            <ScrollView>
              {BEER_STYLES.map((style) => (
                <Pressable
                  key={style.id}
                  onPress={() => handleSelect(style.id)}
                  className={`px-4 py-3 ${
                    value === style.id
                      ? isDark
                        ? 'bg-primary-subtle-dark'
                        : 'bg-primary-subtle'
                      : ''
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      value === style.id
                        ? isDark
                          ? 'text-primary-dark'
                          : 'text-primary'
                        : isDark
                          ? 'text-text-primary-dark'
                          : 'text-text-primary'
                    }`}
                  >
                    {style.navn}
                  </Text>
                  <Text
                    className={`text-sm ${
                      isDark
                        ? 'text-text-secondary-dark'
                        : 'text-text-secondary'
                    }`}
                  >
                    {style.beskrivelse}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
