import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { getUser } from "../utils/getUser";
export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = getUser();

  const db = getDatabase();

  // THIS IS FOR FETCHING WOOF
  useEffect(() => {
    const userRef = ref(db, `users/${userId}/expenses`);

    const fetchData = () => {
      const unsubscribe = onValue(userRef, (snapshot) => {
        const userExpenses = snapshot.val();
        if (userExpenses) {
          const allExpenses = Object.entries(userExpenses).map(
            ([expenseId, expense]) => ({
              expenseId,
              ...expense,
            })
          );

          // sort by date
          const sortedExpenses = allExpenses.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });

          setExpenses(sortedExpenses);
        } else {
          console.log("No expenses found for the user.");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, [userId, db]);

  // THIS IS FOR DELETING WOOF
  const handleDelete = (expenseId) => {
    remove(ref(db, `users/${userId}/expenses/${expenseId}`));
  };

  // THIS IS FOR EDITING WOOF
  const handleEdit = (expenseId, updatedExpense) => {
    const db = getDatabase();
    update(ref(db, `users/${userId}/expenses/${expenseId}`), updatedExpense)
      .then(() => {
        setEditExpense(null);
      })
      .catch((error) => {
        console.error("Error updating expense: ", error);
      });
  };

 return (
   <div>
     <h2>Expense List</h2>
     {loading ? ( // Render loader if data is loading
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
                 <button onClick={() => handleEdit(expense.expenseId, expense)}>
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
     )}
   </div>
 );
}
