import { useState } from "react";
import "../styles/expense.css";

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

      <div className="expense-container">
        <div className="expense-child">
          <div className="currency">
            <p>0.000</p>
            <i class="bi bi-plus-lg"></i>
          </div>

          <h3>Balance</h3>
        </div>

        <div className="expense-child child-col">
          <div>
            <p>0.000</p>
            <h3>Expenses</h3>
          </div>

          <div>
            <p>0.000</p>
            <h3>Income</h3>
          </div>
        </div>
      </div>

      <div className="container-two">
        <ExpenseInput />

        <ExpenseList
          setTotalAmount={setTotalAmount}
          setIsLoading={setIsLoading}
        />
      </div>

      {/* <div>
        <ExpenseInput />
      </div>

      <div>
        
      </div>

      {isLoading ? (
        <h6>Loading...</h6>
      ) : (
        <div className="expenses-total">
          <ConditionalMessage
            condition={!isLoading}
            message={`Total Amount: PHP ${totalAmount}`}
          />
        </div>
      )} */}
    </>
  );
}
