# Assumptions Log — Selena Systems GTM Package

Every assumption made during this research is logged here. Items are updated as research confirms or contradicts them. Anything not listed here and not carrying a source in the deliverables should be treated as authored strategy (opinion), not fact.

## Founder & business assumptions

| # | Assumption | Why it was made | Risk if wrong |
|---|-----------|-----------------|---------------|
| A1 | The founder is a solo operator (or near-solo) with strong enough technical skill to build AI automations on tools like Make/n8n/Zapier, OpenAI/Claude APIs, WhatsApp Business API, and common CRMs within a 14-day sprint. | The brief describes "implementation, not consulting" with 7–14 day promises; no team was mentioned. | Delivery timelines and scope in the offer must be cut down; hire contractors or narrow deliverables. |
| B2 | Selena Systems has no public case studies, testimonials, or portfolio yet. | None were provided; guardrails forbid inventing them. | If proof exists, sales assets should be upgraded immediately with it — it materially improves close rates. |
| A3 | The founder can legally invoice international clients (e.g., via an existing company, Stripe/Wise/Payoneer setup, or a platform). Indonesian legal setup (PT PMA / KITAS) is NOT assumed — see market_research.md for what work is permitted on which visa. | Payment rails were not specified. | Working with Bali-local clients while on a tourist/remote-worker visa has real legal constraints; remote clients invoiced offshore are safer. Get local legal advice before signing Bali-local contracts. |
| A4 | Budget for tooling: client pays for their own SaaS/API subscriptions (WhatsApp API, CRM seats, OpenAI/Anthropic API keys). Selena's price covers implementation labor only. | Standard practice for implementation shops; keeps the $5–10k price clean. | If Selena absorbs tool costs, margins drop; make tooling costs explicit in the proposal. |
| A5 | The founder is comfortable selling in English and doing in-person meetings in Bali. | Brief emphasizes Bali as an advantage and includes in-person opener scripts. | If not, drop the in-person channel and go fully remote. |
| A6 | "Start outreach within 24 hours" means manual, personalized, low-volume outreach (10–30 contacts/day), not mass automation. | Guardrails prohibit spam; low-volume personalized outreach needs no paid tools. | None significant. |
| A7 | Founder timezone: WITA (UTC+8), which overlaps well with Singapore/Perth (0h), Dubai (−4h), Sydney (+2h), and poorly with US afternoons. | Bali location given. | If targeting US clients, calls land early morning Bali time; factored into market scoring. |

## Legal & platform assumptions (added after red team)

| # | Assumption | Notes |
|---|-----------|-------|
| L1 | The founder's current visa does NOT permit in-person selling or paid work performed in Indonesia. | DEFAULT-SAFE assumption per red team R1, held until the Task Zero lawyer consult says otherwise. All walk-in/local scripts are locked behind this gate. |
| L2 | A workable share of Bali targets can be contracted compliantly is UNKNOWN — note that PT PMAs are Indonesian entities, so "foreign-owned" does not mean "offshore client". | Replaces the earlier, too-optimistic reading of O1a. |
| L3 | Assumption A3 (international invoicing capability) is now Task Zero item 0 — it gates Dubai as well as Bali and must be confirmed before any outreach. | Red team R11. |
| L4 | WhatsApp Business API constraints: inbound replies within the 24h window are unrestricted; ALL proactive messaging requires recorded opt-in + Meta-approved templates; cold WhatsApp outreach risks number bans. | Red team R4; product architecture in delivery_process.md §3b. |

## Research-method assumptions

| # | Assumption | Notes |
|---|-----------|-------|
| M1 | Public review complaints (Google/TripAdvisor/Trustpilot) about slow responses are treated as evidence of internal operational pain, not one-off incidents, when they recur across multiple reviews. | Recurrence is the signal; single reviews are marked lower severity. |
| M2 | A business hiring for repetitive admin/follow-up roles is treated as evidence it has an expensive manual workflow. | The job post is the source; the pain is inferred and labeled as such. |
| M3 | Lead "priority" scores (1–10) are analyst judgments combining visible pain, apparent ability to pay, and reachability — not measured facts. | Same for all 1–10 scores in market_scores.csv. |
| M4 | Websites/listings seen during research are assumed current as of 2026-07-09. | Businesses close/rebrand often in Bali; re-verify before outreach. |
| M5 | Where a company's size is stated as "unknown", nothing was found publicly; no size was guessed. | |

## Offer-stage assumptions (added after tournament)

| # | Assumption | Notes |
|---|-----------|-------|
| O1a | A meaningful share (≥8–10) of the 65 Bali-regional leads bill through non-Indonesian entities and can be contracted compliantly. | UNVERIFIED — this is Task Zero in `winning_offer.md` §17. Go/no-go threshold set by tournament Judge 2; if it fails, Backup Offer O2 (Dubai) becomes primary. |
| O1b | Bali real estate commissions ≈ 5% on foreign-buyer transactions. | Industry-typical figure, not verified per agency; flagged inline in `candidate_offers.md` and `backup_offers.md`. Verify on each discovery call. |
| O1c | WhatsApp Business API access can be provisioned for a Bali business within the 14-day sprint window. | Application is filed at contract signing and day 0 is defined as API-approved for this reason (red team R8); timeline shifts day-for-day if it slips (stated in proposal). |
| O1d | The founder can build a credible demo agent within ~1 day using public villa listings. | Follows from assumption A1 (technical capability). If false, the 24-hour plan stretches to 48–72h. |
| O1e | Client-side tool costs of $50–150/month (WhatsApp BSP + AI API + CRM) are representative for a 15–150 villa operation. | Based on published BSP/AI pricing tiers seen in competitor research; estimated exactly per client at kickoff. |

## Pricing assumptions

| # | Assumption | Notes |
|---|-----------|-------|
| P1 | $5,000–$10,000 fixed-scope implementation is the target deal size per the brief; no evidence was found that Selena has sold at this price before. | First 1–2 deals may need a founding-client discount or stronger guarantee to compensate for missing proof. |
| P2 | ROI math in sales assets uses client-side numbers (their lead value, their staff cost) collected on the call — not invented benchmarks. Industry stats used in scripts are cited in source_log.md. | |
