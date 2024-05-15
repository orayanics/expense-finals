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
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Your Expenses for the Last 3 Months",
    },
  },
};

export default function BarChart() {
  const { userId } = getUser();
  const [expenses, setExpenses] = useState([]);

  // Fetching Data
  useEffect(() => {
    const db = getDatabase();
    console.log(getLastThreeMonths())
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

const data = useMemo(() => {
  const lastThreeMonths = getLastThreeMonths();
  const monthlyExpenses = [[], [], []];
  let totalExpenses = [0, 0, 0];

  expenses.forEach((expense) => {
    let expenseDate = new Date(expense.date);
    for (let i = 0; i < 3; i++) {
      if (
        expenseDate.getMonth() === lastThreeMonths[i].month.getMonth() &&
        expenseDate.getFullYear() === lastThreeMonths[i].month.getFullYear()
      ) {
        monthlyExpenses[i].push(expense);
        totalExpenses[i] += expense.amount;
      }
    }
  });

  return {
    labels: lastThreeMonths.map(
      (month) =>
        `${month.month.toLocaleString("default", { month: "long" })} ${
          month.year
        }`
    ),
    datasets: [
      {
        label: "Total Expenses",
        data: totalExpenses,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
}, [expenses]);

  return <Bar options={options} data={data} />;
}

function getLastThreeMonths() {
  const today = new Date();
  const months = [];

  // Loop through the last three months
  for (let i = 2; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      month: date,
      year: date.getFullYear(),
    });
  }

  return months;
}