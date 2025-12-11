# TOUCH Framework

> **Universal Mobile-Native Web Transformation Framework**
> Transform web applications into mobile-native experiences that feel indistinguishable from native iOS/Android apps.

## What is TOUCH?

**T**ouch-**O**ptimized **U**niversal **C**omponent **H**andbook

A comprehensive implementation framework for transforming standard responsive websites into mobile-native experiences with touch-first interactions, gesture navigation, haptic feedback, and platform-specific behavioral patterns.

## Mission

Transform a standard responsive website into a mobile-native experience that feels indistinguishable from a native iOS app (with automatic Android Material Design adaptation), implementing touch-first interactions, gesture navigation, haptic feedback, and platform-specific behavioral patterns.

## When to Use TOUCH

✅ **Use TOUCH for:**
- Building new mobile-first web applications
- Transforming existing responsive sites into mobile-native experiences
- Implementing touch-optimized interactions
- Creating PWA experiences that feel native
- Optimizing for iOS Safari and Android Chrome
- Adding gesture navigation and haptic feedback
- Platform-specific UI adaptations (iOS vs Android)

❌ **Skip TOUCH for:**
- Desktop-only applications
- Simple static websites
- Projects without mobile users
- Native app development (use native frameworks)

---

## PART 1: MOBILE EXPERIENCE AUDIT

### 1. Current State Assessment

Evaluate existing mobile experience across 8 key dimensions:

**1. Touch Target Sizes**
- [ ] Minimum 44x44px (iOS) / 48x48dp (Android)
- [ ] All interactive elements meet touch target requirements
- [ ] Spacing between targets ≥ 8px

**2. Mouse-First Patterns**
- [ ] Identify hover states requiring touch equivalents
- [ ] Map click interactions needing tap optimization
- [ ] Find drag interactions requiring pan gestures

**3. Hover State Adaptation**
- [ ] Convert hover effects to touch feedback
- [ ] Add active/pressed states for touch
- [ ] Implement long-press alternatives where needed

**4. Gesture Support**
- [ ] Map swipe actions needed
- [ ] Identify pinch-to-zoom requirements
- [ ] Plan drag-and-drop interactions

**5. Scroll Performance**
- [ ] Test scroll momentum behavior
- [ ] Verify smooth 60fps scrolling
- [ ] Check pull-to-refresh implementation

**6. Form Input Optimization**
- [ ] Mobile keyboard type selection
- [ ] Input mode attributes set correctly
- [ ] Prevent zoom on focus (16px minimum font)
- [ ] Auto-advance patterns for multi-field forms

**7. Viewport & Safe Areas**
- [ ] Viewport meta tag configured
- [ ] Safe area insets handled (notch, home indicator)
- [ ] Keyboard appearance handled gracefully

**8. Animation Performance**
- [ ] 60fps mobile optimization verified
- [ ] GPU-accelerated transforms used
- [ ] Will-change properties set appropriately

### 2. Platform Detection Strategy

Implement intelligent platform detection for automatic adaptation:

```typescript
// Platform Detection Service
export interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isTablet: boolean;
  isPWA: boolean;
  isStandalone: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  browser: 'safari' | 'chrome' | 'firefox' | 'other';
}

export function detectPlatform(): PlatformInfo {
  if (typeof window === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isTablet: false,
      isPWA: false,
      isStandalone: false,
      platform: 'unknown',
      browser: 'other',
    };
  }

  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isAndroid = /Android/i.test(ua);
  const isTablet = isIOS && /iPad/.test(ua) || (isAndroid && !/Mobile/i.test(ua));
  
  // PWA detection
  const isStandalone = (window.navigator as any).standalone === true || 
    window.matchMedia('(display-mode: standalone)').matches;
  const isPWA = isStandalone || window.matchMedia('(display-mode: standalone)').matches;

  // Browser detection
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);

  let platform: 'ios' | 'android' | 'desktop' | 'unknown' = 'unknown';
  if (isIOS) platform = 'ios';
  else if (isAndroid) platform = 'android';
  else platform = 'desktop';

  let browser: 'safari' | 'chrome' | 'firefox' | 'other' = 'other';
  if (isSafari) browser = 'safari';
  else if (isChrome) browser = 'chrome';
  else if (/Firefox/.test(ua)) browser = 'firefox';

  return {
    isIOS,
    isAndroid,
    isTablet,
    isPWA,
    isStandalone,
    platform,
    browser,
  };
}

// React Hook
export function usePlatform(): PlatformInfo {
  const [platform, setPlatform] = useState<PlatformInfo>(() => detectPlatform());

  useEffect(() => {
    // Re-detect on resize (tablet orientation change)
    const handleResize = () => setPlatform(detectPlatform());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return platform;
}
```

**Platform-Specific Behavior:**
- **iOS Safari/WebKit** → iOS Human Interface Guidelines
- **Android Chrome/WebView** → Material Design 3 patterns
- **Tablet** → Adaptive layouts (larger touch targets, more content)
- **PWA Standalone** → Full native behaviors enabled
- **Feature Detection** → Fallbacks for edge cases

### 3. Touch Interaction Inventory

Document all interactions requiring transformation:

| Desktop Pattern | Mobile Transformation | Implementation |
|----------------|----------------------|----------------|
| **Click** | Tap (with visual feedback) | `onClick` + active state |
| **Hover** | Long press / Touch highlight | `onTouchStart` + 300ms threshold |
| **Drag** | Pan gesture with momentum | `onTouchMove` + velocity tracking |
| **Scroll** | Native momentum scrolling | CSS `-webkit-overflow-scrolling: touch` |
| **Multi-select** | Touch and hold + multi-tap | Long press + selection mode |
| **Context menus** | Long press sheets | Bottom sheet on long press |
| **Tooltips** | Tap-to-reveal or inline help | Modal or inline expansion |

---

## PART 2: iOS-NATIVE IMPLEMENTATION

### 4. iOS Human Interface Guidelines Compliance

#### Navigation Patterns

**Bottom Tab Bar with SF Symbols-style Icons:**
```tsx
// iOS Bottom Tab Bar Component
import { Home, Search, Heart, User } from 'lucide-react';

export function BottomTabBar() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-neutral-200 safe-bottom">
      <div className="flex justify-around items-center h-16">
        <TabButton icon={Home} label="Home" href="/" active={pathname === '/'} />
        <TabButton icon={Search} label="Search" href="/search" active={pathname === '/search'} />
        <TabButton icon={Heart} label="Saved" href="/saved" active={pathname === '/saved'} />
        <TabButton icon={User} label="Profile" href="/profile" active={pathname === '/profile'} />
      </div>
    </nav>
  );
}

function TabButton({ icon: Icon, label, href, active }: TabButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center flex-1 h-full",
        "transition-colors duration-200",
        active ? "text-blue-600" : "text-neutral-500"
      )}
      onClick={() => hapticFeedback('selection')}
    >
      <Icon size={24} />
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </Link>
  );
}
```

