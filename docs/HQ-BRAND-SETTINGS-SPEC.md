# Slydes HQ — Brand & Settings Spec

> **Purpose**: Define what Brand and Settings pages contain, who they serve, and how they integrate with the HQ ecosystem.
>
> **Sources of truth**:
> - `PAY-TIERS.md` (Free vs Creator gating)
> - `MVP-MONETISATION.md` (upgrade triggers)
> - `BRAND-GUIDELINES.md` (Slydes brand reference)
> - `HQ-DASHBOARD-ANALYTICS-SPEC.md` (HQ architecture)
> - `CONSTX.md` (visual consistency)

---

## 1) Brand Page

### Purpose
Let businesses customize how their Slydes look and feel — within guardrails that maintain quality.

### Who uses this
- **SMB owner**: Wants their logo and colors to show up
- **Real estate agent**: Needs brand consistency across property Slydes
- **Creator**: Wants a cohesive visual identity

### Tier gating

| Feature | Free | Creator |
|---------|------|---------|
| Logo upload | ✓ | ✓ |
| Brand colors (primary) | ✓ | ✓ |
| Brand colors (secondary) | ✗ | ✓ |
| Custom fonts | ✗ | ✓ |
| Voice/tone presets | ✗ | ✓ |

### Sections

#### A) Logo & Identity
- **Logo upload**: Square format, min 200×200px, max 2MB
- **Business name**: Text field (appears in profile pill, about sheet)
- **Tagline**: One-liner (optional, max 60 chars)
- **Preview**: Live preview of how logo appears in Slyde

#### B) Colors
- **Primary color**: Main brand color (buttons, accents)
  - Color picker with hex input
  - Auto-contrast check (accessibility)
- **Secondary color** (Creator only): Supporting color
- **Preview**: Mini Slyde preview showing colors in action

#### C) Typography (Creator only)
- **Display font**: Choose from curated list (5-6 options)
  - Space Grotesk (default)
  - Inter
  - DM Sans
  - Plus Jakarta Sans
  - Outfit
- **Body font**: Paired automatically based on display choice
- **Preview**: Text sample showing font pairing

#### D) Voice & Tone (Creator only)
Presets that influence AI-generated copy suggestions:
- **Professional**: Formal, trustworthy, clean
- **Friendly**: Warm, approachable, conversational
- **Bold**: Confident, direct, energetic
- **Minimal**: Short, punchy, no fluff

### Design notes
- Use progressive disclosure: Basic settings visible, advanced behind "Customize more"
- Show live preview throughout
- Save button at bottom (or auto-save with confirmation)

---

## 2) Settings Page

### Purpose
Manage account, billing, and integrations. The "admin" area.

### Who uses this
- **Account owner**: Managing subscription
- **Power user**: Setting up webhooks, exports
- **Anyone**: Updating profile, password

### Sections

#### A) Account
- **Profile**
  - Name
  - Email (with change flow)
  - Avatar (optional)
  - Password change
- **Notifications** (future)
  - Email preferences
  - Weekly summary on/off

#### B) Plan & Billing
- **Current plan**: Free or Creator
  - Visual card showing plan name, features, price
  - "Upgrade to Creator" CTA (if Free)
  - "Manage subscription" (if Creator)
- **Billing history** (Creator only)
  - List of invoices
  - Download PDF
- **Payment method** (Creator only)
  - Card on file (last 4 digits)
  - Update payment method
- **Cancel subscription** (Creator only)
  - Soft gate: "Are you sure?"
  - Reason capture (optional)
  - Downgrade to Free

#### C) Integrations (Creator only)
- **Webhooks**
  - Endpoint URL
  - Events to send: `enquiry.new`, `slyde.published`, `slyde.viewed`
  - Test webhook button
  - Secret key for verification
- **Export**
  - Export enquiries (CSV)
  - Export analytics (CSV)
- **API access** (future, not MVP)
  - API key management
  - Rate limits display

#### D) Danger Zone
- **Delete account**
  - Requires email confirmation
  - Explains what happens (Slydes unpublished, data deleted)
  - 30-day recovery window

### Tier gating

| Feature | Free | Creator |
|---------|------|---------|
| Account settings | ✓ | ✓ |
| Plan display | ✓ | ✓ |
| Upgrade CTA | ✓ | — |
| Billing history | ✗ | ✓ |
| Payment method | ✗ | ✓ |
| Webhooks | ✗ | ✓ |
| Export | ✗ | ✓ |
| Delete account | ✓ | ✓ |

---

## 3) Navigation Updates

### Current sidebar
```
Dashboard
Slydes ← active indicator
Analytics (Locked on Free)
Inbox
```

### Updated sidebar
```
Dashboard
Slydes
Analytics (Locked on Free)
Inbox
─────────────── (divider)
Brand
Settings
```

### Collapsible sidebar
- Toggle button in sidebar header (hamburger or chevron)
- Collapsed state: Icons only, ~64px width
- Expanded state: Full labels, 288px width (current)
- Persist preference in localStorage
- On mobile: Overlay drawer instead of inline

---

## 4) URL Structure

```
/hq/dashboard     → Dashboard
/hq/slydes        → Slydes management
/hq/analytics     → Analytics (gated)
/hq/inbox         → Enquiries
/hq/brand         → Brand settings
/hq/settings      → Account & billing
/hq/settings/billing → Deep link to billing section
```

For demo:
```
/demo/hq-dashboard
/demo/hq-mockup (Slydes)
/demo/hq-analytics
/demo/hq-inbox
/demo/hq-brand      ← NEW
/demo/hq-settings   ← NEW
```

---

