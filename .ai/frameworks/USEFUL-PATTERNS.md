# Useful Patterns from LostMonster Project

> **Reusable utilities and patterns extracted from lostmonster project**
> These can be adapted for use across projects while respecting design language differences.

## Utility Functions

### Formatting Utilities

**Price Formatting:**
```typescript
export function formatPrice(
  amount: number,
  currency: string = "GBP",
  locale: string = "en-GB"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
```

**Date Formatting:**
```typescript
export function formatDate(
  date: Date | string,
  locale: string = "en-GB"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(
  date: Date | string,
  locale: string = "en-GB"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
```

**Text Utilities:**
```typescript
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
```

### Performance Utilities

**Debounce:**
```typescript
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

**Sleep/Delay:**
```typescript
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

### Helper Utilities

**Generate ID:**
```typescript
export function generateId(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
```

**Is Empty Check:**
```typescript
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}
```

## Animation Patterns

**Natural Ease Timing Function:**
```typescript
export const naturalEase = [0.25, 0.46, 0.45, 0.94] as const;

// Usage with Framer Motion:
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6, ease: naturalEase }}
/>
```

## Component Patterns

### Markdown Content Loading

**Content Types:**
```typescript
export interface PageContent extends MarkdownContent {
  title?: string;
  description?: string;
}

export interface ServiceContent extends MarkdownContent {
  title?: string;
  description?: string;
  priceRange?: string;
  timeline?: string;
}

export interface CaseStudyContent extends MarkdownContent {
  title?: string;
  client?: string;
  industry?: string;
  results?: string;
}
```

**Content Loaders:**
```typescript
export async function getPageContent(slug: string): Promise<PageContent> {
  return getMarkdownContent(slug, 'pages') as Promise<PageContent>;
}

export async function getServiceContent(slug: string): Promise<ServiceContent> {
  return getMarkdownContent(slug, 'services') as Promise<ServiceContent>;
}

export async function getAllServices(): Promise<ServiceContent[]> {
  return getAllMarkdownContent('services') as Promise<ServiceContent[]>;
}
```

## Design Patterns

### Component Structure Patterns

**Section Components:**
- Hero sections with staggered animations
- Features sections with icon-driven design
- Testimonial sections with social proof
- CTA sections with urgency messaging
- Location/experience sections

**Layout Patterns:**
- Grid layouts (responsive: 3-col → 2-col → 1-col)
- Card-based layouts with consistent spacing
- Full-width background sections with overlays
- Sticky navigation patterns

### Animation Patterns

**Staggered Entrance:**
```typescript
// Hero section staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: naturalEase,
    },
  },
};
```

**Scroll-Triggered Animations:**
```typescript
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={variants}
>
  {/* Content */}
</motion.div>
```

## Best Practices

### When Adapting These Patterns

1. **Respect Design Language:**
   - Use patterns as structure guides
   - Adapt colors, spacing, typography to project design system
   - Maintain project-specific visual identity

2. **Keep Utilities Generic:**
   - Formatting utilities are universal
   - Performance utilities work across projects
   - Helper functions are framework-agnostic

3. **Component Patterns:**
   - Extract structure and logic
   - Replace styling with project design tokens
   - Maintain accessibility patterns

4. **Animation Patterns:**
   - Timing functions can be reused
   - Adapt easing curves to project feel
   - Maintain performance considerations

## Integration Notes

These patterns are extracted from lostmonster but made universal:
- ✅ Utilities are framework-agnostic
- ✅ Component patterns show structure, not styling
- ✅ Animation patterns use standard libraries
- ✅ Content patterns are CMS-agnostic

**Remember:** Use these as guides and adapt to your project's design language and requirements.











