import { useState, useEffect } from "react";

// Components
import ExpenseInput from "../components/ExpenseInput";
import ExpenseList from "../components/ExpenseList";

export default function Expense() {
  const [date, setDate] = useState(new Date());
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <h1>Expense</h1>
        <p>
          {date.toLocaleDateString("default", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div>
        <ExpenseInput />
      </div>

      <div>
        <ExpenseList
          setTotalAmount={setTotalAmount}
          setIsLoading={setIsLoading}
        />
      </div>

      <div>
        {isLoading ? "" : <h2>Total Amount: {totalAmount}</h2>}
      </div>
    </>
  );
}
