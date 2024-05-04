import { getUser } from "../utils/getUser";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState, useMemo } from "react";
import ConditionalMessage from "../components/ConditionalMessage";

export default function Dashboard() {
  // get user
  const user = JSON.parse(localStorage.getItem("auth"));
  const { userId } = getUser();

  // get database
  const db = getDatabase();

  // state variables
  const [isLoading, setIsLoading] = useState(true);
  const [countExpenses, setCountExpenses] = useState(0);

useEffect(() => {
  const fetchData = () => {
    const unsubscribe = onValue(
      ref(db, `users/${userId}/expenses`),
      (snapshot) => {
        setCountExpenses(snapshot.val());
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  };

  fetchData();
}, [userId, db]);

  const countExpensesThisWeek = useMemo(() => {
        if (!countExpenses) return 0;

        const allExpenses = Object.values(countExpenses);

        // get current week
        const currentDate = new Date();
        const currentWeekStart = new Date(currentDate);
        currentWeekStart.setDate(
          currentDate.getDate() - currentDate.getDay() + 1
        );
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // Sunday

        // get expenses only for current week
        const expensesThisWeek = allExpenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate >= currentWeekStart && expenseDate <= currentWeekEnd
          );
        });

        return expensesThisWeek.length;
  }, [countExpenses])

  return (
    <>
      <div>
        <h3>Dashboard</h3>
      </div>

      {user && (
        <div>
          <h4>{user.name}</h4>
          <img src={user.photo} alt={user.name} />
          {/* is it loading */}
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
