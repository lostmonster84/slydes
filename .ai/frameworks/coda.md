# CODA Planning Framework

> **Universal across all projects**
> A critical thinking framework that structures complex work to reduce iteration waste and improve outcomes.

## What is CODA?

**C**ontext - **O**bjective - **D**etails - **A**cceptance

A **thinking methodology** (not a documentation ritual) that ensures quality outcomes through structured analysis.

**IMPORTANT:** CODA is a mental framework for critical thinking. You don't need to write a formal document every time - think through these dimensions and present your understanding conversationally.

## When to Use CODA

✅ **Use CODA for:**
- New features or major UI sections
- Complex layouts or animations
- Design system changes
- Anything requiring 3+ coordinated changes
- Work where requirements aren't crystal clear
- Tasks that need documentation

❌ **Skip CODA for:**
- Simple bug fixes or typos
- Single-file text updates
- Obvious, trivial tasks
- Emergency hotfixes

## CODA Template

**C - CONTEXT**
*"What's the situation? What already exists?"*
- Current state of system/component
- Existing design system (colors, fonts, spacing, components)
- Technical constraints (performance, browser support, dependencies)
- Where this fits in the codebase (file paths, related components)
- Why this work is needed (problem statement)

**O - OBJECTIVE**
*"What are we building and why?"*
- Primary goal (the "what")
- Secondary goals (nice-to-haves)
- Why this matters (user/business value)
- What success looks like

**D - DETAILS**
*"How exactly should this work?"*
- Visual specifications (colors, typography, spacing values)
- Layout structure (ASCII diagrams helpful)
- Interaction patterns (animations, hover states, transitions)
- Technical approach (which files, which components, which APIs)
- Responsive behavior (breakpoints: mobile/tablet/desktop)
- Performance considerations (lazy loading, bundle size, caching)
- Accessibility requirements (WCAG, keyboard nav, screen readers)
- Error handling and edge cases

**A - ACCEPTANCE**
*"How do we know it's done correctly?"*
- Success metrics (specific, measurable criteria)
- Testing checklist (browsers, devices, edge cases)
- Performance benchmarks (load time, bundle size, FPS)
- Accessibility validation (automated + manual testing)
- Security considerations (if applicable)
- Definition of done

## CODA Workflow

### Light CODA (Default)
**For most tasks - think in CODA dimensions, communicate conversationally:**

1. **THINK**: Analyze the task through CODA lens (Context → Objective → Details → Acceptance)
2. **PRESENT**: Share your understanding conversationally: "Here's what I understand... Here's my approach... Here's how we'll verify success..."
3. **ITERATE**: Get feedback, refine thinking
4. **EXECUTE**: Implement once understanding is aligned

**Example:**
> "I see we need to add filtering to the properties page (context). The goal is to help users find specific properties quickly (objective). I'm thinking a sidebar filter with property type, location, bedrooms, and budget, filtering cards client-side with a smooth animation (details). We'll verify it works across mobile/desktop and matches our design system (acceptance). Sound good?"

### Heavy CODA (When Explicitly Needed)
**Only write formal CODA document when:**
- User explicitly requests a plan document
- Stakeholder alignment required (multiple decision-makers)
- Future reference needed (major architectural decisions)
- Regulatory/compliance documentation required

For heavy CODA, follow the full template at the bottom of this document.

## Why CODA Works

**"Measure twice, cut once"** - but for software:

- **Catches issues early**: Problems discovered in planning, not after coding
- **Reduces wasted work**: No implementing features that get scrapped
- **Shared understanding**: User sees full picture before execution
- **Better outcomes**: Thinking through details reveals superior solutions
- **Built-in documentation**: CODA plan becomes permanent project record
- **Maintains consistency**: Forces consideration of design system, patterns, conventions

## Example: CODA in Action

❌ **Without CODA:**
```
User: "Add a new feature to the dashboard"
AI: [Immediately codes a solution]
User: "That approach doesn't fit our design system"
AI: [Refactors]
User: "The animation is too aggressive"
AI: [Adjusts]
User: "This breaks on mobile"
AI: [Fixes responsive]
Result: 4+ iterations, wasted effort, inconsistent patterns
```

✅ **With CODA:**
```
AI: [Writes detailed CODA plan covering approach, design, responsive, animation]
User: "The animation seems aggressive - tone it down"
AI: [Updates plan with subtler animation specs]
User: "Perfect, let's proceed"
AI: [Implements once, correctly]
Result: All iteration in planning phase, implementation is clean
```

## Integration with Standard Workflow

**Enhanced workflow:**

1. Think through the problem, read codebase for context
2. **For complex tasks: Write CODA plan to projectplan.md**
3. **Present CODA plan and get user approval**
4. **Iterate on plan based on feedback**
5. Begin implementation only after plan is approved
6. Make every change as simple as possible
7. Provide high-level explanations as you work
8. Complete review section in projectplan.md

## CODA Best Practices

