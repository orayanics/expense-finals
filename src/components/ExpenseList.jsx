import { useEffect, useState, useCallback } from "react";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { getUser } from "../utils/getUser";

// ALERTS AND MODAL
import { successAlert, errorAlert } from "../utils/toastAlert";
import { Modal, Button } from "react-bootstrap";

// Import date-fns functions
import {
  startOfToday,
  endOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export default function ExpenseList({ setTotalAmount, setIsLoading }) {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = getUser();

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [sortByToday, setSortByToday] = useState(false);
  const [sortByWeek, setSortByWeek] = useState(false);
  const [sortByMonth, setSortByMonth] = useState(false);

  const db = getDatabase();

  // Fetch data from Firebase
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
        setFilteredExpenses(allExpenses);
        setLoading(false);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, db, setTotalAmount, setLoading, setIsLoading]);

  useEffect(() => fetchData(), [fetchData]);

  useEffect(() => {
    let filtered = expenses;

    if (sortByToday) {
      const start = startOfToday();
      const end = endOfToday();
      filtered = expenses.filter((expense) => {
        const date = new Date(expense.date);
        return date >= start && date <= end;
      });
    } else if (sortByWeek) {
      const start = startOfWeek(new Date());
      const end = endOfWeek(new Date());
      filtered = expenses.filter((expense) => {
        const date = new Date(expense.date);
        return date >= start && date <= end;
      });
    } else if (sortByMonth) {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      filtered = expenses.filter((expense) => {
        const date = new Date(expense.date);
        return date >= start && date <= end;
      });
    }

    setFilteredExpenses(filtered);
  }, [sortByToday, sortByWeek, sortByMonth, expenses]);

  // Handle delete action
  const handleDelete = useCallback((expenseId) => {
    setIsModalOpen(true);
    setExpenseToDelete(expenseId);
  }, []);

  // Confirm delete action
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

  // Handle edit action
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
      {/* Modal for confirming delete action */}
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

      <h2 className="h2">Expense List</h2>

      {/* Sorting options */}
      <div className="sort-options">
        <label>
          <input
            type="checkbox"
            checked={sortByToday}
            onChange={() => setSortByToday(!sortByToday)} // Toggle sort by today
            disabled={sortByWeek || sortByMonth} // Disable if sort by week or month is active
          />
          My Expenses Today
        </label>
        <label>
          <input
            type="checkbox"
            checked={sortByWeek}
            onChange={() => setSortByWeek(!sortByWeek)} // Toggle sort by week
            disabled={sortByToday || sortByMonth} // Disable if sort by today or month is active
          />
          My Expenses this Week
        </label>
        <label>
          <input
            type="checkbox"
            checked={sortByMonth}
            onChange={() => setSortByMonth(!sortByMonth)} // Toggle sort by month
            disabled={sortByToday || sortByWeek} // Disable if sort by today or week is active
          />
          My Expenses this Month
        </label>
      </div>

      {loading ? (
        <h5 className="h5">Loading...</h5>
      ) : (
        <>
          <ul>
            {filteredExpenses.map(
              (
                expense // Use filteredExpenses instead of expenses
              ) => (
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
                      <button
                        className="expense-add-btn"
                        onClick={() => handleEdit(expense, expense.expenseId)}
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="expenses-list">
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
                      {expense.type} - PHP {expense.amount}
                    </div>
                  )}
                </li>
              )
            )}
          </ul>
        </>
      )}
    </div>
  );
}

function validateInput(type, amount) {
  const typeRegex = /^[a-zA-Z0-9\s]*$/;
  const isType = typeRegex.test(type);

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
