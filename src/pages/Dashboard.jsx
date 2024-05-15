import { useEffect, useState, useMemo } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getUser } from "../utils/getUser";
import ConditionalMessage from "../components/ConditionalMessage";
import MonthList from "../components/MonthList";
import BarChart from "../components/BarChart";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [date] = useState(new Date());
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
      <div className="dashboard-heading">
        <img src={user.photo} alt={user.name} className="user-photo" />
        <div>
          <p className="dashboard-title">Welcome, {user.name}</p>
          <p className="">
            {date.toLocaleDateString("default", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {userId && (
        <div className="expenses-container">
          {isLoading ? (
            <h3>Loading...</h3>
          ) : (
            <>
              <div className="expenses-child">
                {/* TODAY */}
                {expensesOfCurrentDate.length > 0 ? (
                  <ConditionalMessage
                    condition={expensesOfCurrentDate.length > 0}
                    type={`Today`}
                    message={
                      expensesOfCurrentDate.length === 1
                        ? `You have ${expensesOfCurrentDate.length} expense today - TOTAL: PHP ${totalCurrent}`
                        : `You have ${expensesOfCurrentDate.length} expenses today - TOTAL: PHP ${totalCurrent}`
                    }
                  />
                ) : (
                  <ConditionalMessage
                    condition={expensesOfCurrentDate.length === 0}
                    type={`Today`}
                    message={`You have no expenses today.`}
                  />
                )}

                {/* YESTERDAY */}
                {expensesOfYesterday.length > 0 ? (
                  <ConditionalMessage
                    condition={expensesOfYesterday.length > 0}
                    type={`Yesterday`}
                    message={
                      expensesOfYesterday.length === 1
                        ? `You have ${expensesOfYesterday.length} expense yesterday - TOTAL: PHP ${totalYesterday}`
                        : `You have ${expensesOfYesterday.length} expenses yesterday - TOTAL: PHP ${totalYesterday}`
                    }
                  />
                ) : (
                  <ConditionalMessage
                    condition={expensesOfYesterday.length === 0}
                    type={`Yesterday`}
                    message={`You did not spend on anything yesterday!`}
                  />
                )}

                {/* THIS WEEK */}
                {countExpensesThisWeek.length > 0 ? (
                  <ConditionalMessage
                    condition={countExpensesThisWeek.length > 0}
                    type={`This Week`}
                    message={
                      countExpensesThisWeek.length === 1
                        ? `You have ${countExpensesThisWeek.length} expense this week - TOTAL: PHP ${totalThisWeek}`
                        : `You have ${countExpensesThisWeek.length} expenses this week - TOTAL: PHP ${totalThisWeek}`
                    }
                  />
                ) : (
                  <ConditionalMessage
                    condition={countExpensesThisWeek.length === 0}
                    type={`This Week`}
                    message={`You have no expenses this week`}
                  />
                )}

                {/* LAST WEEK */}
                {expensesOfPrevWeek.length > 0 ? (
                  <ConditionalMessage
                    condition={expensesOfPrevWeek.length > 0}
                    type={`Last Week`}
                    message={
                      expensesOfPrevWeek.length === 1
                        ? `You have ${expensesOfPrevWeek.length} expense last week - TOTAL: PHP ${totalPrevWeek}`
                        : `You have ${expensesOfPrevWeek.length} expenses last week - TOTAL: PHP ${totalPrevWeek}`
                    }
                  />
                ) : (
                  <ConditionalMessage
                    condition={expensesOfPrevWeek.length === 0}
                    type={`Last Week`}
                    message={`You have no expenses last week`}
                  />
                )}

                <BarChart />
              </div>

              <div className="expenses-child">
                {expensesOfCurrentMonth.length > 0 ? (
                  <>
                    <ConditionalMessage
                      condition={expensesOfCurrentMonth.length > 0}
                      type={`This Month's Expenses`}
                      message={
                        expensesOfCurrentMonth.length === 1
                          ? `You have ${expensesOfCurrentMonth.length} expense this month - TOTAL: PHP ${totalCurrMonth}`
                          : `You have ${expensesOfCurrentMonth.length} expenses this month - TOTAL: PHP ${totalCurrMonth}`
                      }
                    />
                  </>
                ) : (
                  <ConditionalMessage
                    condition={expensesOfCurrentMonth.length === 0}
                    type={`This Month's Expenses`}
                    message={`You have no expenses this month`}
                  />
                )}

                <MonthList />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
