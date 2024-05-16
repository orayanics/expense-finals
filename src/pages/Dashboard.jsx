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

  useEffect(() => {
    const dbRef = ref(getDatabase(), `users/${userId}/expenses`);
    setIsLoading(true);
    const unsubscribe = onValue(
      dbRef,
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
    return () => unsubscribe();
  }, [userId]);

  const {
    startOfWeek,
    endOfWeek,
    startOfPrevWeek,
    endOfPrevWeek,
    startOfMonth,
    endOfMonth,
    startOfCurrentDate,
    endOfCurrentDate,
    startOfYesterday,
    endOfYesterday,
  } = useMemo(() => {
    return calculateDateRanges();
  }, []);

  const {
    countExpensesThisWeek,
    totalThisWeek,
    expensesOfPrevWeek,
    totalPrevWeek,
    expensesOfCurrentMonth,
    totalCurrMonth,
    expensesOfCurrentDate,
    totalCurrent,
    expensesOfYesterday,
    totalYesterday,
  } = useMemo(() => {
    return calculateExpenseSummaries(expenses, {
      startOfWeek,
      endOfWeek,
      startOfPrevWeek,
      endOfPrevWeek,
      startOfMonth,
      endOfMonth,
      startOfCurrentDate,
      endOfCurrentDate,
      startOfYesterday,
      endOfYesterday,
    });
  }, [
    expenses,
    startOfWeek,
    endOfWeek,
    startOfPrevWeek,
    endOfPrevWeek,
    startOfMonth,
    endOfMonth,
    startOfCurrentDate,
    endOfCurrentDate,
    startOfYesterday,
    endOfYesterday,
  ]);

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
                <ConditionalMessage
                  condition={expensesOfCurrentDate.length > 0}
                  type={`Today`}
                  message={`You have ${expensesOfCurrentDate.length} expense${
                    expensesOfCurrentDate.length === 1 ? "" : "s"
                  } today - TOTAL:  PHP ${totalCurrent}`}
                />
                <ConditionalMessage
                  condition={expensesOfYesterday.length > 0}
                  type={`Yesterday`}
                  message={`You have ${expensesOfYesterday.length} expense${
                    expensesOfYesterday.length === 1 ? "" : "s"
                  } yesterday - TOTAL:  PHP ${totalYesterday}`}
                />
                <ConditionalMessage
                  condition={countExpensesThisWeek.length > 0}
                  type={`This Week`}
                  message={`You have ${countExpensesThisWeek.length} expense${
                    countExpensesThisWeek.length === 1 ? "" : "s"
                  } this week - TOTAL:  PHP ${totalThisWeek}`}
                />
                <ConditionalMessage
                  condition={expensesOfPrevWeek.length > 0}
                  type={`Last Week`}
                  message={`You have ${expensesOfPrevWeek.length} expense${
                    expensesOfPrevWeek.length === 1 ? "" : "s"
                  } last week - TOTAL:  PHP ${totalPrevWeek}`}
                />
                <BarChart />
              </div>

              <div className="expenses-child">
                <ConditionalMessage
                  condition={expensesOfCurrentMonth.length > 0}
                  type={`This Month's Expenses`}
                  message={`You have ${expensesOfCurrentMonth.length} expense${
                    expensesOfCurrentMonth.length === 1 ? "" : "s"
                  } this month - TOTAL:  PHP ${totalCurrMonth}`}
                />
                <MonthList />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

function calculateDateRanges() {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek.getTime());
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfPrevWeek = new Date(startOfWeek.getTime());
  startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7);
  const endOfPrevWeek = new Date(startOfPrevWeek.getTime());
  endOfPrevWeek.setDate(startOfPrevWeek.getDate() + 6);
  endOfPrevWeek.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const startOfCurrentDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const endOfCurrentDate = new Date(startOfCurrentDate.getTime());
  endOfCurrentDate.setHours(23, 59, 59, 999);

  const startOfYesterday = new Date(startOfCurrentDate.getTime());
  startOfYesterday.setDate(startOfCurrentDate.getDate() - 1);
  const endOfYesterday = new Date(startOfYesterday.getTime());
  endOfYesterday.setHours(23, 59, 59, 999);

  return {
    startOfWeek,
    endOfWeek,
    startOfPrevWeek,
    endOfPrevWeek,
    startOfMonth,
    endOfMonth,
    startOfCurrentDate,
    endOfCurrentDate,
    startOfYesterday,
    endOfYesterday,
  };
}

function calculateExpenseSummaries(expenses, dateRanges) {
  const filterExpenses = (start, end) => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  };

  const calculateTotal = (expenses) => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );
  };

  const countExpensesThisWeek = filterExpenses(
    dateRanges.startOfWeek,
    dateRanges.endOfWeek
  );
  const totalThisWeek = calculateTotal(countExpensesThisWeek);

  const expensesOfPrevWeek = filterExpenses(
    dateRanges.startOfPrevWeek,
    dateRanges.endOfPrevWeek
  );
  const totalPrevWeek = calculateTotal(expensesOfPrevWeek);

  const expensesOfCurrentMonth = filterExpenses(
    dateRanges.startOfMonth,
    dateRanges.endOfMonth
  );
  const totalCurrMonth = calculateTotal(expensesOfCurrentMonth);

  const expensesOfCurrentDate = filterExpenses(
    dateRanges.startOfCurrentDate,
    dateRanges.endOfCurrentDate
  );
  const totalCurrent = calculateTotal(expensesOfCurrentDate);

  const expensesOfYesterday = filterExpenses(
    dateRanges.startOfYesterday,
    dateRanges.endOfYesterday
  );
  const totalYesterday = calculateTotal(expensesOfYesterday);

  return {
    countExpensesThisWeek,
    totalThisWeek,
    expensesOfPrevWeek,
    totalPrevWeek,
    expensesOfCurrentMonth,
    totalCurrMonth,
    expensesOfCurrentDate,
    totalCurrent,
    expensesOfYesterday,
    totalYesterday,
  };
}
