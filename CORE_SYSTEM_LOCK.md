# DELIONARYO CORE SYSTEM LOCK

Status: LOCKED
Version: 1.0
Date: 2026-09-09

## Core roles

- Income Generator = owner command, settlement, treasury, revenue and system control.
- Pending Approver = independent verification and approval layer for pending value-release workflows.
- DELIONARYO Wallet = authenticated member value, consent and execution layer.

## Locked two-party control

Approval and activation are separate actions when a workflow requires two-party control.

For DELIONARYO Credit:
1. Member submits application from Wallet.
2. Pending Approver reviews and verifies/rejects/flags the application.
3. Verified status becomes READY TO ACTIVATE in the authenticated member Wallet.
4. Member clicks ACTIVATE NOW. No activation code is sent or entered.
5. Backend confirms prior approval + member activation before status becomes ACTIVE.
6. Stage 1 ACTIVE credit may be used only in the enabled Library credit catalog.

## System-wide wiring rule

All DELIONARYO apps must use the same authenticated member identity and shared backend records for balances, approvals, entitlements, orders, credit, cashback and settlement where applicable. An app may present its own UI, but it must not create a parallel source of truth that bypasses the core system.

Available central routes are exposed through `api/app-router.ts`, including Main, Campus, Marketplace, Wallet, Income Generator, Pending Approver, Payment Center, Nation, DPBS, Expense Tracker, Money Flow, Business Calculator, Dreamer Consultant, Digital Library, Video Factory, Video Uploader and DELIONARYO AI.

## Non-bypass rules

- No app may release DLC, credit, cashback, product access or settlement by front-end state alone.
- Pending verification must resolve through the approved backend workflow.
- Wallet execution must be bound to the authenticated member.
- Income Generator remains private owner/admin control.
- Pending Approver remains a verifier/staff control surface.
- Member-facing apps must never expose owner/admin functions.
- Ledger/history records are audit records and must not be silently rewritten from client UI.

## Change control

This core architecture is locked. Future changes may extend functions, routes and UX, but must preserve separation of owner control, independent approval and member execution unless the owner explicitly approves a new architecture.