## 5) Brand Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Brand Settings                                              │
│  Customize how your Slydes look and feel                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────┐   │
│  │  LOGO & IDENTITY        │  │  LIVE PREVIEW           │   │
│  │                         │  │                         │   │
│  │  [Logo upload zone]     │  │  ┌─────────────────┐   │   │
│  │                         │  │  │   Mini Slyde    │   │   │
│  │  Business name          │  │  │   showing       │   │   │
│  │  [____________]         │  │  │   current       │   │   │
│  │                         │  │  │   brand         │   │   │
│  │  Tagline (optional)     │  │  │   settings      │   │   │
│  │  [____________]         │  │  └─────────────────┘   │   │
│  └─────────────────────────┘  └─────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  COLORS                                                  ││
│  │                                                          ││
│  │  Primary color          Secondary color (Creator)        ││
│  │  [■ #2563EB]           [■ #06B6D4] 🔒                   ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  TYPOGRAPHY (Creator)                          🔒        ││
│  │                                                          ││
│  │  Display font: [Space Grotesk ▼]                        ││
│  │  Preview: "Your headline here"                          ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  VOICE & TONE (Creator)                        🔒        ││
│  │                                                          ││
│  │  ○ Professional  ● Friendly  ○ Bold  ○ Minimal          ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│                                    [Save changes]            │
└─────────────────────────────────────────────────────────────┘
```

---

## 6) Settings Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Settings                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─ ACCOUNT ────────────────────────────────────────────────┐
│  │                                                          │
│  │  Profile                                                 │
│  │  ┌──────────────────────────────────────────────────┐   │
│  │  │  [Avatar]  James                                  │   │
│  │  │            james@wildtrax.com                     │   │
│  │  │            [Edit profile]                         │   │
│  │  └──────────────────────────────────────────────────┘   │
│  │                                                          │
│  │  Security                                                │
│  │  Password: ••••••••  [Change]                           │
│  │                                                          │
│  └──────────────────────────────────────────────────────────┘
│                                                              │
│  ┌─ PLAN & BILLING ─────────────────────────────────────────┐
│  │                                                          │
│  │  ┌──────────────────────────────────────────────────┐   │
│  │  │  Creator Plan                        £25/month   │   │
│  │  │  ────────────────────────────────────────────── │   │
│  │  │  ✓ Up to 10 Slydes                              │   │
│  │  │  ✓ No watermark                                 │   │
│  │  │  ✓ Analytics                                    │   │
│  │  │  ✓ Webhooks & export                            │   │
│  │  │                                                  │   │
│  │  │  [Manage subscription]                           │   │
│  │  └──────────────────────────────────────────────────┘   │
│  │                                                          │
│  │  Payment method                                          │
│  │  Visa ending in 4242  [Update]                          │
│  │                                                          │
│  │  Billing history                                         │
│  │  Dec 1, 2025 - £25.00  [Download]                       │
│  │  Nov 1, 2025 - £25.00  [Download]                       │
│  │                                                          │
│  └──────────────────────────────────────────────────────────┘
│                                                              │
│  ┌─ INTEGRATIONS (Creator) ─────────────────────────────────┐
│  │                                                          │
│  │  Webhooks                                                │
│  │  Endpoint: [https://your-site.com/webhook]              │
│  │  Events: ☑ enquiry.new  ☑ slyde.published               │
│  │  [Test webhook]  [Save]                                 │
│  │                                                          │
│  │  Export                                                  │
│  │  [Export enquiries (CSV)]  [Export analytics (CSV)]     │
│  │                                                          │
│  └──────────────────────────────────────────────────────────┘
│                                                              │
│  ┌─ DANGER ZONE ────────────────────────────────────────────┐
│  │                                                          │
│  │  Delete account                                          │
│  │  Permanently delete your account and all Slydes.        │
│  │  This action cannot be undone.                          │
│  │                                                          │
│  │  [Delete my account]                                    │
│  │                                                          │
│  └──────────────────────────────────────────────────────────┘
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 7) Free vs Creator States

### Brand Page (Free user)
- Logo & Identity: Fully functional
- Colors: Primary only, secondary locked with upgrade prompt
- Typography: Locked section with upgrade prompt
- Voice & Tone: Locked section with upgrade prompt

### Settings Page (Free user)
- Account: Fully functional
- Plan & Billing: Shows "Free Plan" with upgrade CTA
- Integrations: Locked section with upgrade prompt
- Danger Zone: Fully functional

### Upgrade prompts (align with MVP-MONETISATION.md)
- Contextual, not interruptive
- Copy: "Available on Creator" + feature benefit
- CTA: "Upgrade to Creator"
- Secondary: "Continue with Free" or dismiss

---

## 8) Implementation Priority

### Phase 1 (Now)
1. Add Brand and Settings to sidebar nav (all HQ pages)
2. Make sidebar collapsible
3. Build Brand page mockup
4. Build Settings page mockup

### Phase 2 (Later)
1. Wire up actual brand customization (Supabase)
2. Stripe billing integration
3. Webhook implementation
4. Export functionality

---

## 9) Fact-check matrix

| Feature | Allowed? | Source |
|---------|----------|--------|
| Logo upload (Free) | ✓ | Reasonable MVP feature |
| Primary color (Free) | ✓ | Reasonable MVP feature |
| Secondary color (Creator) | ✓ | Tier differentiation |
| Custom fonts (Creator) | ✓ | Tier differentiation |
| Billing via Stripe | ✓ | `PAY-TIERS.md`, `SLYDES-PRD.md` |
| Webhooks (Creator) | ✓ | `HQ-DASHBOARD-ANALYTICS-SPEC.md` |
| Export (Creator) | ✓ | `HQ-DASHBOARD-ANALYTICS-SPEC.md` |
| API access | Future | Not MVP |

---

*Last updated: December 14, 2025*








