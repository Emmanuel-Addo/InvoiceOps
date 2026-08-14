# CreditBridge

**Bridging the Credit Gap for Ghana's Informal Workers**

## The Problem

Millions of informal workers in Ghana have real income and years of MoMo transaction history, but remain locked out of formal credit because banks require payslips, registered business documents, and collateral that informal workers do not have.

## Solution

CreditBridge is an AI system that converts an informal worker's MoMo transaction history into a structured, lender-readable credit profile. It identifies:

- Income regularity and patterns
- Savings consistency
- Spending behaviour
- Repayment capacity signals
- Creditworthiness evidence a lender can act on

## AI Opportunities

- Transaction pattern analysis
- Alternative credit scoring models
- LLMs for plain-language score explanation
- Anomaly detection
- Voice AI for low-literacy users

## Target Implementers

- Microfinance institutions
- Rural and Community Banks (RCBs)
- Fintech lenders
- Development Bank Ghana (DBG)
- Mobile money operators (as data partners)

## Success Vision

Reduce the time for an informal worker to prepare a credit application from weeks to under 48 hours, while giving lenders structured evidence they can use to make faster, more confident lending decisions.

## Tech Stack

- **Backend:** Python (FastAPI)
- **Frontend:** React (Vite)
- **AI/ML:** Scikit-learn, Pandas, NumPy
- **Data Processing:** MoMo transaction CSV parsing

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
CreditBridge/
├── backend/          # FastAPI backend with AI credit scoring
├── frontend/         # React frontend application
├── Ghana_CreditBridge_Opportunity.pdf
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License
