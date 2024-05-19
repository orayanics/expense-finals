import { useEffect, useState, useCallback, useRef } from "react";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { getUser } from "../utils/getUser";

// ALERTS AND MODAL
import { successAlert, errorAlert } from "../utils/toastAlert";
import { Modal, Button } from "react-bootstrap";
import { Spinner } from "react-bootstrap";

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
  const editRef = useRef(null);

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

  // outside clickers hahauhs
  useEffect(() => {
    function handleClickOutside(event) {
      if (editRef.current && !editRef.current.contains(event.target)) {
        setEditExpense(null);
      }
    }

    if (editExpense) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editExpense]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "PHP",
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
      {/* Sorting options */}
      <div className="sort-options">
        <label>
          <input
            type="checkbox"
            checked={sortByToday}
            onChange={() => setSortByToday(!sortByToday)}
            disabled={sortByWeek || sortByMonth}
          />
          Today
        </label>
        <label className="sort-option">
          <input
            type="checkbox"
            checked={sortByWeek}
            onChange={() => setSortByWeek(!sortByWeek)}
            disabled={sortByToday || sortByMonth}
          />
          This Week
        </label>
        <label>
          <input
            type="checkbox"
            checked={sortByMonth}
            onChange={() => setSortByMonth(!sortByMonth)}
            disabled={sortByToday || sortByWeek}
          />
          This Month
        </label>
      </div>
      {loading ? (
        <div>
          <Spinner animation="border" variant="warning" className="loading" />
        </div>
      ) : (
        <>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {filteredExpenses.map((expense) => (
              <div key={expense.expenseId}>
                {editExpense === expense.expenseId ? (
                  <div className="change-container" ref={editRef}>
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
                    <div className="amount-overflow">
                      <p>{`${formatCurrency(expense.amount)}`}</p>
                    </div>
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
