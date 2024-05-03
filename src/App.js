import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Import Pages
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import AuthProvider from "./components/AuthProvider";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import NotFound from "./pages/NotFound";

// React Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider />,
    errorElement: <NotFound />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/expense",
        element: <Expense />,
      },
    ],
  },
]);


export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
