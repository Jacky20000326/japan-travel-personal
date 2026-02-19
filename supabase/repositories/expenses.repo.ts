import { supabase } from "../client";
import type { CreateExpenseData } from "../../src/types/expense";

export const ExpensesRepo = {
  async list() {
    return supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });
  },

  async create(data: CreateExpenseData) {
    return supabase.from("expenses").insert(data).select().single();
  },

  async update(id: string, data: CreateExpenseData) {
    return supabase.from("expenses").update(data).eq("id", id).select().single();
  },

  async delete(id: string) {
    return supabase.from("expenses").delete().eq("id", id);
  },
};
