// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type DocumentType = 'Invoice' | 'Receipt' | 'Expense Document' | 'Other';
export type DocumentStatus = 'Processed' | 'Pending Review' | 'Approved' | 'Needs Attention' | 'Rejected';
export type ExpenseCategory =
  | 'Office Supplies'
  | 'Transport'
  | 'Utilities'
  | 'Rent'
  | 'Food & Beverage'
  | 'Marketing'
  | 'Equipment'
  | 'Professional Services'
  | 'Inventory'
  | 'Other';
export type PaymentMethod = 'MTN MoMo' | 'Vodafone Cash' | 'Bank Transfer' | 'Cash' | 'Card';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Needs Correction';

export interface FinancialDocument {
  id: string;
  vendor: string;
  type: DocumentType;
  amount: number;
  currency: string;
  date: string;
  category: ExpenseCategory;
  status: DocumentStatus;
  invoiceNumber?: string;
  taxAmount?: number;
  subtotal?: number;
  paymentMethod: PaymentMethod;
  fileName: string;
  fileType: 'PDF' | 'JPG' | 'PNG';
  uploadedAt: string;
  aiConfidence?: {
    vendor: number;
    date: number;
    total: number;
    category: number;
  };
  warnings?: string[];
}

export interface ExpenseRecord {
  id: string;
  date: string;
  vendor: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  status: ApprovalStatus;
}

export interface MonthlyExpenseStat {
  month: string;
  total: number;
  approved: number;
  pending: number;
}

export interface CategoryStat {
  category: ExpenseCategory;
  amount: number;
  count: number;
  percentage: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Documents
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_DOCUMENTS: FinancialDocument[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// Expenses
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_EXPENSES: ExpenseRecord[] = MOCK_DOCUMENTS.map((doc) => ({
  id: `exp-${doc.id}`,
  date: doc.date,
  vendor: doc.vendor,
  description: `${doc.type} from ${doc.vendor}`,
  category: doc.category,
  amount: doc.amount,
  paymentMethod: doc.paymentMethod,
  status: doc.status === 'Approved' ? 'Approved' :
          doc.status === 'Pending Review' ? 'Pending' :
          doc.status === 'Needs Attention' ? 'Needs Correction' : 'Pending',
}));

// ─────────────────────────────────────────────────────────────────────────────
// Monthly stats
// ─────────────────────────────────────────────────────────────────────────────

export const MONTHLY_STATS: MonthlyExpenseStat[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// Category breakdown
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORY_STATS: CategoryStat[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// Pending approvals (subset of documents)
// ─────────────────────────────────────────────────────────────────────────────

export const PENDING_APPROVALS = MOCK_DOCUMENTS.filter(
  (d) => d.status === 'Pending Review' || d.status === 'Needs Attention'
);
