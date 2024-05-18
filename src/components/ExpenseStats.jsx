import { useState, useCallback, useEffect, useMemo } from "react";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { getUser } from "../utils/getUser";
import { successAlert, errorAlert } from "../utils/toastAlert";

export default function ExpenseStats({totalAmount}) {
  const [balance, setBalance] = useState(0);
  const [clickBalance, setClickBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState("");

  // fetch balance
  const db = useMemo(() => getDatabase(), []);
  const { userId } = useMemo(() => getUser(), []);

  const fetchData = useCallback(() => {
    const balanceRef = ref(db, `users/${userId}/balance`);
    const unsubscribe = onValue(balanceRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.amount) {
        setBalance(data.amount);
      } else {
        setBalance(0);
      }
    });

    return () => unsubscribe();
  }, [userId, db]);

  useEffect(() => fetchData(), [fetchData]);

  const handleBalanceSubmit = async (event) => {
    event.preventDefault();
    const amount = parseFloat(balanceInput);
    if (isNaN(amount) || amount <= 0) {
      errorAlert("Please enter a valid amount.");
      return;
    }

    const balanceRef = ref(db, `users/${userId}/balance`);

    try {
      await runTransaction(balanceRef, (currentBalance) => {
        if (currentBalance === null) {
          return { amount: amount };
        } else {
          return { amount: currentBalance.amount + amount }; 
        }
      });
      successAlert("Balance updated successfully");
      setBalanceInput("");
    } catch (error) {
      errorAlert("Failed to update balance. Please try again.");
    } finally {
      setClickBalance(false);
    }
  };

  return (
    <div className="expense-container">
      <div className="expense-child">
        <div className="currency">
          <p>{balance.toFixed(2)}</p>
          {clickBalance ? (
            <>
              <input
                type="number"
                placeholder="Add balance"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
              />
              <button onClick={handleBalanceSubmit}>
                <i className="bi bi-plus-lg"></i>
              </button>
            </>
          ) : (
            <button onClick={() => setClickBalance(true)}>
              <i className="bi bi-plus-lg"></i>
            </button>
          )}
        </div>
        <h3>Balance</h3>
      </div>

      <div className="expense-child child-col">
        <div>
          <p>{totalAmount.toFixed(2)}</p>
          <h3>Expenses</h3>
        </div>
      </div>
    </div>
  );
}