**In CONTEXT:**
- Reference specific files, line numbers, and components
- List existing design tokens/patterns (don't guess values)
- Explain limitations of current approach
- Note dependencies and related systems

**In OBJECTIVE:**
- Be specific about success (not "make it better" - define "better")
- Clarify primary vs secondary goals (prevents scope creep)
- State constraints upfront (time, performance, browser support)
- Define who benefits and how

**In DETAILS:**
- Use exact values (specific spacing, colors, font sizes)
- Include ASCII diagrams for complex layouts
- Specify animations with duration, easing functions, triggers
- Call out responsive breakpoints explicitly
- Think through accessibility from the start (not as afterthought)
- Document API contracts and data shapes
- Consider error states and loading states

**In ACCEPTANCE:**
- Make criteria testable and measurable
- Include negative criteria ("must NOT do X")
- Define "done" clearly (prevents endless refinement)
- Specify testing requirements (unit, integration, e2e)
- List compatibility requirements (browsers, devices, screen readers)

## CODA Anti-Patterns (Avoid These)

❌ Writing CODA but not getting user feedback before coding
❌ Skipping CODA for "obviously simple" tasks that turn complex
❌ Using vague language ("modern", "better", "nicer", "cleaner")
❌ Forgetting accessibility, performance, or security sections
❌ Not iterating on the plan (CODA's value is in refinement!)
❌ Treating CODA as bureaucracy instead of thinking tool
❌ Making assumptions about requirements instead of asking
❌ Omitting edge cases and error handling

## Real-World CODA Template

Here's a complete example showing all sections:

```markdown
# CODA Plan: [Feature Name]

## C - CONTEXT
**Current State:**
- File: `/path/to/component.tsx` lines 45-120
- Current implementation uses X approach
- Design system: Brand colors (#ABC123), Inter font, 8px spacing scale
- Related components: ComponentA, ComponentB
- Known issues: Performance lag on mobile, accessibility gaps

**Why This Work:**
- User feedback: "Feature is confusing"
- Analytics: 60% bounce rate on this page
- Business goal: Increase engagement by 20%

## O - OBJECTIVE
**Primary Goal:**
Build intuitive [feature] that reduces bounce rate to <40%

**Secondary Goals:**
- Improve mobile experience
- Meet WCAG AA standards
- Reduce bundle size by 10kb

**Success Looks Like:**
- Users complete task in <30s (vs current 2min)
- 95% accessibility score
- Positive user feedback in testing

## D - DETAILS
**Visual Design:**
- Layout: [ASCII diagram]
- Colors: Primary (#ABC123), Secondary (#DEF456)
- Typography: Inter 16px body, 24px headings, 1.5 line-height
- Spacing: 16px gap between items, 32px section padding
- Shadows: subtle (0 2px 8px rgba(0,0,0,0.1))

**Interactions:**
- Hover: Lift 2px, add shadow
- Animation: 200ms ease-in-out transitions
- Loading state: Skeleton screens (no spinners)
- Error state: Inline messages with retry action

**Technical Approach:**
- Files to modify: `feature.tsx`, `utils.ts`, `types.ts`
- New dependencies: None (use existing libs)
- API changes: Add `GET /api/feature` endpoint
- State management: Use existing Context API

**Responsive:**
- Desktop (>1024px): 3-column grid
- Tablet (768-1024px): 2-column grid
- Mobile (<768px): Single column, stack elements

**Performance:**
- Lazy load images below fold
- Code split route (+15kb async chunk)
- Debounce search input (300ms)
- Cache API responses (5min TTL)

**Accessibility:**
- Keyboard navigation: Tab order, Enter/Space actions
- Screen readers: ARIA labels, live regions for updates
- Focus management: Trap focus in modals, visible indicators
- Color contrast: 4.5:1 minimum (WCAG AA)

## A - ACCEPTANCE
**Success Metrics:**
- ✅ Feature reduces task completion time to <30s
- ✅ Lighthouse accessibility score >95
- ✅ Works in Chrome, Safari, Firefox (last 2 versions)
- ✅ Mobile responsive (tested iPhone SE, iPad, desktop)
- ✅ Bundle size increase <15kb gzipped
- ✅ No console errors or warnings
- ✅ Passes automated accessibility audit (axe, WAVE)

**Testing Checklist:**
- [ ] Unit tests for new utils
- [ ] Integration tests for API calls
- [ ] Manual testing on 3 browsers
- [ ] Mobile device testing (real devices)
- [ ] Keyboard-only navigation test
- [ ] Screen reader test (VoiceOver/NVDA)
- [ ] Performance audit (Lighthouse)

**Definition of Done:**
- Code reviewed and approved
- Tests passing (coverage >80%)
- Documentation updated
- Deployed to staging, verified working
- User acceptance testing completed
```

## CODA Variations by Task Type

**For UI Components:**
- Heavy emphasis on visual specs, states (default/hover/active/disabled)
- Props API, variants, accessibility patterns
- Storybook/demo requirements

**For Features:**
- User flows, state management approach
- API contracts, data shapes, error handling
- Analytics/tracking requirements

**For Refactors:**
- Migration strategy, backward compatibility
- Performance before/after metrics
- Rollback plan if issues arise

**For Bug Fixes (if complex):**
- Root cause analysis
- Why current approach fails
- Test cases to prevent regression

## Summary

**CODA = Better outcomes through structured thinking**

Think of it as:
- **Mental checklist** before taking action
- **Conversation starter** to align understanding
- **Quality filter** that catches issues early

**Default mode:** Think in CODA dimensions, communicate conversationally
**Formal mode:** Write detailed document only when explicitly needed

Use CODA thinking for anything non-trivial. The 2 minutes spent thinking saves hours of refactoring.

**Key Philosophy:**
*"It's easier to change understanding than to change code. Align on thinking before implementing."*