**Edge Swipe for Back Navigation:**
```tsx
// Edge Swipe Back Hook
import { useSwipeable } from 'react-swipeable';

export function useEdgeSwipeBack(onBack: () => void) {
  return useSwipeable({
    onSwipedLeft: (e) => {
      // Only trigger if swiped from left edge
      if (e.initial[0] < 20) {
        hapticFeedback('impact', 'light');
        onBack();
      }
    },
    trackMouse: false,
    trackTouch: true,
  });
}

// Usage in page component
function Page() {
  const router = useRouter();
  const swipeHandlers = useEdgeSwipeBack(() => router.back());
  
  return <div {...swipeHandlers}>Content</div>;
}
```

**Pull-to-Refresh with Native iOS Spring Physics:**
```tsx
// Pull-to-Refresh Component
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function PullToRefresh({ onRefresh, children }: Props) {
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const opacity = useTransform(springY, [0, 60], [0, 1]);
  const rotate = useTransform(springY, [0, 60], [0, 180]);

  const handleDrag = (event: any, info: any) => {
    y.set(Math.max(0, info.offset.y));
  };

  const handleDragEnd = () => {
    if (y.get() > 60) {
      hapticFeedback('impact', 'medium');
      onRefresh();
    }
    y.set(0);
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ y: springY }}
    >
      <motion.div
        className="flex justify-center items-center h-16"
        style={{ opacity, rotate }}
      >
        <RefreshCw size={24} className="text-blue-600" />
      </motion.div>
      {children}
    </motion.div>
  );
}
```

**Large Titles That Collapse on Scroll:**
```tsx
// Collapsible Large Title
import { useScroll } from 'framer-motion';

export function CollapsibleHeader({ title }: { title: string }) {
  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [120, 60]);
  const titleScale = useTransform(scrollY, [0, 100], [1, 0.8]);
  const titleOpacity = useTransform(scrollY, [0, 100], [1, 0.7]);

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200"
      style={{ height: headerHeight }}
    >
      <motion.h1
        className="text-3xl font-bold px-4"
        style={{ scale: titleScale, opacity: titleOpacity }}
      >
        {title}
      </motion.h1>
    </motion.header>
  );
}
```

**Translucent Navigation Bars with Backdrop Blur:**
```css
/* iOS Translucent Navigation */
.nav-bar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
```

**Safe Area Inset Handling:**
```css
/* Safe Area Insets */
.container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Bottom navigation with home indicator spacing */
.bottom-nav {
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
```

#### Visual Language

**SF Pro-Inspired Typography Scaling:**
```css
/* iOS Typography Scale */
:root {
  --ios-large-title: 34px;
  --ios-title-1: 28px;
  --ios-title-2: 22px;
  --ios-title-3: 20px;
  --ios-headline: 17px;
  --ios-body: 17px;
  --ios-callout: 16px;
  --ios-subhead: 15px;
  --ios-footnote: 13px;
  --ios-caption-1: 12px;
  --ios-caption-2: 11px;
}
```

**iOS System Colors with Automatic Dark Mode:**
```css
/* iOS System Colors */
:root {
  --ios-blue: #007AFF;
  --ios-green: #34C759;
  --ios-indigo: #5856D6;
  --ios-orange: #FF9500;
  --ios-pink: #FF2D55;
  --ios-purple: #AF52DE;
  --ios-red: #FF3B30;
  --ios-teal: #5AC8FA;
  --ios-yellow: #FFCC00;
  --ios-gray: #8E8E93;
  --ios-gray-2: #AEAEB2;
  --ios-gray-3: #C7C7CC;
  --ios-gray-4: #D1D1D6;
  --ios-gray-5: #E5E5EA;
  --ios-gray-6: #F2F2F7;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ios-blue: #0A84FF;
    --ios-green: #30D158;
    /* ... dark mode variants */
  }
}
```

**Vibrancy and Blur Effects:**
```css
/* iOS Blur Effects */
.blur-light {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.7);
}

.blur-medium {
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  background: rgba(255, 255, 255, 0.8);
}

.blur-heavy {
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  background: rgba(255, 255, 255, 0.9);
}
```

**Card Corner Radius:**
```css
/* iOS Card Styles */
.card {
  border-radius: 12px; /* Standard iOS card */
  border-radius: 16px; /* Large cards */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

**Shadow Depths Matching iOS Elevation:**
```css
/* iOS Shadow System */
.shadow-ios-1 { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12); }
.shadow-ios-2 { box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12); }
.shadow-ios-3 { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.shadow-ios-4 { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); }
```

**Selection States with iOS Blue Tint:**
```css
/* iOS Selection */
.selected {
  background-color: rgba(0, 122, 255, 0.1);
  color: #007AFF;
}

.checkmark {
  color: #007AFF;
}
```

#### Animation Principles

**Spring Animations (Mass, Stiffness, Damping):**
```tsx
// iOS Spring Animation Presets
export const iosSpring = {
  gentle: { type: 'spring', stiffness: 200, damping: 20 },
  standard: { type: 'spring', stiffness: 300, damping: 30 },
  snappy: { type: 'spring', stiffness: 400, damping: 40 },
  bouncy: { type: 'spring', stiffness: 300, damping: 15 },
};

// Usage with Framer Motion
<motion.div
  animate={{ scale: 1 }}
  whileTap={{ scale: 0.95 }}
  transition={iosSpring.standard}
>
  Button
</motion.div>
```

**Gesture-Driven Interruptible Transitions:**
```tsx
// Interruptible Page Transition
const pageVariants = {
  initial: { x: '100%' },
  enter: { x: 0 },
  exit: { x: '-100%' },
};

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="enter"
  exit="exit"
  transition={iosSpring.standard}
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, { offset, velocity }) => {
    if (offset.x > 100 || velocity.x > 500) {
      router.back();
    }
  }}
>
  Page Content
</motion.div>
```

**Rubber-Band Bounce at Scroll Boundaries:**
```css
/* Rubber-band Scroll */
.scroll-container {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  /* iOS automatically adds rubber-band effect */
}
```

**Modal Presentation: Slide-Up with Scale Background:**
```tsx
// iOS Modal Bottom Sheet
export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 safe-bottom"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={iosSpring.standard}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose();
              }
            }}
          >
            <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mt-3 mb-4" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Page Transitions: Push/Pop with Parallax:**
```tsx
// Page Transition with Parallax
const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

<motion.div
  variants={pageTransition}
  transition={iosSpring.standard}
>
  Page Content
</motion.div>
```

### 5. Haptic Feedback Implementation

#### Haptic Feedback Taxonomy

```typescript
// Haptic Feedback Types
export type HapticType = 
  | 'selection'      // Light tap for toggles, selections
  | 'impact-light'   // Light impact for button presses
  | 'impact-medium'  // Medium impact
  | 'impact-heavy'   // Heavy impact
  | 'notification-success'  // Success outcomes
  | 'notification-warning'  // Warning states
  | 'notification-error'    // Error states
  | 'rigid'          // Snapping to positions
  | 'soft';          // Elastic interactions
```

#### Haptic Feedback Service

