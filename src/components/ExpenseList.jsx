import { useEffect, useState, useCallback } from "react";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { getUser } from "../utils/getUser";

// ALERTS AND MODAL
import { successAlert, errorAlert } from "../utils/toastAlert";
import { Modal, Button } from "react-bootstrap";

export default function ExpenseList({ setTotalAmount, setIsLoading }) {
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = getUser();

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null); // Store expense to delete

  const db = getDatabase();

  // THIS IS FOR FETCHING WOOF
  const fetchData = useCallback(() => {
    const unsubscribe = onValue(
      ref(db, `users/${userId}/expenses`),
      (snapshot) => {
        const userExpenses = snapshot.val() || {};
        const allExpenses = Object.entries(userExpenses)
          .map(([expenseId, expense]) => ({
            expenseId,
            ...expense,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        const totalAmount = allExpenses.reduce(
          (total, expense) => total + Number(expense.amount),
          0
        );

        setTotalAmount(totalAmount);
        setExpenses(allExpenses);
        setLoading(false);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, db, setTotalAmount, setLoading, setIsLoading]);

  useEffect(() => fetchData(), [fetchData]);

  // THIS IS FOR DELETING WOOF
  const handleDelete = useCallback((expenseId) => {
    setIsModalOpen(true);
    setExpenseToDelete(expenseId);
  }, []);

  const confirmDelete = useCallback(() => {
    if (expenseToDelete) {
      remove(ref(db, `users/${userId}/expenses/${expenseToDelete}`));
      setIsModalOpen(false);
      setDeleteSuccess(true);
    }
  }, [db, userId, expenseToDelete]);

  useEffect(() => {
    if (deleteSuccess) {
      successAlert("Expense deleted successfully!");
      setDeleteSuccess(false);
    }
  }, [deleteSuccess]);

  // THIS IS FOR EDITING WOOF
  const handleEdit = useCallback(
    (updatedExpense, expenseId) => {
      if (!validateInput(updatedExpense.type, updatedExpense.amount)) {
        errorAlert(
          "Invalid input. Please enter a valid expense name and amount."
        );
        return;
      }
      update(ref(db, `users/${userId}/expenses/${expenseId}`), {
        type: updatedExpense.type,
        amount: updatedExpense.amount,
      })
        .then(() => {
          setEditExpense(null);
          successAlert("Edited Successfully");
        })
        .catch((error) => console.error("Error updating expense: ", error));
    },
    [db, userId]
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Expense</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure to delete this expense?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <h2 className="h2">Your Expenses</h2>
      {loading ? (
        <h5 className="h5">Loading...</h5>
      ) : (
        <>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {expenses.map((expense) => (
              <div key={expense.expenseId}>
                {editExpense === expense.expenseId ? (
                  <div className="change-container">
                    <div>
                      <div className="input-logo">
                        <i class="bi bi-tag-fill"></i>

                        <input
                          type="text"
                          value={expense.type}
                          className="expense-input"
                          onChange={(e) =>
                            setExpenses((prevExpenses) =>
                              prevExpenses.map((prevExpense) =>
                                prevExpense.expenseId === expense.expenseId
                                  ? { ...prevExpense, type: e.target.value }
                                  : prevExpense
                              )
                            )
                          }
                        />
                      </div>

                      <div className="input-logo">
                        <i class="bi bi-cash"></i>
                        <input
                          type="number"
                          value={expense.amount}
                          className="expense-input"
                          onChange={(e) =>
                            setExpenses((prevExpenses) =>
                              prevExpenses.map((prevExpense) =>
                                prevExpense.expenseId === expense.expenseId
                                  ? { ...prevExpense, amount: e.target.value }
                                  : prevExpense
                              )
                            )
                          }
                        />
                      </div>
                    </div>

                    <button
                      className="expense-add-btn"
                      onClick={() => handleEdit(expense, expense.expenseId)}
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div className="expenses-list">
                    <div className="list-child">
                      <h4>{expense.type}</h4>
                      <div className="list-buttons">
                        <p className="month-date">{formatDate(expense.date)}</p>

                        <a onClick={() => setEditExpense(expense.expenseId)}>
                          <img
                            src="/pencil.png"
                            alt="Edit"
                            className="edit-btn"
                          />
                        </a>

                        <a onClick={() => handleDelete(expense.expenseId)}>
                          <img
                            src="/trash.png"
                            alt="Delete"
                            className="delete-btn"
                          />
                        </a>
                      </div>
                    </div>
                    <p>{expense.amount}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function validateInput(type, amount) {
  const typeRegex = /^[a-zA-Z0-9\s]*$/;
  const isType = typeRegex.test(type);

  // Check if the type is a string and the amount is a number
  if (!type || !amount) {
    return false;
  }
  if (!isType) {
    return false;
  }
  if (amount <= 0) {
    return false;
  }
  return true;
}
