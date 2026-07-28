---
"@kar-mi/spirit-vale-tools-capture": patch
---

Resolve `Recover_C` (and other RPCs sharing a wire hash + packet kind across behaviour types, e.g. `HealthComponent` vs. `SkillsComponent`) using the invariant that a NetworkObject has at most one instance of each behaviour type: if every ambiguous candidate but one is already bound to a different component index on the same object, the remaining candidate is used. Previously such RPCs stayed unresolved (and were silently dropped by consumers) whenever the component's own binding hadn't already been established, which was the common case for `HealthComponent.Recover_C` — the root cause of heal events never appearing in real captures.
