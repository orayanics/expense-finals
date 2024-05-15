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
      expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [expenses, startOfMonth, endOfMonth]
  );

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <div>
      <div style={{ maxHeight: "400px", overflowY: "auto", borderRadius:'13px' }}>
        {expensesOfCurrentMonth.map((expense) => (
          <div key={expense.id} className="month-container">
            <div className="month-first">
              <p>{expense.type}</p>
              <p>₱ {expense.amount}</p>
            </div>

            <p className="month-date">
              {new Date(expense.date).toLocaleDateString("en-US", options)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
