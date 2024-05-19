import { useState } from "react";
import "../styles/expense.css";

// Components
import ExpenseInput from "../components/ExpenseInput";
import ExpenseList from "../components/ExpenseList";
import ExpenseStats from "../components/ExpenseStats";

export default function Expense() {
  const [date] = useState(new Date());
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <div className="expense-heading">
        <h1 className="h1">Expenses</h1>
        <p className="date-today">
          {date.toLocaleDateString("default", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <ExpenseStats totalAmount={totalAmount}/>

      <div className="container-two">
        <ExpenseInput />

        <ExpenseList
          setTotalAmount={setTotalAmount}
          setIsLoading={setIsLoading}
        />
      </div>
    </>
  );
}
