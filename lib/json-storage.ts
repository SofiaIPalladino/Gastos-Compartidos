import { Group, Expense } from '@/types';

// Simula almacenamiento en archivos JSON usando localStorage
// En producción, esto se reemplazaría con fs.writeFileSync/fs.readFileSync

const GROUPS_FILE = 'data_groups.json';
const EXPENSES_FILE = 'data_expenses.json';

// Helper para simular lectura de archivo JSON
function readJSONFile<T>(filename: string): T[] {
  if (typeof window === 'undefined') {
    // Modo servidor: usar variable global temporal
    const globalData = (global as any).__jsonStorage || {};
    return globalData[filename] || [];
  }
  // Modo cliente: usar localStorage
  const data = localStorage.getItem(filename);
  return data ? JSON.parse(data) : [];
}

// Helper para simular escritura de archivo JSON
function writeJSONFile<T>(filename: string, data: T[]): void {
  if (typeof window === 'undefined') {
    // Modo servidor: usar variable global temporal
    const globalData = (global as any).__jsonStorage || {};
    globalData[filename] = data;
    (global as any).__jsonStorage = globalData;
  } else {
    // Modo cliente: usar localStorage
    localStorage.setItem(filename, JSON.stringify(data, null, 2));
  }
}

// Groups CRUD
export function getAllGroups(): Group[] {
  return readJSONFile<Group>(GROUPS_FILE);
}

export function getGroupById(id: string): Group | undefined {
  const groups = getAllGroups();
  return groups.find(g => g.id === id);
}

export function saveGroup(group: Group): void {
  const groups = getAllGroups();
  const index = groups.findIndex(g => g.id === group.id);
  
  if (index >= 0) {
    groups[index] = group;
  } else {
    groups.push(group);
  }
  
  writeJSONFile(GROUPS_FILE, groups);
}

export function removeGroup(id: string): void {
  const groups = getAllGroups();
  const filtered = groups.filter(g => g.id !== id);
  writeJSONFile(GROUPS_FILE, filtered);
  
  // También eliminar gastos asociados
  const expenses = getAllExpenses();
  const filteredExpenses = expenses.filter(e => e.groupId !== id);
  writeJSONFile(EXPENSES_FILE, filteredExpenses);
}

// Expenses CRUD
export function getAllExpenses(): Expense[] {
  return readJSONFile<Expense>(EXPENSES_FILE);
}

export function getExpensesByGroupId(groupId: string): Expense[] {
  const expenses = getAllExpenses();
  return expenses.filter(e => e.groupId === groupId);
}

export function saveExpense(expense: Expense): void {
  const expenses = getAllExpenses();
  const index = expenses.findIndex(e => e.id === expense.id);
  
  if (index >= 0) {
    expenses[index] = expense;
  } else {
    expenses.push(expense);
  }
  
  writeJSONFile(EXPENSES_FILE, expenses);
}

export function removeExpense(id: string): void {
  const expenses = getAllExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  writeJSONFile(EXPENSES_FILE, filtered);
}