```typescript
// Haptic Feedback Implementation
export function hapticFeedback(
  type: HapticType = 'selection',
  intensity?: 'light' | 'medium' | 'heavy'
) {
  if (typeof window === 'undefined') return;
  
  // Check for Vibration API support
  if ('vibrate' in navigator) {
    const patterns: Record<HapticType, number | number[]> = {
      'selection': 10,
      'impact-light': 20,
      'impact-medium': 30,
      'impact-heavy': 40,
      'notification-success': [20, 50, 20],
      'notification-warning': [30, 50, 30],
      'notification-error': [40, 50, 40],
      'rigid': 15,
      'soft': 5,
    };

    const pattern = intensity 
      ? patterns[`impact-${intensity}` as HapticType] || patterns['impact-light']
      : patterns[type] || patterns['selection'];

    navigator.vibrate(pattern);
  }

  // iOS Safari workaround using AudioContext
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
}

// React Hook
export function useHapticFeedback() {
  return useCallback((type?: HapticType, intensity?: 'light' | 'medium' | 'heavy') => {
    hapticFeedback(type, intensity);
  }, []);
}
```

#### Implementation Points

**Tab Bar Selection:**
```tsx
<TabButton
  onClick={() => hapticFeedback('selection')}
  // ...
/>
```

**Button Press:**
```tsx
<button
  onClick={() => {
    hapticFeedback('impact-light');
    handleClick();
  }}
>
  Button
</button>
```

**Pull-to-Refresh Threshold:**
```tsx
if (y.get() > 60) {
  hapticFeedback('impact-medium');
  onRefresh();
}
```

**Successful Action:**
```tsx
onSuccess(() => {
  hapticFeedback('notification-success');
  showToast('Saved!');
});
```

**Error State:**
```tsx
onError(() => {
  hapticFeedback('notification-error');
  showError('Something went wrong');
});
```

**Slider Snap Points:**
```tsx
<Slider
  onValueChange={(value) => {
    if (value % 10 === 0) {
      hapticFeedback('selection');
    }
  }}
/>
```

**Long Press Activation:**
```tsx
const { handlers } = useLongPress(() => {
  hapticFeedback('impact-heavy');
  showContextMenu();
}, { threshold: 300 });
```

**Swipe Action Trigger:**
```tsx
onSwipedLeft={() => {
  hapticFeedback('impact-medium');
  handleSwipeAction();
}}
```

**Delete Confirmation:**
```tsx
onDeleteConfirm={() => {
  hapticFeedback('notification-warning');
  confirmDelete();
}}
```

### 6. Gesture System Architecture

#### Core Gestures to Implement

**Tap - Primary Action:**
```tsx
// Tap with 44px minimum target
<button
  className="min-h-[44px] min-w-[44px]"
  onClick={() => handleTap()}
  onTouchStart={(e) => {
    // Immediate visual feedback
    e.currentTarget.classList.add('active');
  }}
  onTouchEnd={(e) => {
    e.currentTarget.classList.remove('active');
  }}
>
  Tap Target
</button>
```

**Double Tap - Zoom or Secondary Action:**
```tsx
// Double Tap Handler
function useDoubleTap(onDoubleTap: () => void, delay = 300) {
  const [lastTap, setLastTap] = useState(0);

  return (e: React.TouchEvent) => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTap;

    if (tapLength < delay && tapLength > 0) {
      onDoubleTap();
      setLastTap(0);
    } else {
      setLastTap(currentTime);
    }
  };
}
```

**Long Press - Context Menu:**
```tsx
// Long Press Hook
function useLongPress(
  callback: () => void,
  { threshold = 300 } = {}
) {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<HTMLElement>();

  const start = useCallback((e: React.TouchEvent) => {
    timeout.current = setTimeout(() => {
      hapticFeedback('impact-heavy');
      callback();
      setLongPressTriggered(true);
    }, threshold);
  }, [callback, threshold]);

  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
    setLongPressTriggered(false);
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
  };
}
```

**Swipe - Navigation or Reveal Actions:**
```tsx
// Swipe Detection Hook
import { useSwipeable } from 'react-swipeable';

function useSwipeActions({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: SwipeActions) {
  return useSwipeable({
    onSwipedLeft: () => {
      hapticFeedback('impact-medium');
      onSwipeLeft?.();
    },
    onSwipedRight: () => {
      hapticFeedback('impact-medium');
      onSwipeRight?.();
    },
    onSwipedUp: () => onSwipeUp?.(),
    onSwipedDown: () => onSwipeDown?.(),
    trackMouse: false,
    trackTouch: true,
    preventDefaultTouchmoveEvent: false,
    delta: 50, // Minimum swipe distance
  });
}
```

**Pan - Drag and Reposition:**
```tsx
// Pan Gesture with Framer Motion
import { motion, useMotionValue, useTransform } from 'framer-motion';

function DraggableItem() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      style={{ x, y, opacity }}
      onDragEnd={(e, info) => {
        if (Math.abs(info.offset.x) > 100) {
          // Trigger action
        }
      }}
    >
      Draggable Content
    </motion.div>
  );
}
```

**Pinch - Zoom Content:**
```tsx
// Pinch to Zoom
import { usePinch } from '@use-gesture/react';

function ZoomableImage({ src }: { src: string }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState([0, 0]);

  const bind = usePinch(
    ({ offset: [scale] }) => setScale(scale),
    { scaleBounds: { min: 1, max: 3 } }
  );

  return (
    <div {...bind()} className="overflow-hidden touch-none">
      <img
        src={src}
        style={{
          transform: `scale(${scale}) translate(${position[0]}px, ${position[1]}px)`,
        }}
        className="w-full h-auto"
      />
    </div>
  );
}
```

#### Swipe Actions

**Swipe Left on List Items → Destructive Actions:**
```tsx
// Swipeable List Item
function SwipeableListItem({ item, onDelete }: Props) {
  const handlers = useSwipeActions({
    onSwipeLeft: () => {
      hapticFeedback('impact-medium');
      onDelete(item.id);
    },
  });

  return (
    <div {...handlers} className="relative overflow-hidden">
      <div className="bg-red-500 text-white flex items-center justify-end px-4 absolute inset-0">
        <Trash2 size={24} />
      </div>
      <div className="bg-white relative z-10">
        {item.content}
      </div>
    </div>
  );
}
```

**Swipe Right on List Items → Positive Actions:**
```tsx
// Swipe Right for Archive/Favorite
function SwipeableListItem({ item, onArchive }: Props) {
  const handlers = useSwipeActions({
    onSwipeRight: () => {
      hapticFeedback('impact-medium');
      onArchive(item.id);
    },
  });

  return (
    <div {...handlers} className="relative overflow-hidden">
      <div className="bg-green-500 text-white flex items-center justify-start px-4 absolute inset-0">
        <Archive size={24} />
      </div>
      <div className="bg-white relative z-10">
        {item.content}
      </div>
    </div>
  );
}
```

**Edge Swipe Left → Navigate Back:**
```tsx
// Edge Swipe Back (already shown above)
const swipeHandlers = useEdgeSwipeBack(() => router.back());
```

**Pull Down → Refresh:**
```tsx
// Pull to Refresh (already shown above)
<PullToRefresh onRefresh={handleRefresh}>
  {content}
</PullToRefresh>
```

**Pull Up → Load More:**
```tsx
// Pull Up to Load More
function InfiniteScroll({ onLoadMore, hasMore }: Props) {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore) {
      hapticFeedback('selection');
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore]);

  return <div ref={ref} className="h-20" />;
}
```

#### Gesture Conflict Resolution

