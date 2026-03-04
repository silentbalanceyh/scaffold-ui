---
title: "01 前端开发规则"
filename: "CLAUDE-FRONT.md"
---

# CLAUDE-FRONT — Frontend & Structure Rules Summary

> This document is a distilled summary of **frontend, structure, and requirement** Cursor rules (non–r2-backend-\*) for use in work-claude. All listed rules have **`alwaysApply: true`**: they are always in effect for frontend, .r2mo layout, and requirement authoring. The canonical definitions live in `.cursor/rules/*.mdc`; this file gives an AI enough context to reason correctly from the summary alone.

---

## Core rule: Missing .mdc files

**When using this document or following the index:** Referenced `.mdc` files (e.g. under `.cursor/rules/`) **may not exist** in the current workspace (e.g. rules not installed or different project layout). When processing:

- **If a referenced .mdc file does not exist:** Treat that rule as absent; ignore it and continue. Do not error, block, or assume the file will appear later.
- **Rely on this .md summary** for behavior when the corresponding .mdc is missing; the summaries in this file are self-contained enough to apply without the .mdc.

---

## 1. Index (Rule Paths After Install)

| Rule file | Purpose | Full path |
| :--- | :--- | :--- |
| r2-frontend-rust | Rust frontend (Leptos/Tauri/Tailwind) dev & conventions | [.cursor/rules/r2-frontend-rust.mdc](.cursor/rules/r2-frontend-rust.mdc) |
| r2-structure-r2mo | .r2mo directory semantics, source-of-truth, output locations | [.cursor/rules/r2-structure-r2mo.mdc](.cursor/rules/r2-structure-r2mo.mdc) |
| r2-structure-requirement | Requirement doc templates & authoring (module/page) | [.cursor/rules/r2-structure-requirement.mdc](.cursor/rules/r2-structure-requirement.mdc) |
| r2-structure-src | Repo src / src-tauri layout, tech stack, output locations | [.cursor/rules/r2-structure-src.mdc](.cursor/rules/r2-structure-src.mdc) |

---

## 2. Why “Always-Applied” Matters

Each rule’s `.mdc` has **`alwaysApply: true`**. For an AI:

- **Assume these rules apply** whenever you work on frontend code, `.r2mo` paths, or requirement documents (module/page), unless the user explicitly says otherwise.
- **Do not** invent APIs, models, or UI behavior not backed by requirements or `.r2mo`; do not write requirement output under `/.r2mo/requirements/` unless explicitly asked.
- When in doubt, **prefer the full .mdc** via the index; this doc is a shortcut, not a replacement.

---

## 3. r2-frontend-rust — Rust Frontend Guide

**Official description:** Core development guide for Rust frontend tasks (code/run/build/debug) with .r2mo as source-of-truth.

**Always-applied:** Yes. Applies to any Rust UI work (Leptos, Tauri, Trunk) in this repo.

### Summary for AI

- **Tech stack:** Leptos (CSR), Tauri, Tailwind, Trunk. Entry: `main.rs` → `app.rs`; routing in `app.rs` and `src/pages/mod.rs`.
- **Source of truth (read first):** Module requirements `src/pages/{module}/requirement.module.md`, page requirements `src/pages/{module}/{page}/requirement.page.md`, `metadata.yaml`, `page.yaml`; API/domain under `/.r2mo/api/**`, `/.r2mo/domain/**`; design under `/.r2mo/design/spec.md`, `spec-page.md`. If something is missing, mark TBD and ask—**do not invent** endpoints, models, or UI rules.
- **Workflow:** Read requirements and annotations (`@REQ`, `@API`, `@MODEL`, `@DICT`, `@LIFECYCLE`) → define types in `src/models/` from .r2mo → implement API client in `src/api/` (e.g. Tauri `invoke!`, return `Result<T, AppError>`) → implement page in `src/pages/{module}/{page}/view.rs` with lifecycle and state → reuse via `src/components/` → style with Tailwind per design tokens.
- **Page layout:** Each module under `src/pages/{module}/` has `mod.rs`, `view.rs`, `metadata.yaml`, `menu.yaml`, `requirement.module.md`, and per-page dirs with `view.rs`, `page.yaml`, `requirement.page.md`.
- **Run/build:** `trunk serve --port 6100`, `trunk build --release`; `cargo tauri dev`, `cargo tauri build`. Checks: `cargo check`, `cargo test`, `cargo clippy --all-targets --all-features`, `cargo fmt --all`.
- **Strict rules:** No `panic`/`unwrap()`/`expect()` in UI paths; use `Result<T, AppError>` and user-facing messages; use signals for local state and `create_resource` for async; **always** handle loading, error, and empty states; keep Tailwind class order consistent (layout → size → spacing → type → color → state).

---

## 4. r2-structure-r2mo — .r2mo Structure

