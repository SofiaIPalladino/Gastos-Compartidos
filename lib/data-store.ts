import { Group, Expense } from '@/types';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const GROUPS_FILE = path.join(DATA_DIR, 'groups.json');
const EXPENSES_FILE = path.join(DATA_DIR, 'expenses.json');

// Ensure data directory and files exist
function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(GROUPS_FILE)) {
    fs.writeFileSync(GROUPS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(EXPENSES_FILE)) {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify([], null, 2));
  }
}

// Groups
export function getGroups(): Group[] {
  ensureDataFiles();
  const data = fs.readFileSync(GROUPS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function getGroup(id: string): Group | undefined {
  const groups = getGroups();
  return groups.find(g => g.id === id);
}

export function saveGroup(group: Group): void {
  const groups = getGroups();
  const index = groups.findIndex(g => g.id === group.id);
  if (index >= 0) {
    groups[index] = group;
  } else {
    groups.push(group);
  }
  fs.writeFileSync(GROUPS_FILE, JSON.stringify(groups, null, 2));
}

export function deleteGroup(id: string): void {
  const groups = getGroups();
  const filtered = groups.filter(g => g.id !== id);
  fs.writeFileSync(GROUPS_FILE, JSON.stringify(filtered, null, 2));
  
  // Also delete all expenses for this group
  const expenses = getExpenses();
  const filteredExpenses = expenses.filter(e => e.groupId !== id);
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify(filteredExpenses, null, 2));
}

// Expenses
export function getExpenses(): Expense[] {
  ensureDataFiles();
  const data = fs.readFileSync(EXPENSES_FILE, 'utf-8');
  return JSON.parse(data);
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
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify(filtered, null, 2));
}
