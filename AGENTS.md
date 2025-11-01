## 0) Prime Directives

1. **Context First.** Every task/branch/PR MUST link to a CONTEXT7 record (spec/ticket/ADR). Pull the right documents via Serena MCP before coding.
2. **AWS Only.** Supabase is deprecated. All infra MUST be on AWS (CDK/Terraform, SSM/Secrets Manager, AppConfig, etc.).
3. **Reproducible Commands.** When invoking Node/npm locally or in scripts, **always** load nvm:

   * Prefer wrappers (see the `justfile`/Makefile below) so you never forget.
4. **Measure Twice, Cut Once.** Design > validate > implement. You MUST articulate the minimal design (diagram or pseudo) in the linked context before writing code.
5. **Readable by Others.** Code MUST be self‑explanatory to a new teammate in <10 minutes.

---

## 1) Layering & Roles (never mix concerns)

* **UI logic ➝ ViewModel**
* **Business logic ➝ Manager**
* **Navigation/state flow ➝ Coordinator**
* **Integration ➝ Gateway/Repository (e.g., AWS SDK clients, HTTP, persistence)**

**Rules**

* Views never call network/DB directly.
* Managers don’t know UI types.
* Coordinators own navigation/state orchestration only.
* Gateways isolate external systems (AWS, HTTP, storage).

**Folder example (feature‑centric):**

```
FeatureX/
  UI/
    FeatureXView(.swift/.tsx)
    FeatureXViewModel(.swift/.ts)
  Flow/
    FeatureXCoordinator(.swift/.ts)
  Domain/
    FeatureXManager(.swift/.ts)
    models/
  Data/
    FeatureXRepository(.swift/.ts)
    gateways/ (AWS adapters, HTTP)
  Tests/
```

---

## 2) File & Type Size (enforced)

* **File length:** hard max **500** lines; warn at **400** (split before you hit it).
* **Class/Type length:** review at **200** lines (extract helpers).
* **Function length:** aim ≤ **30** lines, hard cap **40**.
* **Complexity:** cyclomatic ≤ **10** (refactor if exceeded).

> *Why:* Keeps PRs small, increases composability, and slashes review time.

---

## 3) OOP First, Composition Always

* Every functionality lives in a **class/struct/protocol/interface** – even small ones.
* Prefer **composition over inheritance**; inject collaborators via **protocols/interfaces**.
* Design for **reuse**: ask “can I reuse this in another screen/service?” If *no*, refactor.

**Micro‑example (TypeScript)**

```ts
export interface PaymentGateway { charge(cents: number): Promise<Result>; }

export class StripeGateway implements PaymentGateway { /* ... */ }

export class CheckoutManager {
  constructor(private readonly gateway: PaymentGateway) {}
  async checkout(amount: number) { return this.gateway.charge(amount); }
}
```

---

## 4) Single Responsibility Principle (SRP)

* One file/class/function = **one** responsibility.
* If you see “and/then/also” in the docstring, split it.
* Break UI into **View + ViewModel**; split **State**, **Handlers**, **Networking** as separate helpers when they grow.

---

## 5) Naming & Readability

* Names MUST be **descriptive and intention‑revealing**.
* **Avoid:** `data`, `info`, `helper`, `temp`, `utils`.
* **Prefer:** `SessionRefresher`, `ProfileLoader`, `RetryingS3Uploader`, `PurchaseCoordinator`.
* No magic numbers—use `const`/`enum`.
* Public APIs need a 1–2 line docstring with preconditions/invariants.

---

## 6) Scalability Mindset

* Add **extension points from day one** (protocols/interfaces, DI, feature flags).
* All external calls behind interfaces; **no** AWS SDK usage in UI/Managers directly—go through a Gateway.

---

## 7) AWS‑Only Guardrails

* **IaC required** (CDK/Terraform). No click‑ops for persistent resources.
* **Secrets** ➝ AWS Secrets Manager/SSM Param Store. No `.env` with secrets committed.
* **Auth** ➝ Cognito (or your chosen standard), **storage** ➝ S3, **compute** ➝ Lambda/Fargate as appropriate, **events** ➝ EventBridge, **workflows** ➝ Step Functions.
* **Observability**: CloudWatch + structured logs; correlate IDs in logs from UI → Manager → Gateway.
* **SDK usage**: v3 modular clients for JS/TS; narrow wrapper types; retries & backoff centralized.

---

## 8) MCP Usage

