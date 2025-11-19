import { Group, Expense } from '@/types';

const GROUPS_KEY = 'gastos_compartidos_groups';
const EXPENSES_KEY = 'gastos_compartidos_expenses';

// Groups
export function getGroups(): Group[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(GROUPS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveGroup(group: Group): void {
  const groups = getGroups();
  const index = groups.findIndex(g => g.id === group.id);
  if (index >= 0) {
    groups[index] = group;
  } else {
    groups.push(group);
  }
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

export function deleteGroup(id: string): void {
  const groups = getGroups();
  const filtered = groups.filter(g => g.id !== id);
  localStorage.setItem(GROUPS_KEY, JSON.stringify(filtered));
  
  // Also delete all expenses for this group
  const expenses = getExpenses();
  const filteredExpenses = expenses.filter(e => e.groupId !== id);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(filteredExpenses));
}

export function getGroup(id: string): Group | undefined {
  const groups = getGroups();
  return groups.find(g => g.id === id);
}

// Expenses
export function getExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(EXPENSES_KEY);
  return data ? JSON.parse(data) : [];
}

export function getExpensesByGroup(groupId: string): Expense[] {
  const expenses = getExpenses();
  return expenses.filter(e => e.groupId === groupId);
}

export function saveExpense(expense: Expense): void {
  const expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === expense.id);
  if (index >= 0) {
    expenses[index] = expense;
  } else {
    expenses.push(expense);
  }
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(filtered));
}
