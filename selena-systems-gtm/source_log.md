# Source Log — Selena Systems GTM Research

**Scope:** every factual claim in this package traces to a public URL captured during research (2026-07-09) or is labeled ASSUMPTION in `assumptions.md`. **566 unique source URLs** were captured; the complete machine-readable list is in `research/all_source_urls.txt` (one URL per line, tagged with the raw research file(s) it appears in). Item-level source attribution lives beside each claim in:

- `pain_signals.csv` — `source_url` column (96 rows)
- `lead_list.csv` — `evidence` column (122 rows)
- `research/raw/*.json` — full structured findings with per-item URLs and confidence labels

## Verification status

Two independent verification agents spot-checked the datasets (results: `research/raw/verification-pains.json`, `research/raw/verification-leads.json`):

- **Pain signals:** 20/96 sampled (stratified across all 5 batches) → 20 CORROBORATED, 0 SUSPECT. Note: the research environment's egress proxy blocked direct page fetches during verification, so corroboration was via search-index confirmation of exact URLs/titles/quotes — the ceiling grade available, reflecting the environment rather than source quality.
- **Leads:** 24/122 sampled (3 per batch) → 21 VERIFIED, 1 CORROBORATED, 2 website-field errors (both corrected in the data; companies themselves were real).
- Corrections applied from verification: The Udaya website URL, Sydney Health Physiotherapy website URL, the 8.2h agency-reporting periodicity flag (noted inline in `market_research.md` and `candidate_offers.md`).

## Key load-bearing sources (the claims strategy rests on)

| Claim | Source |
|---|---|
| 48% of broker inquiries never answered; 917-min avg response | https://www.wavgroup.com/2014/01/13/agent-responsiveness-study-reveals-critical-flaws-in-real-estate-lead-response/ (US, 2014 — age flagged in `backup_offers.md`) |
| 5-min response ≈ 21x qualification lift; ~42h avg B2B response | https://www.chilipiper.com/article/speed-to-lead-statistics |
| >1-day clinic response cuts booking probability 42% (48k inquiries) | https://www.indesk.site/blog/enquiries-response-speed-and-booking-rate |
| Dubai: 32,294 brokers, AED 13.59bn commissions 2025 | https://www.arabianbusiness.com/real-estate/dubai-real-estate-broker-commissions-hit-3-7bn-as-number-of-brokers-reaches-32294 |
| Dubai lead costs AED 300–600; WhatsApp-dominant comms | https://fwddigi.com/ae/blogs/cost-per-lead-dubai-benchmarks/ · https://ficaition.com/blog/real-estate-whatsapp-lead-management-dubai · https://www.sudonum.com/blog/the-rise-of-whatsapp-in-dubais-real-estate-market-a-sudonum-perspective |
| Bali rental oversupply: ~45–46k listings, 53% occupancy, ADR −14% | https://investlandbali.com/bali-real-estate-market |
| Villa PM fees 15–25% of booking revenue | https://www.cabobali.com/blog/bali-villa-management-fees |
| Bali reservation-agent job posts (multi-channel, SLA) | https://hhrmahotelbali.com/tag/reservation-agent · https://www.glassdoor.sg/Job/canggu-villa-manager-jobs-SRCH_IL.0,6_IC4374635_KO7,20.htm |
| E33G visa prohibits serving Indonesian clients; PT PMA capital requirements | https://www.balivisas.com/kitas/e33g-remote-worker-visa-digital-nomad/ · https://xpnd.co.id/blogs/pt-pma-establishment-cost-2026/ |
| Indonesian B2B payment risk (45% overdue) | https://atradius.in/knowledge-and-research/reports/b2b-payment-practices-trends-indonesia-2025 |
| SMB AI implementation price benchmarks ($5–15k / 4–6 wks) | https://aiessentials.us/blog/how-much-does-it-cost-to-hire-an-ai-consultant-for-my-small · https://taskip.net/ai-automation-agency-cost/ |
| Named competitor pricing anchors | https://www.leftclick.ai/pricing · https://goodspeed.studio/blog/n8n-agency-pricing-what-it-costs-to-work-with-an-n8n-partner · https://www.hostbuddy.ai/pricing · https://smith.ai/pricing/receptionists |
| Physio no-show cost up to A$114,827/clinic/yr (peer-reviewed) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12104927/ (exact A$ figure not visible in accessible snippets — flagged by verifier; rates 8–10% confirmed) |
| AU clinic front-desk failure at scale | https://www.productreview.com.au/listings/laser-clinics-australia |

## Research-environment caveats (recorded for honesty)

1. **Reddit was blocked** to the research crawler; Reddit-native beats were covered via Shopify Community, HN, BiggerPockets, TripAdvisor forums, UK Business Forums, G2/Capterra, and industry write-ups instead.
2. **Several review/agency sites returned 403** to direct fetch; affected evidence fields cite content seen in search-result snippets for real URLs and are flagged item-by-item in the raw JSON meta/notes.
3. Aggregator-derived counts (Bali restaurant/agency counts) are flagged medium/low confidence in `research/raw/market-bali.json`.
4. All URLs were captured 2026-07-09; re-verify before quoting in outreach (assumption M4).
