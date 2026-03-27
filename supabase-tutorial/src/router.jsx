import { createBrowserRouter } from "react-router-dom";
import Singin from "./components/Singin.jsx";
import Singup from "./components/Singup.jsx";
import Dashboard from "./routes/Dashboard.jsx";
import Header from "./components/Header.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Singin />,
  },
  {
    path: "/signup",
    element: <Singup />,
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Header />
        <Dashboard />
      </>
    ),
  },
]);

export default router;