**Scroll vs. Swipe Detection Threshold:**
```typescript
// Prevent swipe when scrolling
const SWIPE_THRESHOLD = 50;
const SCROLL_THRESHOLD = 10;

function handleTouchMove(e: TouchEvent) {
  const deltaX = Math.abs(e.touches[0].clientX - startX);
  const deltaY = Math.abs(e.touches[0].clientY - startY);

  // If vertical scroll is greater, don't trigger swipe
  if (deltaY > SCROLL_THRESHOLD && deltaY > deltaX) {
    isScrolling = true;
    return;
  }

  // Only trigger swipe if horizontal movement is significant
  if (deltaX > SWIPE_THRESHOLD && deltaX > deltaY) {
    handleSwipe();
  }
}
```

**Tap vs. Long Press Timing:**
```typescript
// Long press threshold: 300ms
const LONG_PRESS_THRESHOLD = 300;
let pressTimer: NodeJS.Timeout;

onTouchStart(() => {
  pressTimer = setTimeout(() => {
    handleLongPress();
  }, LONG_PRESS_THRESHOLD);
});

onTouchEnd(() => {
  clearTimeout(pressTimer);
  if (!longPressTriggered) {
    handleTap();
  }
});
```

**Pan vs. Swipe Velocity Detection:**
```typescript
// Velocity-based gesture detection
function calculateVelocity(
  start: Touch,
  end: Touch,
  timeDelta: number
): number {
  const distance = Math.sqrt(
    Math.pow(end.clientX - start.clientX, 2) +
    Math.pow(end.clientY - start.clientY, 2)
  );
  return distance / timeDelta;
}

// If velocity > 500px/s, treat as swipe, not pan
if (velocity > 500) {
  handleSwipe();
} else {
  handlePan();
}
```

**Prevent Ghost Clicks (300ms Delay Elimination):**
```css
/* Remove 300ms tap delay */
* {
  touch-action: manipulation;
}

/* Or for specific elements */
button, a {
  touch-action: manipulation;
}
```

```html
<!-- Viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
```

---

## PART 3: ANDROID MATERIAL DESIGN ADAPTATION

### 7. Material Design 3 Implementation

#### Auto-Detection Trigger

```typescript
// Material Design Detection
export function useMaterialDesign() {
  const platform = usePlatform();
  const prefersMaterial = useMediaQuery('(prefers-color-scheme: light)');

  const isMaterial = platform.isAndroid || 
    (platform.platform === 'desktop' && prefersMaterial);

  return {
    isMaterial,
    isAndroid: platform.isAndroid,
    theme: isMaterial ? 'material' : 'ios',
  };
}
```

#### Material Navigation

**Bottom Navigation with Material Ripple Effects:**
```tsx
// Material Bottom Navigation
export function MaterialBottomNav() {
  const pathname = usePathname();
  const { isMaterial } = useMaterialDesign();

  if (!isMaterial) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg safe-bottom">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <MaterialTabButton
            key={tab.href}
            {...tab}
            active={pathname === tab.href}
          />
        ))}
      </div>
    </nav>
  );
}

function MaterialTabButton({ icon: Icon, label, href, active }: TabProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center flex-1 h-full",
        "relative overflow-hidden",
        "transition-colors duration-200",
        active && "text-blue-600"
      )}
      onTouchStart={(e) => {
        // Material ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'material-ripple';
        e.currentTarget.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }}
    >
      <Icon size={24} />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </Link>
  );
}
```

**Navigation Drawer (Hamburger Menu):**
```tsx
// Material Navigation Drawer
export function MaterialDrawer({ isOpen, onClose, children }: DrawerProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

**Floating Action Button (FAB):**
```tsx
// Material FAB
export function FloatingActionButton({ onClick, icon: Icon }: FABProps) {
  return (
    <motion.button
      className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg z-50 flex items-center justify-center safe-bottom"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      onTouchStart={(e) => {
        // Material ripple
        hapticFeedback('impact-light');
      }}
    >
      <Icon size={24} />
    </motion.button>
  );
}
```

**Top App Bar with Material Elevation:**
```tsx
// Material Top App Bar
export function MaterialAppBar({ title, actions }: AppBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <div className="flex items-center justify-between h-14 px-4">
        <button className="p-2 -ml-2">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-medium flex-1 text-center">{title}</h1>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    </header>
  );
}
```

**Back Button in Toolbar:**
```tsx
// Material Back Button
export function MaterialBackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="p-2 -ml-2 flex items-center"
      onTouchStart={() => hapticFeedback('impact-light')}
    >
      <ArrowLeft size={24} />
    </button>
  );
}
```

#### Material Visual Language

**Roboto Typography System:**
```css
/* Material Typography */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

:root {
  --material-headline-1: 96px;
  --material-headline-2: 60px;
  --material-headline-3: 48px;
  --material-headline-4: 34px;
  --material-headline-5: 24px;
  --material-headline-6: 20px;
  --material-subtitle-1: 16px;
  --material-subtitle-2: 14px;
  --material-body-1: 16px;
  --material-body-2: 14px;
  --material-button: 14px;
  --material-caption: 12px;
  --material-overline: 10px;
}
```

**Material Color System with Surface Tints:**
```css
/* Material Colors */
:root {
  --material-primary: #6200EE;
  --material-primary-variant: #3700B3;
  --material-secondary: #03DAC6;
  --material-secondary-variant: #018786;
  --material-background: #FFFFFF;
  --material-surface: #FFFFFF;
  --material-error: #B00020;
  --material-on-primary: #FFFFFF;
  --material-on-secondary: #000000;
  --material-on-background: #000000;
  --material-on-surface: #000000;
  --material-on-error: #FFFFFF;
}
```

**Elevation Shadows (Not iOS Blur):**
```css
/* Material Elevation */
.elevation-0 { box-shadow: none; }
.elevation-1 { box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12); }
.elevation-2 { box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12); }
.elevation-3 { box-shadow: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12); }
.elevation-4 { box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12); }
.elevation-6 { box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12); }
```

**Rounded Corners: 12-28dp (Material Tokens):**
```css
/* Material Border Radius */
.radius-small { border-radius: 4px; }
.radius-medium { border-radius: 8px; }
.radius-large { border-radius: 12px; }
.radius-xlarge { border-radius: 16px; }
.radius-xxlarge { border-radius: 28px; }
```

**Ripple Effects on All Touchable Elements:**
```css
/* Material Ripple Effect */
.material-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  transform: scale(0);
  animation: ripple 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
```

**State Layers for Pressed/Focused States:**
```css
/* Material State Layers */
.button {
  position: relative;
  overflow: hidden;
}

.button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.2s;
}

.button:active::before {
  opacity: 0.12;
}

.button:focus-visible::before {
  opacity: 0.08;
}
```

#### Material Motion

**Standard Easing (Not Spring Physics):**
```css
/* Material Easing */
:root {
  --material-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --material-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --material-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --material-sharp: cubic-bezier(0.4, 0, 0.6, 1);
}
```

**Container Transform Animations:**
```tsx
// Material Container Transform
<motion.div
  layout
  transition={{ duration: 0.3, ease: 'easeInOut' }}
>
  {content}
</motion.div>
```

**Shared Axis Transitions:**
```tsx
// Material Shared Axis
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};
```

**Fade Through for Unrelated Content:**
```tsx
// Material Fade Through
const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};
```

**300ms Standard Duration:**
```typescript
// Material Animation Duration
export const materialDuration = {
  short1: 50,
  short2: 200,
  short3: 250,
  short4: 300,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
};
```

### 8. Platform-Specific Component Variants

#### Buttons

**iOS:**
```tsx
// iOS Button Style
<button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium">
  iOS Button
