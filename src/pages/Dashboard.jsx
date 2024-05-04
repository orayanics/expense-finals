import { useEffect, useState, useMemo } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getUser } from "../utils/getUser";
import ConditionalMessage from "../components/ConditionalMessage";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("auth"));
  const { userId } = getUser();
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    setIsLoading(true);
    onValue(
      ref(db, `users/${userId}/expenses`),
      (snapshot) => {
        setIsLoading(false);
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

  const { startOfWeek, endOfWeek } = useMemo(() => {
    let now = new Date();
    // Adjusting for the scenario when today is Sunday (getDay() === 0)
    let day = now.getDay() || 7; // Make Sunday a 7 instead of 0
    if (day !== 1) now.setHours(-24 * (day - 1)); // Only move days if not Monday
    now.setHours(0, 0, 0, 0); // Start of the week

    let end = new Date(now);
    end.setDate(now.getDate() + 6); // Next 6 days to get to the end of the week
    end.setHours(23, 59, 59, 999); // End of the week

    return { startOfWeek: now, endOfWeek: end };
  }, []);

  const countExpensesThisWeek = useMemo(
    () =>
      expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
      }).length,
    [expenses, startOfWeek, endOfWeek]
  );

  return (
    <>
      <div>
        <h3>Dashboard</h3>
      </div>
      {userId && (
        <div>
          <img src={user.photo} alt={user.name} />
          {isLoading ? (
            <h5>Loading...</h5>
          ) : (
            <ConditionalMessage
              condition={countExpensesThisWeek > 0}
              message={`You have ${countExpensesThisWeek} expenses this week.`}
            />
          )}
        </div>
      )}
    </>
  );
}
