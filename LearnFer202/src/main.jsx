import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/global.css";
import TodoApp from "./components/learn/TodoApp.jsx";
import ErrorPage from "./pages/erorr.jsx";
import Login from "./components/login/login.jsx";
import Product from "./components/product/product.jsx";
import { AuthWrapper } from "./components/context/auth.context.jsx";
import Account from "./components/account/account.jsx";
import UserPage from "./pages/user.jsx";
import Supplier from "./components/supllier/supllier.jsx";
import OutOrder from "./components/out-order/out-order.jsx";
import InOrder from "./components/in-order/in-order.jsx";
import AddOutOrder from "./components/out-order/add-out-order.jsx";
import AddInOrder from "./components/in-order/add-in-order.jsx";
import DailyRevenue from "./components/revenue/revenue1day.jsx";
import ImportProductExcelPage from "./components/product/product.import.jsx";
import ImportSupllierExcelPage from "./components/supllier/supllier.import.jsx";
import ImportInOrderExcelPage from "./components/in-order/import.inorder.jsx";
import ImportOutOrderExcelPage from "./components/out-order/out-order-import.jsx";

const router = createBrowserRouter([


  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element:
      <App />,
    children: [
      {
        index: true,
        element: <TodoApp />,
      },
      {
        path: "/products",
        element: <Product />,
      },
      {
        path: "/accounts",
        element: <Account />,
      },
      {
        path: "/customers",
        element: <UserPage />,
      },
      {
        path: "/suppliers",
        element: <Supplier />,
      },
      {
        path: "/out-orders",
        element: <OutOrder />,
      },
      {
        path: "/addin-orders",
        element: <AddInOrder />,
      },
      {
        path: "/addout-orders",
        element: <AddOutOrder/>,
      },
      {
        path: "/in-orders",
        element: <InOrder />,
      },
      {
        path: "/revenue",
        element: <DailyRevenue />,
      },
      {
        path: "/import-product",
        element: <ImportProductExcelPage />,
      },
      {
        path: "/import-supllier",
        element: <ImportSupllierExcelPage />,
      },
      {
        path: "/import-in-order",
        element: <ImportInOrderExcelPage />,
      },
      {
        path: "/import-out-order",
        element: <ImportOutOrderExcelPage />,
      },
      
    ],
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
);