</button>
```

**Android:**
```tsx
// Material Button
<button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md elevation-2">
  Material Button
</button>
```

#### Lists

**iOS:**
```tsx
// iOS Grouped List
<div className="bg-neutral-100 rounded-2xl overflow-hidden">
  {items.map(item => (
    <div key={item.id} className="bg-white px-4 py-3 border-b border-neutral-200 last:border-0">
      {item.content}
    </div>
  ))}
</div>
```

**Android:**
```tsx
// Material List
<div className="bg-white">
  {items.map(item => (
    <div key={item.id} className="px-4 py-3 border-b border-neutral-200">
      {item.content}
    </div>
  ))}
</div>
```

#### Modals

**iOS:**
```tsx
// iOS Bottom Sheet (already shown above)
<Modal isOpen={isOpen} onClose={onClose}>
  {content}
</Modal>
```

**Android:**
```tsx
// Material Dialog
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {content}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

#### Selections

**iOS:**
```tsx
// iOS Checkmark on Right
<div className="flex items-center justify-between">
  <span>Option</span>
  {selected && <Check className="text-blue-600" size={20} />}
</div>
```

**Android:**
```tsx
// Material Checkbox on Left
<div className="flex items-center">
  <input type="checkbox" className="mr-3" checked={selected} />
  <span>Option</span>
</div>
```

#### Switches

**iOS:**
```tsx
// iOS UISwitch Style
<div className={cn(
  "w-12 h-7 rounded-full transition-colors",
  enabled ? "bg-green-500" : "bg-neutral-300"
)}>
  <div className={cn(
    "w-6 h-6 bg-white rounded-full shadow-md transition-transform",
    enabled ? "translate-x-5" : "translate-x-0.5"
  )} />
</div>
```

**Android:**
```tsx
// Material Switch
<div className={cn(
  "w-12 h-7 rounded-full transition-colors",
  enabled ? "bg-blue-600" : "bg-neutral-400"
)}>
  <div className={cn(
    "w-6 h-6 bg-white rounded-full shadow-md transition-transform",
    enabled ? "translate-x-5" : "translate-x-0.5"
  )} />
</div>
```

---

## PART 4: TECHNICAL IMPLEMENTATION

### 9. Touch Event Optimization

#### Event Handling

**Remove 300ms Tap Delay:**
```css
/* Remove tap delay */
* {
  touch-action: manipulation;
}

/* Or for specific elements */
button, a, [role="button"] {
  touch-action: manipulation;
}
```

**Passive Event Listeners for Scroll Performance:**
```typescript
// Passive event listeners
element.addEventListener('touchstart', handler, { passive: true });
element.addEventListener('touchmove', handler, { passive: true });
element.addEventListener('touchend', handler, { passive: true });
```

**Prevent Unwanted Behaviors:**
```css
/* Prevent text selection */
.no-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* Prevent image dragging */
img {
  -webkit-user-drag: none;
  user-drag: none;
}
```

#### Touch Feedback States

**Active State: Immediate Visual Feedback (<100ms):**
```tsx
// Immediate Touch Feedback
<button
  className="transition-all duration-75"
  onTouchStart={(e) => {
    e.currentTarget.classList.add('scale-95', 'opacity-80');
  }}
  onTouchEnd={(e) => {
    e.currentTarget.classList.remove('scale-95', 'opacity-80');
  }}
>
  Button
</button>
```

**Pressed State: Scale or Opacity Change:**
```css
/* Pressed State */
.button:active {
  transform: scale(0.95);
  opacity: 0.8;
}

/* Or with classes */
.pressed {
  transform: scale(0.95);
  opacity: 0.8;
}
```

**Disabled State: Reduced Opacity (0.4-0.5):**
```css
.button:disabled {
  opacity: 0.4;
  pointer-events: none;
}
```

**Loading State: Spinner or Skeleton:**
```tsx
// Loading State
<button disabled={isLoading}>
  {isLoading ? (
    <Spinner size={20} />
  ) : (
    'Submit'
  )}
</button>
```

#### Gesture Library Integration

**Framer Motion Gestures:**
```tsx
import { motion, useDragControls, useMotionValue } from 'framer-motion';

function DraggableCard() {
  const x = useMotionValue(0);
  const dragControls = useDragControls();

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -100, right: 100 }}
      style={{ x }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 50) {
          handleSwipeRight();
        }
      }}
    >
      Card Content
    </motion.div>
  );
}
```

**React-Use-Gesture for Complex Gestures:**
```tsx
import { useDrag, usePinch, useGesture } from '@use-gesture/react';

function GestureCard() {
  const [{ x, y, scale }, api] = useSpring(() => ({ x: 0, y: 0, scale: 1 }));

  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => api({ x, y }),
    onPinch: ({ offset: [scale] }) => api({ scale }),
  });

  return (
    <animated.div
      {...bind()}
      style={{ x, y, scale }}
    >
      Content
    </animated.div>
  );
}
```

### 10. Performance Requirements

#### 60fps Touch Response

**Use CSS Transforms (Not Position):**
```css
/* ✅ Good - GPU accelerated */
.transform {
  transform: translateX(100px);
  will-change: transform;
}

/* ❌ Bad - causes layout recalculation */
.position {
  left: 100px;
}
```

**Enable GPU Acceleration:**
```css
.gpu-accelerated {
  will-change: transform;
  transform: translateZ(0);
  /* Or */
  transform: translate3d(0, 0, 0);
}
```

**Debounce Resize, Throttle Scroll:**
```typescript
// Debounce resize
import { debounce } from 'lodash';

const handleResize = debounce(() => {
  // Handle resize
}, 250);

window.addEventListener('resize', handleResize);

// Throttle scroll
import { throttle } from 'lodash';

const handleScroll = throttle(() => {
  // Handle scroll
}, 16); // ~60fps

window.addEventListener('scroll', handleScroll);
```

**Use requestAnimationFrame for Animations:**
```typescript
function animate() {
  // Update animation
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

**Lazy Load Below-Fold Content:**
```tsx
// Lazy loading with Intersection Observer
import { useInView } from 'react-intersection-observer';

function LazyComponent() {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {inView && <HeavyComponent />}
    </div>
  );
}
```

**Optimize Images for Mobile:**
```tsx
// Next.js Image Optimization
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={400}
  height={300}
  alt="Description"
  loading="lazy"
  quality={85}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### Memory Management

**Virtualize Long Lists:**
```tsx
// React Window for Virtualization
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }: { items: Item[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].content}
        </div>
      )}
    </FixedSizeList>
  );
}
```

**Clean Up Gesture Listeners on Unmount:**
```tsx
useEffect(() => {
  const handler = (e: TouchEvent) => {
    // Handle touch
  };

  element.addEventListener('touchstart', handler);
  
  return () => {
    element.removeEventListener('touchstart', handler);
  };
}, []);
```

**Limit Concurrent Animations:**
```typescript
// Limit concurrent animations
const MAX_CONCURRENT_ANIMATIONS = 5;
let activeAnimations = 0;

function startAnimation() {
  if (activeAnimations >= MAX_CONCURRENT_ANIMATIONS) {
    return;
  }
  activeAnimations++;
  // Start animation
  // On complete: activeAnimations--;
}
```

