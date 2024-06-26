import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Import Pages
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import Login from "./pages/Login";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import Faqs from "./pages/Faqs";
import Contact from "./pages/Contact";

// React Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
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
  {
    path: "/how",
    element: <HowItWorks />,
  },
  {
    path: "/faqs",
    element: <Faqs />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
]);


export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
