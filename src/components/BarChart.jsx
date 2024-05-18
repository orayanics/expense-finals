import { useMemo, useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getUser } from "../utils/getUser";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive:  true,
  plugins:  {
    legend:  {
      position:  "top",
    },
    title:  {
      display:  true,
      text:  "Your Expenses for the Last 3 Months",
    },
  },
};

export default function BarChart() {
  const { userId } = getUser();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    onValue(
      ref(db, `users/${userId}/expenses`),
      (snapshot) => {
        const expensesData = snapshot.val();
        const formattedExpenses = expensesData ? Object.values(expensesData) :  [];
        setExpenses(formattedExpenses);
      },
      {
        onlyOnce:  true,
      }
    );
  }, [userId]);

  const data = useMemo(() => {
    const lastThreeMonths = getLastThreeMonths();
    const totalExpenses = lastThreeMonths.map(() => 0);

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      lastThreeMonths.forEach((month, index) => {
        if (
          expenseDate.getMonth() === month.month &&
          expenseDate.getFullYear() === month.year
        ) {
          totalExpenses[index] += expense.amount;
        }
      });
    });

    return {
      labels:  lastThreeMonths.map(
        (month) => `${month.monthName} ${month.year}`
      ),
      datasets:  [
        {
          label:  "Total Expenses",
          data:  totalExpenses,
          backgroundColor:  "rgba(247, 212, 14, 0.5)",
        },
      ],
    };
  }, [expenses]);

  return <Bar options={options} data={data} />;
}

function getLastThreeMonths() {
  const today = new Date();
  const months = [];
  for (let i = 2; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      month:  date.getMonth(),
      year:  date.getFullYear(),
      monthName:  date.toLocaleString("default", { month:  "long" }),
    });
  }
  return months;
}