**Use CSS Containment:**
```css
.contained {
  contain: layout paint;
  /* Or */
  contain: strict;
}
```

#### Network Optimization

**Service Worker for Offline Capability:**
```typescript
// Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

**Prefetch Likely Navigation Targets:**
```tsx
// Next.js Link Prefetch
<Link href="/page" prefetch>
  Link
</Link>
```

**Compress Assets Aggressively:**
```javascript
// next.config.js
module.exports = {
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

**Critical CSS Inlining:**
```tsx
// Next.js Critical CSS
import styles from './critical.css';

export default function Page() {
  return (
    <>
      <style jsx>{styles}</style>
      {/* Content */}
    </>
  );
}
```

### 11. Safe Areas & Viewport

#### iOS Safe Areas

```css
/* Safe Area Insets */
.container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Safe area utility classes */
.safe-top {
  padding-top: env(safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-left {
  padding-left: env(safe-area-inset-left);
}

.safe-right {
  padding-right: env(safe-area-inset-right);
}
```

#### Viewport Configuration

```html
<!-- Viewport Meta Tag -->
<meta 
  name="viewport" 
  content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
>

<!-- iOS PWA Meta Tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="App Name">
```

#### Home Indicator Handling

**Bottom Navigation Padding for Home Indicator:**
```css
.bottom-nav {
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
```

**Avoid Interactive Elements in Home Indicator Zone:**
```css
/* Keep interactive elements above safe area */
.interactive-element {
  margin-bottom: env(safe-area-inset-bottom);
}
```

**Handle Keyboard Appearance Gracefully:**
```typescript
// Keyboard handling
useEffect(() => {
  const handleResize = () => {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    // Adjust layout for keyboard
  };

  window.visualViewport?.addEventListener('resize', handleResize);
  return () => window.visualViewport?.removeEventListener('resize', handleResize);
}, []);
```

---

## PART 5: COMPONENT TRANSFORMATION LIBRARY

### 12. Core Components to Transform

#### Navigation Components

**Header → Collapsible Navigation Bar:**
```tsx
// Collapsible Header (already shown in iOS section)
<CollapsibleHeader title="Page Title" />
```

**Footer → Bottom Tab Bar:**
```tsx
// Bottom Tab Bar (already shown in iOS section)
<BottomTabBar />
```

**Sidebar → Slide-Over Drawer:**
```tsx
// Slide-Over Drawer
function SlideOverDrawer({ isOpen, onClose, children }: DrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={iosSpring.standard}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Breadcrumbs → Back Button + Title:**
```tsx
// Mobile Breadcrumb Replacement
function MobileBreadcrumb({ title, onBack }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <button onClick={onBack} className="p-2 -ml-2">
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
}
```

**Pagination → Infinite Scroll / Load More:**
```tsx
// Infinite Scroll (already shown above)
<InfiniteScroll onLoadMore={loadMore} hasMore={hasMore} />
```

#### Interactive Components

**Buttons → Touch-Optimized with Feedback States:**
```tsx
// Touch-Optimized Button
function TouchButton({ children, onClick, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="min-h-[44px] px-6 py-3 rounded-xl font-medium transition-all duration-75 active:scale-95 active:opacity-80"
      onClick={(e) => {
        hapticFeedback('impact-light');
        onClick?.(e);
      }}
    >
      {children}
    </button>
  );
}
```

**Links → Larger Tap Targets, Touch Highlights:**
```tsx
// Touch-Optimized Link
function TouchLink({ href, children, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      {...props}
      className="min-h-[44px] flex items-center px-4 py-2 rounded-lg active:bg-neutral-100"
      onTouchStart={() => hapticFeedback('selection')}
    >
      {children}
    </Link>
  );
}
```

**Forms → Mobile-Optimized Inputs:**
```tsx
// Mobile-Optimized Input
function MobileInput({ type, ...props }: InputProps) {
  const inputMode = {
    email: 'email',
    tel: 'tel',
    number: 'numeric',
    search: 'search',
  }[type] || 'text';

  return (
    <input
      type={type}
      inputMode={inputMode}
      autoComplete={type}
      className="min-h-[48px] w-full px-4 text-base border rounded-lg"
      style={{ fontSize: '16px' }} // Prevent zoom
      {...props}
    />
  );
}
```

**Dropdowns → Native Select or Bottom Sheet Picker:**
```tsx
// Mobile Dropdown Picker
function MobileSelect({ options, value, onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="min-h-[48px] w-full px-4 text-left border rounded-lg"
      >
        {options.find(o => o.value === value)?.label}
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg active:bg-neutral-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
```

**Modals → Bottom Sheets (iOS) / Dialogs (Android):**
```tsx
// Platform-Aware Modal
function PlatformModal({ isOpen, onClose, children }: ModalProps) {
  const { isMaterial } = useMaterialDesign();

  if (isMaterial) {
    return <MaterialDialog isOpen={isOpen} onClose={onClose}>{children}</MaterialDialog>;
  }
  return <IOSModal isOpen={isOpen} onClose={onClose}>{children}</IOSModal>;
}
```

**Tooltips → Inline Help or Tap-to-Reveal:**
```tsx
// Mobile Tooltip Replacement
function MobileHelp({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
        aria-label="Help"
      >
        <HelpCircle size={20} />
      </button>
      {isOpen && (
        <div className="absolute bg-white border rounded-lg p-3 shadow-lg z-50">
          {content}
        </div>
      )}
    </>
  );
}
```

**Accordions → Touch-Friendly Expansion:**
```tsx
// Touch-Friendly Accordion
function TouchAccordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => {
          hapticFeedback('selection');
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between p-4 min-h-[44px]"
      >
        <span>{title}</span>
        <ChevronDown className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}
```

#### Content Components

**Cards → Swipeable with Actions:**
```tsx
// Swipeable Card (already shown above)
<SwipeableListItem item={item} onDelete={handleDelete} />
```

**Lists → Pull-to-Refresh, Swipe Actions:**
```tsx
// Enhanced List with Pull-to-Refresh
<PullToRefresh onRefresh={handleRefresh}>
  <SwipeableList items={items} />
</PullToRefresh>
```

**Tables → Horizontal Scroll or Card Conversion:**
```tsx
// Mobile Table Conversion
function MobileTable({ data }: TableProps) {
  return (
    <div className="space-y-4">
      {data.map(row => (
        <div key={row.id} className="bg-white rounded-lg p-4 shadow-sm">
          {Object.entries(row).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b last:border-0">
              <span className="font-medium">{key}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

**Images → Pinch-to-Zoom, Double-Tap Zoom:**
```tsx
// Zoomable Image (already shown above)
<ZoomableImage src="/image.jpg" />
```

**Videos → Native Controls, Fullscreen Handling:**
```tsx
// Mobile-Optimized Video
function MobileVideo({ src }: { src: string }) {
  return (
    <video
      src={src}
      controls
      playsInline
      className="w-full"
      onFullscreenChange={(e) => {
        // Handle fullscreen change
      }}
    />
  );
}
```

**Carousels → Snap Scrolling with Indicators:**
```tsx
// Snap Scrolling Carousel
function SnapCarousel({ items }: CarouselProps) {
  return (
    <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide">
      <div className="flex gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full snap-center"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Feedback Components

**Toasts → iOS/Android Native Positioning:**
```tsx
// Platform-Aware Toast
function PlatformToast({ message, type }: ToastProps) {
  const { isMaterial } = useMaterialDesign();

  return (
    <motion.div
      className={cn(
        "fixed z-50 px-4 py-3 rounded-lg shadow-lg",
        isMaterial ? "top-4 left-4 right-4" : "bottom-24 left-4 right-4",
        type === 'success' && "bg-green-500 text-white",
        type === 'error' && "bg-red-500 text-white"
      )}
      initial={{ opacity: 0, y: isMaterial ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isMaterial ? -20 : 20 }}
    >
      {message}
    </motion.div>
  );
}
```

**Alerts → Action Sheets (iOS) / Dialogs (Android):**
```tsx
// Platform-Aware Alert
function PlatformAlert({ title, message, actions }: AlertProps) {
  const { isMaterial } = useMaterialDesign();

  if (isMaterial) {
    return <MaterialDialog title={title} message={message} actions={actions} />;
  }
  return <IOSActionSheet title={title} message={message} actions={actions} />;
}
```

**Loading → Platform-Appropriate Spinners:**
```tsx
// Platform-Aware Loading
function PlatformLoading() {
  const { isMaterial } = useMaterialDesign();

  return (
    <div className="flex items-center justify-center p-8">
      {isMaterial ? (
        <MaterialSpinner />
      ) : (
        <IOSSpinner />
      )}
    </div>
  );
}
```

**Progress → Native-Feeling Progress Bars:**
```tsx
// Native Progress Bar
function NativeProgress({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-blue-600"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
```

**Skeletons → Content Placeholder Loading:**
```tsx
// Skeleton Loading
function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-neutral-200 rounded w-1/2" />
    </div>
  );
}
```

### 13. Form Optimization

#### Input Types

```html
<!-- Email Input -->
<input 
  type="email" 
  inputmode="email" 
  autocomplete="email"
  class="min-h-[48px] text-base"
>

<!-- Phone Input -->
<input 
  type="tel" 
  inputmode="tel" 
  autocomplete="tel"
  class="min-h-[48px] text-base"
>

<!-- Number Input -->
<input 
  type="number" 
  inputmode="numeric" 
  pattern="[0-9]*"
  class="min-h-[48px] text-base"
>

<!-- Search Input -->
<input 
  type="search" 
  inputmode="search"
  class="min-h-[48px] text-base"
>
```

#### Mobile Form Patterns

**Large Input Fields (min 48px height):**
```tsx
// Large Input Field
<input className="min-h-[48px] w-full px-4 text-base" />
```

**Clear Field Buttons:**
```tsx
// Input with Clear Button
function ClearableInput({ value, onChange }: InputProps) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[48px] w-full px-4 pr-10 text-base"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
```

**Show/Hide Password Toggle:**
```tsx
// Password Input with Toggle
function PasswordInput({ value, onChange }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[48px] w-full px-4 pr-12 text-base"
      />
      <button
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
```

**Auto-Advance on Code Inputs:**
```tsx
// Code Input with Auto-Advance
function CodeInput({ length = 6, onChange }: CodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    onChange(newCode.join(''));
  };

  return (
    <div className="flex gap-2">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => inputs.current[index] = el}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          className="w-12 h-12 text-center text-xl border rounded-lg"
        />
      ))}
    </div>
  );
}
```

**Smart Keyboard Selection:**
```tsx
// Smart Keyboard Input
<input
  type="email"
  inputMode="email"
  autoComplete="email"
  autoCapitalize="none"
  autoCorrect="off"
  spellCheck="false"
/>
```

**Prevent Zoom on Focus (16px minimum font):**
```css
/* Prevent zoom on input focus */
input, select, textarea {
  font-size: 16px !important;
}
```

**Sticky Submit Button Above Keyboard:**
```tsx
// Sticky Submit Button
function StickySubmit({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t safe-bottom z-50">
      <button
        onClick={onSubmit}
        className="w-full min-h-[48px] bg-blue-600 text-white rounded-lg font-medium"
      >
        Submit
      </button>
    </div>
  );
}
```

#### Validation

**Inline Validation (Not Just on Submit):**
```tsx
// Inline Validation
function ValidatedInput({ value, onChange, validator }: InputProps) {
  const [error, setError] = useState('');

  const handleChange = (newValue: string) => {
    onChange(newValue);
    const validationError = validator(newValue);
    setError(validationError);
    
    if (validationError) {
      hapticFeedback('notification-error');
    }
  };

  return (
    <div>
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          "min-h-[48px] w-full px-4 text-base border rounded-lg",
          error && "border-red-500"
        )}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
```

**Haptic Feedback on Errors:**
```tsx
// Error with Haptic
if (error) {
  hapticFeedback('notification-error');
  showError(error);
}
```

**Shake Animation for Invalid Fields:**
```tsx
// Shake Animation
const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
};

<motion.input
  variants={shakeVariants}
  animate={hasError ? 'shake' : 'initial'}
/>
```

**Success States with Checkmarks:**
```tsx
// Success State
{isValid && (
  <div className="absolute right-2 top-1/2 -translate-y-1/2">
    <CheckCircle className="text-green-500" size={20} />
  </div>
)}
```

---

## PART 6: IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)

**Tasks:**
- [ ] Implement platform detection system
- [ ] Create base touch utilities and hooks
- [ ] Set up haptic feedback service
- [ ] Configure viewport and safe areas
- [ ] Establish CSS custom properties for platform theming
- [ ] Create gesture detection system
- [ ] Build touch feedback state system

**Deliverables:**
- Platform detection service
- Haptic feedback utility
- Touch event hooks
- Safe area utilities
- Base CSS variables

### Phase 2: Navigation Transformation (Week 3-4)

**Tasks:**
- [ ] Convert header to collapsible nav bar
- [ ] Implement bottom tab bar with platform variants
- [ ] Add edge-swipe back navigation (iOS)
- [ ] Create slide-over drawer component
- [ ] Implement pull-to-refresh globally
- [ ] Add page transition animations
- [ ] Handle deep linking and navigation state

**Deliverables:**
- Collapsible navigation bar
- Bottom tab bar (iOS/Android variants)
- Edge swipe navigation
- Slide-over drawer
- Pull-to-refresh component
- Page transition system

### Phase 3: Component Library (Week 5-7)

**Tasks:**
- [ ] Transform all buttons with touch states
- [ ] Convert modals to bottom sheets
- [ ] Implement swipeable list items
- [ ] Create platform-specific form inputs
- [ ] Build touch-optimized dropdowns/pickers
- [ ] Add gesture-driven image viewer
- [ ] Implement toast/notification system

**Deliverables:**
- Touch-optimized button components
- Platform-aware modal system
- Swipeable list components
- Mobile form components
- Image zoom component
- Toast notification system

### Phase 4: Gesture System (Week 8-9)

**Tasks:**
- [ ] Implement full swipe action system
- [ ] Add pinch-to-zoom where applicable
- [ ] Create drag-to-reorder functionality
- [ ] Build gesture-dismissible components
- [ ] Add long-press context menus
- [ ] Implement momentum scrolling refinements
- [ ] Handle gesture conflicts and edge cases

**Deliverables:**
- Complete gesture library
- Swipe action system
- Pinch-to-zoom implementation
- Drag-to-reorder
- Long-press handlers
- Gesture conflict resolution

### Phase 5: Polish & Optimization (Week 10-11)

**Tasks:**
- [ ] Performance audit and optimization
- [ ] Haptic feedback tuning
- [ ] Animation timing refinement
- [ ] Cross-device testing (iPhone, Android variants)
- [ ] Accessibility audit for touch
- [ ] PWA enhancement and offline support
- [ ] Battery and performance profiling

**Deliverables:**
- Performance optimization report
- Accessibility audit results
- PWA manifest and service worker
- Cross-device compatibility matrix

### Phase 6: Testing & Launch (Week 12)

**Tasks:**
- [ ] User testing on real devices
- [ ] A/B test native vs. previous experience
- [ ] Performance benchmarking
- [ ] Bug fixes and refinements
- [ ] Documentation and component storybook
- [ ] Team training on mobile patterns

**Deliverables:**
- User testing report
- Performance benchmarks
- Component documentation
- Team training materials

---

## Deliverables

### Code Deliverables

1. **Platform Detection Service** with feature flags
2. **Haptic Feedback Utility** with all patterns
3. **Gesture Hook Library** (useTap, useSwipe, usePan, etc.)
4. **Touch-Optimized Component Library**
5. **Platform-Switching Theme System**
6. **Animation Presets** for both platforms
7. **Safe Area Handling Utilities**
8. **Mobile-Optimized Form Components**
9. **PWA Configuration** and service worker

### Documentation

1. **Mobile Pattern Library** with examples
2. **Gesture Interaction Map**
3. **Haptic Feedback Usage Guide**
4. **Platform-Specific Component Variants**
5. **Performance Optimization Checklist**
6. **Testing Protocols** for mobile

### Testing

1. **Touch Interaction Test Suite**
2. **Gesture Recognition Tests**
3. **Performance Benchmarks** (FPS, TTI)
4. **Cross-Device Compatibility Matrix**
5. **Accessibility Audit Results**

---

## Success Criteria

### User Experience

- [ ] Users cannot distinguish from native app
- [ ] Touch interactions feel immediate (<100ms)
- [ ] Gestures work intuitively without instruction
- [ ] Platform conventions feel natural

### Performance

- [ ] 60fps during all interactions
- [ ] First Input Delay < 100ms
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3s on 4G

### Technical

- [ ] Zero 300ms tap delays
- [ ] All touch targets ≥ 44px (iOS) / 48dp (Android)
- [ ] Proper safe area handling on all devices
- [ ] Haptic feedback on appropriate interactions
- [ ] Gesture conflicts properly resolved

### Business

- [ ] Increased mobile engagement
- [ ] Reduced bounce rate on mobile
- [ ] Improved mobile conversion rate
- [ ] Positive user feedback on native feel

---

## Constraints

- ✅ **Preserve all existing functionality** - Desktop experience must remain intact
- ✅ **Maintain desktop experience quality** - No degradation for desktop users
- ✅ **No native app wrappers** - Pure web implementation
- ✅ **Must work offline** - PWA requirements met
- ✅ **Accessibility must not be compromised** - WCAG AA compliance maintained
- ✅ **Performance budget** - <200KB JS, <500KB total initial load
- ✅ **Browser support** - iOS 14+, Android 10+

---

## Integration with Other Frameworks

### TOUCH + CODA

**Planning Mobile Transformations:**
- Use CODA to plan mobile-native transformations
- Structure thinking: Context (current mobile state) → Objective (native feel) → Details (gestures, haptics, animations) → Acceptance (success criteria)

**Example:**
> "Current mobile experience has hover states and small touch targets (context). Goal is iOS-native feel with gestures and haptics (objective). Implement bottom tab bar, edge swipe, pull-to-refresh, and haptic feedback on all interactions (details). Success: users can't distinguish from native app, 60fps interactions, all touch targets ≥44px (acceptance)."

### TOUCH + SOPHIA

**Auditing Mobile UX Quality:**
- Use SOPHIA to audit mobile experience before/after TOUCH implementation
- Score touch targets, spacing, visual hierarchy, sophistication
- Track improvement: 65/100 → 90/100 after TOUCH implementation

**Example:**
> "Before TOUCH: Touch targets 30/100 (many <44px), spacing 70/100 (excessive padding). After TOUCH: Touch targets 100/100 (all ≥44px), spacing 95/100 (optimized). Overall: 65/100 → 92/100."

### TOUCH + AIDA

**Mobile Content Optimization:**
- Use AIDA to structure mobile content for conversion
- Optimize Attention (hero), Interest (features), Desire (social proof), Action (CTAs) for mobile
- Ensure mobile CTAs are prominent and touch-optimized

**Example:**
> "Mobile hero needs immediate value prop (Attention). Features section with touch-friendly cards (Interest). Testimonials with swipeable carousel (Desire). Sticky bottom CTA button (Action). Score: 85/100 mobile AIDA."

### All Three Together

- **CODA:** Plan the mobile transformation
- **TOUCH:** Implement mobile-native patterns
- **SOPHIA:** Audit mobile UX quality
- **AIDA:** Optimize mobile content for conversion
- **Result:** Complete, high-quality, conversion-focused mobile-native experience

---

## Quick Reference

### Platform Detection

```typescript
const platform = detectPlatform();
if (platform.isIOS) {
  // iOS patterns
} else if (platform.isAndroid) {
  // Material Design patterns
}
```

### Common Touch Patterns

```tsx
// Touch-optimized button
<button className="min-h-[44px] active:scale-95" onClick={() => hapticFeedback('impact-light')}>
  Button
</button>

// Swipeable item
const handlers = useSwipeActions({ onSwipeLeft: handleDelete });
<div {...handlers}>Item</div>

// Pull-to-refresh
<PullToRefresh onRefresh={handleRefresh}>{content}</PullToRefresh>
```

### Haptic Feedback Patterns

```typescript
// Selection (toggles, tabs)
hapticFeedback('selection');

// Button press
hapticFeedback('impact-light');

// Success
hapticFeedback('notification-success');

// Error
hapticFeedback('notification-error');
```

### Gesture Implementation

```tsx
// Edge swipe back
const handlers = useEdgeSwipeBack(() => router.back());
<div {...handlers}>Page</div>

// Long press
const { handlers } = useLongPress(() => showMenu(), { threshold: 300 });
<div {...handlers}>Item</div>

// Swipe actions
const handlers = useSwipeActions({ onSwipeLeft: handleDelete });
<div {...handlers}>List Item</div>
```

---

## Summary

**TOUCH = Mobile-native web transformation framework**

Use TOUCH to:
- Transform web apps into mobile-native experiences
- Implement touch-first interactions
- Add gesture navigation and haptic feedback
- Adapt to iOS and Android platform conventions
- Achieve 60fps performance on mobile
- Create PWAs that feel native

**Key Philosophy:**
*"Make web applications feel indistinguishable from native apps through touch-first design, gesture navigation, haptic feedback, and platform-specific adaptations."*

---

**Framework Status:** ✅ Production Ready
**Universal:** Works for any Next.js/React project
**Integration:** Complements CODA (planning), SOPHIA (audit), AIDA (content)











