import { useMemo, useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getUser } from "../utils/getUser";

// Pre-calculate the start and end of the month
const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
const endOfMonth = new Date(
  now.getFullYear(),
  now.getMonth() + 1,
  0,
  23,
  59,
  59,
  999
);

export default function MonthList({ monthTotal }) {
  const { userId } = getUser();
  const [expenses, setExpenses] = useState([]);

  // Fetching Data
  useEffect(() => {
    const dbRef = ref(getDatabase(), `users/${userId}/expenses`);
    const unsubscribe = onValue(
      dbRef,
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
    return () => unsubscribe();
  }, [userId]);

  const expensesOfCurrentMonth = useMemo(() => {
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <p className="dashboard-title-date">Expenses of the Month</p>

      <div className="dashboard-card">
        <p className="card-heading">₱ {monthTotal}</p>
        <p className="card-text">Total Expenses</p>
      </div>
      <div
        style={{ maxHeight: "400px", overflowY: "auto", borderRadius: "13px" }}
      >
        {expensesOfCurrentMonth.map((expense) => (
          <div key={expense.id} className="month-container">
            <div className="month-first">
              <p>{expense.type}</p>
              <p className="month-amount">₱ {expense.amount}</p>
            </div>
            <p className="month-date">{formatDate(expense.date)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
