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

  return (
    <div>
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure to delete this item?</p>
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

      <h2>Expense List</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.expenseId}>
                {editExpense === expense.expenseId ? (
                  <div>
                    <input
                      type="text"
                      value={expense.type}
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
                    <input
                      type="number"
                      value={expense.amount}
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
                    <button
                      onClick={() => handleEdit(expense, expense.expenseId)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    Type: {expense.type}, Amount: {expense.amount}
                    <button onClick={() => setEditExpense(expense.expenseId)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(expense.expenseId)}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.expenseId}>
              {editExpense === expense.expenseId ? (
                <div>
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
                  <button className="expense-add-btn"
                    onClick={() => handleEdit(expense, expense.expenseId)}
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <div className="expenses-list">
                  {/* <button onClick={() => setEditExpense(expense.expenseId)}>
                    Edit
                  </button> */}
                  <a onClick={() => setEditExpense(expense.expenseId)}><img src="/pencil.png" alt="Edit" className="edit-btn" /></a>
                  {/* <button onClick={() => handleDelete(expense.expenseId)}>
                    Delete
                  </button> */}
                  <a onClick={() => handleDelete(expense.expenseId)}><img src="/trash.png" alt="Delete" className="delete-btn" /></a>
                  {expense.type} - PHP {expense.amount}
                
                </div>
              )}
            </li>
          ))}
        </ul>
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
