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
    const now = new Date();
    const firstDayOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
    ).setHours(0, 0, 0, 0);
    const lastDayOfWeek = new Date(
      new Date(firstDayOfWeek).setDate(new Date(firstDayOfWeek).getDate() + 6)
    ).setHours(23, 59, 59, 999);
    return {
      startOfWeek: new Date(firstDayOfWeek),
      endOfWeek: new Date(lastDayOfWeek),
    };
  }, []);

  const countExpensesThisWeek = useMemo(
    () =>
      expenses.filter((expense) => {
        const expenseDate = new Date(expense.date).getTime();
        return (
          expenseDate >= startOfWeek.getTime() &&
          expenseDate <= endOfWeek.getTime()
        );
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
        <img src={user.photo} alt={userId.name} />
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