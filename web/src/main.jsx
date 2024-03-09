import React from "react";
import ReactDOM from "react-dom/client";
import "@/common/styles/fonts.sass";
import "@/common/styles/default.sass";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "@/common/layouts/Root";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Imprint from "@/pages/Imprint";
import Privacy from "@/pages/Privacy";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <NotFound />,
        children: [
            {path: "/", element: <Home />},
            {path: "/install", element: <h2>Install</h2>},
            {path: "/tutorials", element: <h2>Tutorials</h2>},
            {path: "/imprint", element: <Imprint />},
            {path: "/privacy", element: <Privacy />},
        ]
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
);