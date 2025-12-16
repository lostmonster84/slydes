# Education - Vocabulary & Concepts

> **Purpose**: Reference document for key terms and patterns used throughout Slydes
> **Updated**: December 16, 2025

---

## Core Vocabulary

| Term | Definition | Example |
|------|------------|---------|
| **Recursive** | A pattern that repeats at each level of hierarchy | Lists contain Items, Items contain Frames - same editing pattern at every level |
| **AIDA** | Attention → Interest → Desire → Action - marketing conversion framework | Home Slyde grabs attention, Categories build interest, Lists create desire, CTAs drive action |
| **CONSTX** | Navigator + Preview + Inspector - 3-column layout pattern | Left panel lists items, Center shows phone preview, Right panel has editor |

---

## Architecture Terms

| Term | Definition |
|------|------------|
| **Slyde** | A vertical, swipeable content unit (like a TikTok) |
| **Frame** | A single screen within a Slyde - contains headline, background, CTA |
| **Home Slyde** | The main entry point - shows categories and hero video |
| **Category Slyde** | The frames that play when a category is tapped |
| **Item Slyde** | The frames that play when an inventory item is tapped |
| **List** | A collection of Items (products, services, inventory) |
| **Item** | A single entity in a List with title, price, image, badge |

---

## UI Patterns

| Pattern | Description | Where Used |
|---------|-------------|------------|
| **Dashed Affordance** | Always-visible add button with dashed border | Bottom of all navigator lists |
| **Gradient Selection** | `from-blue-600 to-cyan-500` gradient for selected items | Navigator rows |
| **Hover-Reveal Delete** | Trash icon appears on hover | List/Item rows |
| **Drag-and-Drop** | Native HTML5 drag with custom ghost and drop indicators | All orderable lists |

---

## Editing Levels

The app uses a **recursive editing pattern** where each level has:
- **Navigator** (left) - shows items at current level
- **Preview** (center) - phone mockup showing current context
- **Inspector** (right) - editor for selected item

| Level | Navigator Shows | Preview Shows | Inspector Shows |
|-------|-----------------|---------------|-----------------|
| `home` | Categories | HomeSlydeScreen | Category settings |
| `child` | Category Frames + Lists | SlydeScreen (frames) | Frame editor |
| `list` | Items in list | InventoryGridView | Item details |
| `item` | Item Frames | SlydeScreen (item frames) | Frame editor |

---

## Data Hierarchy

```
HOME SLYDE
├── Categories (max 6)
│   └── Category Frames (unlimited)
│
├── Lists (unlimited)
│   └── Items (unlimited)
│       └── Item Frames (unlimited)
│
└── Settings (video, branding, toggles)
```

---

## Key Principles

### 1. Consistency Over Creativity
Every UI element must match existing patterns. Same gradients, same spacing, same interactions.

### 2. Phone Preview is CONSTANT
No matter what level you're editing, the phone mockup stays in the center. Navigator and Inspector adapt.

### 3. Studio is Master
The main Studio (`/`) is the one-screen experience where users can edit everything. Other pages (`/lists`, `/slydes`) are shortcuts.

### 4. Practice What We Preach
Our editor should feel as smooth and polished as the Slydes our users create.

---

*Document Status: Living Reference*
*This document evolves as new concepts are added*