* **Serena MCP**: fetch specs, ADRs, prior art from CONTEXT7 **before** coding. Summarize key findings in the PR description.
* **AWS mcp.npm**: prefer orchestrated tasks (scaffold CDK stacks, validate IAM policies) via MCP scripts.
* MCP scripts MUST be reproducible and checked in under `tools/`.

---

## 9) Testing & Quality Gates

* Unit tests required for **Managers** and **ViewModels**. Gateways are tested with fakes/mocks; also add 1–2 integration tests per critical path.
* **Coverage target:** ≥ **80%** on new/changed files (branch coverage where supported).
* Each bug fix adds a **regression test**.
* Performance: watch allocations/latency on hot paths; add quick benchmarks where it matters.

---

## 10) Workflow: “Measure Twice, Cut Once”

**Before coding (≤30 min):**

* Sketch data flow + class diagram (can be ASCII/mermaid) in CONTEXT7.
* Note assumptions and open questions; confirm or bracket them.
* Define 2–3 acceptance tests in Given/When/Then.

**During coding:**

* Scaffold feature folders; create empty interfaces/types first.
* Keep functions small; extract on the spot.

**Before PR:**

* Run `just format && just lint && just test`.
* Check file lengths, function sizes, complexity; split if needed.
* Update/attach ADR if architectural trade‑off was made.

---

## 11) PR Discipline

* **PR size:** aim ≤ **400** added lines; split otherwise.
* PR title: `[Feature] Short verb phrase`
* PR body MUST include:

  * CONTEXT7 link(s)
  * Diagram or pseudo
  * Acceptance checks
  * Risk/rollback plan

**Reviewer checklist**

* [ ] Clear layering (VM/Manager/Coordinator/Gateway)
* [ ] No god classes/files
* [ ] Interfaces + DI used
* [ ] File/function/complexity within limits
* [ ] Tests & observability present
* [ ] AWS usage via Gateways; no secrets committed

---

## 12) Automation (copy/paste ready)

**A) One wrapper to always load nvm**

**justfile** *(preferred; cross‑platform shells via bash -lc)*:

```make
set shell := ["bash", "-lc"]
nvm := "source ~/.nvm/nvm.sh && nvm use --silent"

fmt:
  {{nvm}} && npm run format

lint:
  {{nvm}} && npm run lint

test:
  {{nvm}} && npm test

build:
  {{nvm}} && npm run build

check: fmt lint test
```

*(Alternative: Makefile with the same `nvm` line in each target.)*

**B) ESLint (TypeScript/Node)**

```json
{
  "rules": {
    "max-lines": ["error", 500],
    "max-lines-per-function": ["error", 40],
    "complexity": ["error", 10],
    "max-params": ["error", 4]
  }
}
```

**C) SwiftLint (iOS)**

```yaml
file_length:
  warning: 400
  error: 500
type_body_length:
  warning: 200
function_body_length:
  warning: 30
  error: 40
cyclomatic_complexity:
  warning: 8
  error: 10
```

**D) Husky pre-commit**

```bash
# .husky/pre-commit
#!/usr/bin/env bash
set -euo pipefail
source ~/.nvm/nvm.sh && nvm use --silent
npm run lint
npm test -- --bail
```

**E) GitHub Actions — block merges if limits fail**

```yaml
name: ci
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 'lts/*' }
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
```

---

## 13) Exceptions Policy (so velocity doesn’t stall)

* Temporary deviations MUST be documented in the PR with:

  * Reason, scope, owner, and an **expiry date**.
  * A follow‑up CONTEXT7 ticket to remove the exception.
* “Temporary” files over 500 lines are **not allowed**—split first, then merge.

---

## 14) Quick Reference (stick this in your repo’s README)

**Do**

* Link CONTEXT7. Design first. Keep functions ≤30 lines.
* VM/Manager/Coordinator/Gateway separation.
* Use DI + interfaces. Enforce limits via linters.
* Use AWS via Gateways; IaC for everything.

**Don’t**

* Mix UI and business logic.
* Ship god classes/files.
* Commit secrets or rely on Supabase.
* Run Node/npm without sourcing nvm (use wrappers).

---

### Optional scaffolds (drop into a `templates/` dir)

* `FeatureTemplate/` with empty `ViewModel`, `Manager`, `Coordinator`, `Repository`, tests, and a `README.md` explaining responsibilities.
* `tools/` for Serena MCP scripts and AWS mcp.npm tasks.

---
