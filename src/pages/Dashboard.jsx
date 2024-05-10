import { useEffect, useState, useMemo } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getUser } from "../utils/getUser";
import ConditionalMessage from "../components/ConditionalMessage";
import '../styles/expense.css';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("auth"));
  const { userId } = getUser();
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);

  // Fetching Data
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
      }),
    [expenses, startOfWeek, endOfWeek]
  );

  const totalThisWeek = useMemo(
    () =>
      countExpensesThisWeek.reduce(
        (total, expense) => total + Number(expense.amount),
        0
      ),
    [countExpensesThisWeek]
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
      }),
    [expenses, startOfPrevWeek, endOfPrevWeek]
  );

  const totalPrevWeek = useMemo(
    () =>
      expensesOfPrevWeek.reduce(
        (total, expense) => total + Number(expense.amount),
        0
      ),
    [expensesOfPrevWeek]
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
      }),
    [expenses, startOfMonth, endOfMonth]
  );

  const totalCurrMonth = useMemo(
    () =>
      expensesOfCurrentMonth.reduce(
        (total, expense) => total + Number(expense.amount),
        0
      ),
    [expensesOfCurrentMonth]
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
      }),
    [expenses, startOfCurrentDate, endOfCurrentDate]
  );

  const totalCurrent = useMemo(
    () =>
      expensesOfCurrentDate.reduce(
        (total, expense) => total + Number(expense.amount),
        0
      ),
    [expensesOfCurrentDate]
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
      }),
    [expenses, startOfYesterday, endOfYesterday]
  );

  const totalYesterday = useMemo(
    () =>
      expensesOfYesterday.reduce(
        (total, expense) => total + Number(expense.amount),
        0
      ),
    [expensesOfYesterday]
  );
  // END OF YESTERDAY

  return (
    <>
      <div>
        <h1>Welcome back, {user.name}</h1>
      </div>
      {userId && (
        <div>
          <img src={user.photo} alt={user.name} className="user-photo"/>
          {isLoading ? (
            <h5>Loading...</h5>
          ) : (
            <>
            <h2>Today</h2>
            <div className="dashboard-exp">
              <ConditionalMessage
                condition={expensesOfCurrentDate.length > 0}
                message={`You have ${expensesOfCurrentDate.length} expenses today - TOTAL: ${totalCurrent}`}
              />
              </div>
              <div className="dashboard-exp">
              <ConditionalMessage
                condition={expensesOfYesterday.length > 0}
                message={`You bought ${expensesOfYesterday.length} items yesterday - TOTAL: ${totalYesterday}`}
              />
              </div>
            <h2>This Week</h2>
            <div className="dashboard-exp">
              <ConditionalMessage
                condition={countExpensesThisWeek.length > 0}
                message={`You have ${countExpensesThisWeek.length} expenses this week - TOTAL: ${totalThisWeek}`}
              />
            </div>
            <h2>Last Week</h2>
            <div className="dashboard-exp">
              <ConditionalMessage
                condition={expensesOfPrevWeek.length > 0}
                message={`You have ${expensesOfPrevWeek.length} expense/s last week - TOTAL: ${totalPrevWeek}`}
              />
              </div>
              <h2>This Month</h2>
              <div className="dashboard-exp">
              <ConditionalMessage
                condition={expensesOfCurrentMonth.length > 0}
                message={`You have ${expensesOfCurrentMonth.length} expenses this month - TOTAL: ${totalCurrMonth}`}
              />
              </div>
            
            </>
          )}
        </div>
      )}
    </>
  );
}
