import { useState } from "react";

// Components
import ExpenseInput from "../components/ExpenseInput";
import ExpenseList from "../components/ExpenseList";

// Utils
import ConditionalMessage from "../components/ConditionalMessage";

export default function Expense() {
  const [date] = useState(new Date());
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <div>
        <h1>Expenses</h1>
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
        <ConditionalMessage condition={!isLoading} message={`Total Amount: ${totalAmount}`} />
      </div>
    </>
  );
}
