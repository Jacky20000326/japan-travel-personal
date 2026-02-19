import { ExpensesRepo } from "../../supabase/repositories/expenses.repo";
import type { Expense, CreateExpenseData } from "../types/expense";

export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await ExpensesRepo.list();
  if (error) {
    throw error;
  }
  return data ?? [];
};

export const createExpense = async (
  data: CreateExpenseData
): Promise<Expense> => {
  const { data: created, error } = await ExpensesRepo.create(data);
  if (error) {
    throw error;
  }
  return created as Expense;
};

export const updateExpense = async (
  id: string,
  data: CreateExpenseData
): Promise<Expense> => {
  const { data: updated, error } = await ExpensesRepo.update(id, data);
  if (error) {
    throw error;
  }
  return updated as Expense;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await ExpensesRepo.delete(id);
  if (error) {
    throw error;
  }
};
