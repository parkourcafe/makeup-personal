#!/usr/bin/env python3
"""Assemble pain_signals.csv and lead_list.csv from raw agent JSON output."""
import csv, glob, json, os

RAW = os.path.join(os.path.dirname(__file__), 'raw')
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # selena-systems-gtm/

PAIN_FIELDS = ['id', 'source_url', 'date', 'market', 'source_type', 'company_or_anon',
               'pain', 'evidence', 'severity', 'selena_solution', 'supports_5k_offer', 'batch']
LEAD_FIELDS = ['id', 'company', 'website', 'location', 'industry', 'size_hint', 'why_pain',
               'evidence', 'decision_maker_role', 'contact_channel', 'outreach_angle',
               'personalization', 'priority', 'region_bucket', 'batch']

BALI_BATCHES = {'bali-villas', 'bali-clinics', 'bali-realestate', 'bali-hospitality'}


def load(path):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception as e:
        print(f'WARN: could not parse {path}: {e}')
        return None


def main():
    pains, leads = [], []
    for path in sorted(glob.glob(os.path.join(RAW, 'pain-*.json'))):
        data = load(path)
        if not data:
            continue
        batch = os.path.basename(path)[5:-5]
        for s in data.get('signals', []):
            s = {k: s.get(k, '') for k in PAIN_FIELDS if k not in ('id', 'batch')} | {'batch': batch}
            pains.append(s)
    for path in sorted(glob.glob(os.path.join(RAW, 'leads-*.json'))):
        data = load(path)
        if not data:
            continue
        batch = os.path.basename(path)[6:-5]
        for l in data.get('leads', []):
            l = {k: l.get(k, '') for k in LEAD_FIELDS if k not in ('id', 'region_bucket', 'batch')}
            l['region_bucket'] = 'bali_regional' if batch in BALI_BATCHES else 'remote_international'
            l['batch'] = batch
            leads.append(l)

    # dedup leads by company name (case-insensitive)
    seen, deduped = set(), []
    for l in leads:
        key = str(l.get('company', '')).strip().lower()
        if key and key not in seen:
            seen.add(key)
            deduped.append(l)
    leads = deduped

    leads.sort(key=lambda l: (l['region_bucket'], -int(l.get('priority') or 0)))

    with open(os.path.join(OUT, 'pain_signals.csv'), 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=PAIN_FIELDS)
        w.writeheader()
        for i, s in enumerate(pains, 1):
            w.writerow({'id': i} | s)
    with open(os.path.join(OUT, 'lead_list.csv'), 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=LEAD_FIELDS)
        w.writeheader()
        for i, l in enumerate(leads, 1):
            w.writerow({'id': i} | l)

    bali = sum(1 for l in leads if l['region_bucket'] == 'bali_regional')
    print(f'pain signals: {len(pains)}')
    print(f'leads: {len(leads)} (bali_regional: {bali}, remote_international: {len(leads) - bali})')


if __name__ == '__main__':
    main()