**Official description:** Framework-level semantic map for the .r2mo workspace root. Explains roles, source-of-truth locations, and generation rules for any project in this framework.

**Always-applied:** Yes. Applies whenever you read or write paths under `.r2mo/` or refer to “source of truth” for API, design, or requirements.

### Summary for AI

- **Roles:** Configuration, API, Requirements, Design, Domain, Data; cache/backup dirs are not authoritative.
- **Key dirs:** `/.r2mo/api/` (OpenAPI metadata, `components/schemas`, `operations`); `/.r2mo/design/` (`spec.md`, `spec-page.md`); `/.r2mo/domain/` (`*.proto`); `/.r2mo/data/dbdict/`; `/.r2mo/requirements/` (project/module/page **templates** and raw requirements—**read-only** for analysis unless explicitly instructed); `/.r2mo/database/<DB_TYPE>/` (SQL scripts); `app.env`, `vertx.yml`, etc.
- **Output location (critical):** **Do not** write requirement documents to `/.r2mo/requirements/` unless the user explicitly asks. **Write** module requirements to `src/pages/{module}/requirement.module.md` and page requirements to `src/pages/{module}/{page}/requirement.page.md`. Treat `/.r2mo/requirements/` as reference/template only.

---

## 5. r2-structure-requirement — Requirement Authoring

**Official description:** Strict requirement authoring guide for .r2mo specification documents. Enforces template compliance for module and page requirements with zero scope creep.

**Always-applied:** Yes. Applies whenever you create or edit `requirement.module.md` or `requirement.page.md`.

### Summary for AI

- **Templates:** Module requirements must match `/.r2mo/requirements/project-module.md` **exactly**; page requirements must match `project-page.md`. No extra sections, no renumbering, no removing required sections. The only section where you may add project-specific content beyond the template is **Improvement Items** (module §9, page §13).
- **Module sections:** Module Overview (ID, purpose, boundaries), Functional Requirements (features, business rules), Data Requirements (models from `@MODEL`, dictionaries), API Requirements (endpoints from `@API`), UI Requirements (navigation, pages from `@PAGE`), Non-Functional (performance, security, compatibility), Acceptance Criteria, Dependencies, Improvement Items.
- **Page sections:** Page Overview (ID from `page.yaml`, purpose, user stories), Layout, Components, Lifecycle (from `@LIFECYCLE`), Data (models, dictionaries), API Integration (endpoints from `@API`, loading states), User Interactions (actions, validations), Styling & Design, Accessibility, Performance, Acceptance Criteria, Dependencies, Improvement Items.
- **Authoring:** Pull @API, @MODEL, @DICT, @LIFECYCLE from `metadata.yaml` / `page.yaml`; validate that referenced APIs, schemas, and dicts exist before writing; use measurable wording (e.g. response time, coverage); **do not** put implementation details (e.g. “use Leptos create_signal”) in requirements—describe behavior and outcomes instead.

---

## 6. r2-structure-src — Repo Source Structure

**Official description:** Project structure guide for extracting source-of-truth layout, tech stack, and risks from this repository.

**Always-applied:** Yes. Applies when you reason about where files live (src, src-tauri, pages, components) or where to put new code/requirements.

### Summary for AI

- **Tech stack:** Rust 2024, Leptos, Trunk, Tauri, Tailwind; web entry `main.rs` → `app.rs`; routing in `pages/mod.rs`; Tauri in `/src-tauri/`.
- **Top-level dirs:** `/src/api/`, `/src/components/`, `/src/context/`, `/src/models/`, `/src/pages/`, `/src/service/`, `/src/utils/`. Pages and modules live under `/src/pages/<module>/` with per-page subdirs.
- **Module:** Each `src/pages/<module>/` has `metadata.yaml` (annotations: @REQ, @PAGE, @API, @MODEL, @DESIGN) and **output** `requirement.module.md`. Optional `api.yaml`, `schemas.yaml`.
- **Page:** Each page dir (e.g. `src/pages/<module>/page-name/`) has `page.yaml` (annotations: @METADATA, @DICT, @LAYOUT, @LIFECYCLE) and **output** `requirement.page.md`.
- **Requirement output (critical):** Write module requirements only to `src/pages/{module}/requirement.module.md` and page requirements only to `src/pages/{module}/{page}/requirement.page.md`. Do **not** write to `/.r2mo/requirements/` during normal analysis or authoring.

---

## 7. How to Use This Document

- **Frontend or requirement tasks:** Assume all four rules above apply. Use this summary to choose paths, templates, and behavior; open the indexed `.mdc` files when you need full section lists, examples, or anti-patterns.
- **Cross-team:** API and domain models are defined in `.r2mo`; keep requirement docs and `metadata.yaml` / `page.yaml` annotations aligned with those specs.
