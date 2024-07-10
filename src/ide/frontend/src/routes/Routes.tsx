import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout";

export const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
    },
    {
        path: "/ide",
        element: <Layout />,
    }
  ]);
  