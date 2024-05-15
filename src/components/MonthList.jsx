import { useMemo, useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getUser } from "../utils/getUser";

export default function MonthList() {
  const { userId } = getUser();
  const [expenses, setExpenses] = useState([]);

  // Fetching Data
  useEffect(() => {
    const db = getDatabase();
    onValue(
      ref(db, `users/${userId}/expenses`),
      (snapshot) => {
        const expensesData = snapshot.val();
        const formattedExpenses = expensesData
          ? Object.values(expensesData)
          : [];
        setExpenses(formattedExpenses);
      },
      {
        onlyOnce: true,
      }
    );
  }, [userId]);

  const { startOfMonth, endOfMonth } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    start.setHours(0, 0, 0, 0); // Start of the month
    end.setHours(23, 59, 59, 999); // End of the month
    return { startOfMonth: start, endOfMonth: end };
  }, []);

  const expensesOfCurrentMonth = useMemo(
    () =>
      expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
      }),
    [expenses, startOfMonth, endOfMonth]
  );

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <div>
      <p>Monthly List</p>

      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {expensesOfCurrentMonth.map((expense) => (
          <div key={expense.id}>
            <p>{new Date(expense.date).toLocaleDateString("en-US", options)}</p>
            <p>{expense.amount}</p>
            <p>{expense.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
