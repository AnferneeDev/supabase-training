import { createBrowserRouter } from "react-router-dom";
import Singin from "./components/Singin.jsx";
import Dashboard from "./routes/Dashboard.jsx";
import Header from "./components/Header.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Singin />,
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