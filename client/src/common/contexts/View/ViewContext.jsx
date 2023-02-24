import React, {useState, createContext} from "react";

export const ViewContext = createContext({});

export const ViewProvider = (props) => {
    const [view, setView] = useState(parseInt(localStorage.getItem("view")) || 0);

    const updateView = (newView) => {
        setView(newView);
        localStorage.setItem("view", newView);
    }

    return (
        <ViewContext.Provider value={[view, updateView]}>
            {props.children}
        </ViewContext.Provider>
    )
}