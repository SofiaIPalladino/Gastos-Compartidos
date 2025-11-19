import { NextResponse } from 'next/server';
import { getAllExpenses, getExpensesByGroupId, saveExpense, deleteExpense } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    
    const expenses = groupId 
      ? getExpensesByGroupId(groupId)
      : getAllExpenses();
    
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error reading expenses:', error);
    return NextResponse.json({ error: 'Failed to read expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const expense = await request.json();
    saveExpense(expense);
    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error saving expense:', error);
    return NextResponse.json({ error: 'Failed to save expense' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Expense ID required' }, { status: 400 });
    }
    
    deleteExpense(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
