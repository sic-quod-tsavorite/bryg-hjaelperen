import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
} from 'react';
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

interface ScrollContextValue {
  scrollViewRef: React.RefObject<ScrollView | null>;
  currentScrollY: React.MutableRefObject<number>;
  scrollBy: (amount: number, animated?: boolean) => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEnabled: boolean;
  setScrollEnabled: (enabled: boolean) => void;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({
  children,
}: {
  children: (
    scrollViewRef: React.RefObject<ScrollView | null>,
    handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void,
    scrollEnabled: boolean
  ) => React.ReactNode;
}) {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const currentScrollY = useRef(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      currentScrollY.current = event.nativeEvent.contentOffset.y;
    },
    []
  );

  const scrollBy = useCallback((amount: number, animated = true) => {
    const newY = currentScrollY.current + amount;
    scrollViewRef.current?.scrollTo({ y: newY, animated });
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        scrollViewRef,
        currentScrollY,
        scrollBy,
        handleScroll,
        scrollEnabled,
        setScrollEnabled,
      }}
    >
      {children(scrollViewRef, handleScroll, scrollEnabled)}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  return useContext(ScrollContext);
}
