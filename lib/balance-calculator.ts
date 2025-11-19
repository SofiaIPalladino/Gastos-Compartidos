import { Expense, Balance, Settlement } from '@/types';

export function calculateBalances(
  expenses: Expense[],
  memberIds: string[],
  memberNames: Map<string, string>
): Balance[] {
  const balances = new Map<string, { paid: number; shouldPay: number }>();

  // Initialize balances for all members
  memberIds.forEach(id => {
    balances.set(id, { paid: 0, shouldPay: 0 });
  });

  // Calculate paid and should pay amounts
  expenses.forEach(expense => {
    const payer = expense.paidBy;
    const participants = expense.participants;
    const amountPerPerson = expense.amountInBaseCurrency / participants.length;

    // Update payer
    const payerBalance = balances.get(payer);
    if (payerBalance) {
      payerBalance.paid += expense.amountInBaseCurrency;
    }

    // Update all participants (including payer)
    participants.forEach(participantId => {
      const participantBalance = balances.get(participantId);
      if (participantBalance) {
        participantBalance.shouldPay += amountPerPerson;
      }
    });
  });

  // Convert to Balance array
  return Array.from(balances.entries()).map(([memberId, { paid, shouldPay }]) => ({
    memberId,
    memberName: memberNames.get(memberId) || memberId,
    paid,
    shouldPay,
    balance: paid - shouldPay,
  }));
}

export function calculateSettlements(balances: Balance[]): Settlement[] {
  const settlements: Settlement[] = [];
  
  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balances
    .filter(b => b.balance > 0.01)
    .map(b => ({ ...b }))
    .sort((a, b) => b.balance - a.balance);
  
  const debtors = balances
    .filter(b => b.balance < -0.01)
    .map(b => ({ ...b, balance: Math.abs(b.balance) }))
    .sort((a, b) => b.balance - a.balance);

  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor.balance, debtor.balance);

    if (amount > 0.01) {
      settlements.push({
        from: debtor.memberId,
        fromName: debtor.memberName,
        to: creditor.memberId,
        toName: creditor.memberName,
        amount: Math.round(amount * 100) / 100,
      });
    }

    creditor.balance -= amount;
    debtor.balance -= amount;

    if (creditor.balance < 0.01) i++;
    if (debtor.balance < 0.01) j++;
  }

  return settlements;
}
