# 1. Slydes – What We Will Never Build

## Purpose
This document defines the hard constraints that protect Slydes from dilution.
It exists to make saying "no" easy and consistent.

If a feature violates this list, it does not ship.

---

## We Will Never Build

### ❌ Traditional multi-page websites
- No page trees
- No navigation menus
- No site maps

Pages are a desktop mental model.
Slydes is a flow.

---

### ❌ A general-purpose CMS
- No blogs
- No long-form content engines
- No SEO optimisation tooling

SEO rewards depth and text.
Slydes rewards momentum and motion.

---

### ❌ Desktop-first experiences
- No designing for desktop and adapting to mobile later
- No complex desktop layouts

Mobile is the product.
Desktop is a preview.

---

### ❌ "Build anything" flexibility
- No blank canvas promises
- No extreme theming
- No hundreds of settings per component

Constraint creates clarity.
Clarity converts.

---

### ❌ Social network mechanics
- No feeds
- No likes (as a social mechanic)
- No comments
- No followers

Slydes is a destination, not a platform competing for attention.

#### ✅ Allowed: conversion signals (not social mechanics)
We *can* use lightweight **signals** that help customers decide faster, as long as they **do not create a social loop**.

- **Hearts + aggregate count** are allowed as a **conversion signal** (e.g. “2.4k”)
  - **Business-controlled**: can be enabled/disabled per Slyde (and optionally per slide)
  - **No social graph**: no public profiles, no followers, no feeds
  - **No interaction loops**: no comments, no ranking battles, no “trending” surfaces
  - **No vanity dashboards**: we measure behaviour (completion, actions), not popularity

Rule: if a “heart” feature starts to behave like social media (competition, feeds, identity, engagement loops), it’s out.

---

### ❌ CRM or marketing automation systems
- No pipelines
- No email campaigns
- No dashboards pretending to be Salesforce

Slydes plugs into stacks.
It does not replace them.

#### ✅ Allowed: enquiry capture (lead intake) — not a CRM
We **can** collect customer details when a user has intent (e.g. property enquiry, booking request) as long as it stays a **simple intake** layer.

- ✅ **Enquiry Frame** at the end of a Slyde (or a dedicated “Enquire” action) that captures:
  - name, email/phone, message, and optional structured fields (date, budget, property ref)
- ✅ **Enquiry inbox** (read + export) and/or **webhooks** to push enquiries into the business’s existing CRM
- ✅ Notifications (email / push) that a new enquiry arrived

**Hard boundaries (still prohibited):**
- ❌ Pipelines, deal stages, or “move lead to stage”
- ❌ Email sequences / marketing automation
- ❌ Salesforce-style reporting dashboards
- ❌ Anything that incentivises businesses to “manage” leads inside Slydes

Rule: **We capture intent and hand it off.** We do not become the system of record.

---

### ❌ App builder ambitions
- No native app exports
- No app store strategy

The web is the advantage.
Links win.

---

## One-Sentence Rule

If it slows creation, reduces momentum, or turns Slydes into a website, we do not build it.


---

### ❌ App builder ambitions
- No native app exports
- No app store strategy

The web is the advantage.
Links win.

---

## One-Sentence Rule

If it slows creation, reduces momentum, or turns Slydes into a website, we do not build it.


---

### ❌ App builder ambitions
- No native app exports
- No app store strategy

The web is the advantage.
Links win.

---

## One-Sentence Rule

If it slows creation, reduces momentum, or turns Slydes into a website, we do not build it.


---

### ❌ App builder ambitions
- No native app exports
- No app store strategy

The web is the advantage.
Links win.

---

## One-Sentence Rule

If it slows creation, reduces momentum, or turns Slydes into a website, we do not build it.

- No app store strategy

The web is the advantage.
Links win.

---

## One-Sentence Rule

If it slows creation, reduces momentum, or turns Slydes into a website, we do not build it.
