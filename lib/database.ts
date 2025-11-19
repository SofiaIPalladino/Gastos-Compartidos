import { Group, Expense } from '@/types';
import fs from 'fs';
import path from 'path';

// Rutas a los archivos JSON en la raíz del proyecto
const GROUPS_FILE = path.join(process.cwd(), 'groups.json');
const EXPENSES_FILE = path.join(process.cwd(), 'expenses.json');

// Asegurar que los archivos existan
function ensureFiles() {
  if (!fs.existsSync(GROUPS_FILE)) {
    fs.writeFileSync(GROUPS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(EXPENSES_FILE)) {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify([], null, 2));
  }
}

// Inicializar archivos al cargar el módulo
ensureFiles();

// ===== GROUPS =====

export function getAllGroups(): Group[] {
  ensureFiles();
  try {
    const data = fs.readFileSync(GROUPS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading groups:', error);
    return [];
  }
}

export function getGroupById(id: string): Group | undefined {
  const groups = getAllGroups();
  return groups.find(g => g.id === id);
}

export function saveGroup(group: Group): void {
  ensureFiles();
  const groups = getAllGroups();
  const index = groups.findIndex(g => g.id === group.id);
  
  if (index >= 0) {
    groups[index] = group;
  } else {
    groups.push(group);
  }
  
  fs.writeFileSync(GROUPS_FILE, JSON.stringify(groups, null, 2));
}

export function deleteGroup(id: string): void {
  ensureFiles();
  const groups = getAllGroups();
  const filtered = groups.filter(g => g.id !== id);
  fs.writeFileSync(GROUPS_FILE, JSON.stringify(filtered, null, 2));
  
  // También eliminar gastos asociados
  const expenses = getAllExpenses();
  const filteredExpenses = expenses.filter(e => e.groupId !== id);
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify(filteredExpenses, null, 2));
}

// ===== EXPENSES =====

export function getAllExpenses(): Expense[] {
  ensureFiles();
  try {
    const data = fs.readFileSync(EXPENSES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading expenses:', error);
    return [];
  }
}

export function getExpensesByGroupId(groupId: string): Expense[] {
  const expenses = getAllExpenses();
  return expenses.filter(e => e.groupId === groupId);
}

export function getExpenseById(id: string): Expense | undefined {
  const expenses = getAllExpenses();
  return expenses.find(e => e.id === id);
}

export function saveExpense(expense: Expense): void {
  ensureFiles();
  const expenses = getAllExpenses();
  const index = expenses.findIndex(e => e.id === expense.id);
  
  if (index >= 0) {
    expenses[index] = expense;
  } else {
    expenses.push(expense);
  }
  
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
}

export function deleteExpense(id: string): void {
  ensureFiles();
  const expenses = getAllExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify(filtered, null, 2));
}

