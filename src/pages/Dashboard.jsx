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

  // START OF GETTING CURRENT WEEK
  const { startOfWeek, endOfWeek } = useMemo(() => {
    let now = new Date();
    let day = now.getDay() || 7; 
    if (day !== 1) now.setHours(-24 * (day - 1)); 
    now.setHours(0, 0, 0, 0); 

    let end = new Date(now);
    end.setDate(now.getDate() + 6); 
    end.setHours(23, 59, 59, 999); 

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
  // END OF CURRENT WEEK

  // START OF PREVIOUS WEEK
  const { startOfPrevWeek, endOfPrevWeek } = useMemo(() => {
    let now = new Date();
    let day = now.getDay() || 7;
    if (day !== 1) now.setHours(-24 * (day - 1));
    now.setHours(0, 0, 0, 0); // Start of the week
    now.setDate(now.getDate() - 7); // Go back one week
    let end = new Date(now);
    end.setDate(now.getDate() + 6);
    end.setHours(23, 59, 59, 999); // End of the week
    return { startOfPrevWeek: now, endOfPrevWeek: end };
  }, []);

  const expensesOfPrevWeek = useMemo(
    () =>
      expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfPrevWeek && expenseDate <= endOfPrevWeek;
      }).length,
    [expenses, startOfPrevWeek, endOfPrevWeek]
  );
  // END OF PREVIOUS WEEK

  // START OF CURRENT MONTH
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
      }).length,
    [expenses, startOfMonth, endOfMonth]
  );
  // END OF CURRENT MONTH

  // START OF CURRENT DATE
  const { startOfCurrentDate, endOfCurrentDate } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );
    return { startOfCurrentDate: start, endOfCurrentDate: end };
  }, []);

  const expensesOfCurrentDate = useMemo(
    () =>
      expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= startOfCurrentDate && expenseDate <= endOfCurrentDate
        );
      }).length,
    [expenses, startOfCurrentDate, endOfCurrentDate]
  );
  // END OF CURRENT DATE

  // START OF YESTERDAY
  const { startOfYesterday, endOfYesterday } = useMemo(() => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const start = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );
    const end = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      23,
      59,
      59,
      999
    );
    return { startOfYesterday: start, endOfYesterday: end };
  }, []);

  const expensesOfYesterday = useMemo(
    () =>
      expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfYesterday && expenseDate <= endOfYesterday;
      }).length,
    [expenses, startOfYesterday, endOfYesterday]
  );
  // END OF YESTERDAY

  console.log(expensesOfPrevWeek)
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
            <>
              <ConditionalMessage
                condition={countExpensesThisWeek > 0}
                message={`You have ${countExpensesThisWeek} expenses this week.`}
              />
              <ConditionalMessage
                condition={expensesOfPrevWeek > 0}
                message={`You have ${expensesOfPrevWeek} expense/s last week.`}
              />
              <ConditionalMessage
                condition={expensesOfCurrentMonth > 0}
                message={`You have ${expensesOfCurrentMonth} this month.`}
              />
              <ConditionalMessage
                condition={expensesOfCurrentDate > 0}
                message={`You have ${expensesOfCurrentDate} expenses today.`}
              />
              <ConditionalMessage
                condition={expensesOfYesterday > 0}
                message={`You bought ${expensesOfYesterday} items yesterday.`}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
