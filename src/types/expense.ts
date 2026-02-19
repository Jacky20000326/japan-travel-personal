export interface Expense {
  id: string;
  purchase_date: string;
  product_name: string;
  category: string;
  price: number;
  created_at?: string;
}

export interface CreateExpenseData {
  purchase_date: string;
  product_name: string;
  category: string;
  price: number;
}
