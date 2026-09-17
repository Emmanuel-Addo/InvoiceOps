"""
Sample Ghanaian informal-worker transaction data.
Used by the /api/analyze-demo endpoint so judges/reviewers can see
a full analysis without uploading a CSV.
"""

SAMPLE_TRANSACTIONS = [
    # ─── May 2023 ────────────────────────────────────────────────────────────
    {"date":"2023-05-02","description":"MTN MoMo Receipt – Shop Sales","type":"income",  "amount":1200,"category":"Sales"},
    {"date":"2023-05-05","description":"Rent Payment","type":"expense", "amount":800, "category":"Housing"},
    {"date":"2023-05-08","description":"Shop Sales (Cash Deposit)","type":"income","amount":850,"category":"Sales"},
    {"date":"2023-05-12","description":"Electricity Bill (ECG)","type":"expense","amount":150,"category":"Utilities"},
    {"date":"2023-05-15","description":"AirtelTigo Money Receipt","type":"income","amount":500,"category":"Transfer"},
    {"date":"2023-05-18","description":"Food Supplies (Makola Market)","type":"expense","amount":320,"category":"Food"},
    {"date":"2023-05-20","description":"Vodafone Cash Transfer – Customer","type":"income","amount":450,"category":"Transfer"},
    {"date":"2023-05-22","description":"Transport (Trotro)","type":"expense","amount":40,"category":"Transport"},
    {"date":"2023-05-25","description":"Shop Sales","type":"income","amount":1100,"category":"Sales"},
    {"date":"2023-05-28","description":"MTN Data Bundle","type":"expense","amount":100,"category":"Utilities"},

    # ─── June 2023 ───────────────────────────────────────────────────────────
    {"date":"2023-06-01","description":"MTN MoMo Receipt – Daily Sales","type":"income","amount":1350,"category":"Sales"},
    {"date":"2023-06-04","description":"Rent Payment","type":"expense","amount":800,"category":"Housing"},
    {"date":"2023-06-07","description":"Shop Sales (Cash Deposit)","type":"income","amount":900,"category":"Sales"},
    {"date":"2023-06-10","description":"Electricity Bill (ECG)","type":"expense","amount":130,"category":"Utilities"},
    {"date":"2023-06-12","description":"AirtelTigo Money Receipt","type":"income","amount":550,"category":"Transfer"},
    {"date":"2023-06-15","description":"Food Supplies (Market)","type":"expense","amount":300,"category":"Food"},
    {"date":"2023-06-17","description":"Vodafone Cash Transfer","type":"income","amount":400,"category":"Transfer"},
    {"date":"2023-06-20","description":"NHIS Premium","type":"expense","amount":60,"category":"Healthcare"},
    {"date":"2023-06-22","description":"Shop Sales","type":"income","amount":1150,"category":"Sales"},
    {"date":"2023-06-25","description":"Internet Data Bundle","type":"expense","amount":80,"category":"Utilities"},
    {"date":"2023-06-28","description":"Transport (Trotro)","type":"expense","amount":45,"category":"Transport"},

    # ─── July 2023 ───────────────────────────────────────────────────────────
    {"date":"2023-07-01","description":"MTN MoMo Receipt – Sales","type":"income","amount":1100,"category":"Sales"},
    {"date":"2023-07-04","description":"Rent Payment","type":"expense","amount":800,"category":"Housing"},
    {"date":"2023-07-07","description":"Shop Sales","type":"income","amount":750,"category":"Sales"},
    {"date":"2023-07-10","description":"Electricity Bill (ECG)","type":"expense","amount":170,"category":"Utilities"},
    {"date":"2023-07-12","description":"AirtelTigo Money Receipt","type":"income","amount":480,"category":"Transfer"},
    {"date":"2023-07-15","description":"Food Supplies","type":"expense","amount":350,"category":"Food"},
    {"date":"2023-07-17","description":"MTN MoMo – Salary Transfer","type":"income","amount":600,"category":"Salary"},
    {"date":"2023-07-20","description":"School Fees (Children)","type":"expense","amount":250,"category":"Education"},
    {"date":"2023-07-22","description":"Shop Sales","type":"income","amount":980,"category":"Sales"},
    {"date":"2023-07-26","description":"Vodafone Data","type":"expense","amount":75,"category":"Utilities"},
    {"date":"2023-07-28","description":"Transport","type":"expense","amount":50,"category":"Transport"},

    # ─── August 2023 ─────────────────────────────────────────────────────────
    {"date":"2023-08-01","description":"MTN MoMo Receipt – Shop Sales","type":"income","amount":1500,"category":"Sales"},
    {"date":"2023-08-03","description":"Rent Payment","type":"expense","amount":800,"category":"Housing"},
    {"date":"2023-08-07","description":"Shop Sales (Cash Deposit)","type":"income","amount":1050,"category":"Sales"},
    {"date":"2023-08-10","description":"Electricity Bill (ECG)","type":"expense","amount":155,"category":"Utilities"},
    {"date":"2023-08-13","description":"AirtelTigo Money Receipt","type":"income","amount":600,"category":"Transfer"},
    {"date":"2023-08-16","description":"Food Supplies (Market)","type":"expense","amount":290,"category":"Food"},
    {"date":"2023-08-18","description":"Vodafone Cash Transfer","type":"income","amount":550,"category":"Transfer"},
    {"date":"2023-08-20","description":"Transport (Trotro)","type":"expense","amount":40,"category":"Transport"},
    {"date":"2023-08-24","description":"Shop Sales","type":"income","amount":1200,"category":"Sales"},
    {"date":"2023-08-28","description":"Internet Data Bundle","type":"expense","amount":100,"category":"Utilities"},
    {"date":"2023-08-30","description":"Hospital Visit (Korle Bu)","type":"expense","amount":120,"category":"Healthcare"},

    # ─── September 2023 ──────────────────────────────────────────────────────
    {"date":"2023-09-01","description":"MTN MoMo Receipt","type":"income","amount":1400,"category":"Sales"},
    {"date":"2023-09-03","description":"Rent Payment","type":"expense","amount":800,"category":"Housing"},
    {"date":"2023-09-06","description":"Shop Sales","type":"income","amount":950,"category":"Sales"},
    {"date":"2023-09-09","description":"Electricity Bill (ECG)","type":"expense","amount":145,"category":"Utilities"},
    {"date":"2023-09-11","description":"AirtelTigo Money Receipt","type":"income","amount":520,"category":"Transfer"},
    {"date":"2023-09-14","description":"Food Supplies","type":"expense","amount":310,"category":"Food"},
    {"date":"2023-09-17","description":"Vodafone Cash Transfer","type":"income","amount":480,"category":"Transfer"},
    {"date":"2023-09-20","description":"Transport","type":"expense","amount":45,"category":"Transport"},
    {"date":"2023-09-23","description":"Shop Sales","type":"income","amount":1100,"category":"Sales"},
    {"date":"2023-09-26","description":"MTN Data Bundle","type":"expense","amount":90,"category":"Utilities"},
    {"date":"2023-09-29","description":"School Fees","type":"expense","amount":250,"category":"Education"},

    # ─── October 2023 ────────────────────────────────────────────────────────
    {"date":"2023-10-01","description":"Shop Sales","type":"income","amount":1100,"category":"Sales"},
    {"date":"2023-10-02","description":"Rent Payment","type":"expense","amount":800,"category":"Housing"},
    {"date":"2023-10-05","description":"MTN MoMo Receipt","type":"income","amount":1200,"category":"Transfer"},
    {"date":"2023-10-07","description":"AirtelTigo Money Receipt","type":"income","amount":500,"category":"Transfer"},
    {"date":"2023-10-10","description":"Electricity Bill (ECG)","type":"expense","amount":150,"category":"Utilities"},
    {"date":"2023-10-15","description":"Food Supplies (Market)","type":"expense","amount":320,"category":"Food"},
    {"date":"2023-10-18","description":"Transport (Trotro)","type":"expense","amount":40,"category":"Transport"},
    {"date":"2023-10-20","description":"Shop Sales (Cash Deposit)","type":"income","amount":850,"category":"Sales"},
    {"date":"2023-10-21","description":"Vodafone Cash Transfer","type":"income","amount":450,"category":"Transfer"},
    {"date":"2023-10-22","description":"Internet Data Bundle","type":"expense","amount":100,"category":"Utilities"},
    {"date":"2023-10-24","description":"MTN MoMo Receipt","type":"income","amount":1200,"category":"Transfer"},
]
