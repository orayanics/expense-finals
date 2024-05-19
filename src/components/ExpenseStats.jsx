import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { getUser } from "../utils/getUser";

// Components
import { successAlert, errorAlert } from "../utils/toastAlert";
import { Button, Modal } from "react-bootstrap";

export default function ExpenseStats({ totalAmount }) {
  const [balance, setBalance] = useState(0);
  const [clickBalance, setClickBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const balanceInputRef = useRef(null);

  // fetch balance
  const db = useMemo(() => getDatabase(), []);
  const { userId } = useMemo(() => getUser(), []);

  const fetchData = useCallback(() => {
    const balanceRef = ref(db, `users/${userId}/balance`);
    const unsubscribe = onValue(balanceRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.amount !== undefined) {
        if (data.amount < 0) {
          setBalance(data.amount);
          setModalShow(true);
        } else {
          setBalance(data.amount);
        }
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
          const newAmount =
            currentBalance.amount < 0 ? amount : currentBalance.amount + amount;
          return { amount: newAmount };
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

  // clickers outside ahuhau
  const handleClickOutside = useCallback((event) => {
    if (
      balanceInputRef.current &&
      !balanceInputRef.current.contains(event.target)
    ) {
      setClickBalance(false);
    }
  }, []);

  useEffect(() => {
    if (clickBalance) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clickBalance, handleClickOutside]);

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "PHP",
    });
  };

  return (
    <>
      <NegativeBalance show={modalShow} onHide={() => setModalShow(false)} />

      <div className="expense-container">
        <div className="expense-child">
          <div className="currency">
            <p>{`${formatCurrency(balance)}`}</p>
            {clickBalance ? (
              <>
                <input
                  ref={balanceInputRef}
                  type="number"
                  placeholder="Add balance"
                  className="add-balance-txt"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                />
                <button onClick={handleBalanceSubmit} className="balance-btn">
                  <i className="bi bi-plus-lg"></i>
                </button>
              </>
            ) : (
              <button
                onClick={() => setClickBalance(true)}
                className="balance-btn"
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            )}
          </div>
          <h3>Balance</h3>
        </div>

        <div className="expense-child child-col">
          <div>
            <p>{formatCurrency(totalAmount)}</p>
            <h3>Expenses</h3>
          </div>
        </div>
      </div>
    </>
  );
}

function NegativeBalance(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h4>Negative Balance</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          It seems like you've been spending more than you have. Consider adding
          more balance to your account. Adding balance will set your balance and
          will not add to the negative balance.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
