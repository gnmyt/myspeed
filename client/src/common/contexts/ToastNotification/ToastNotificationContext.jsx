import React, {createContext, useRef, useState} from "react";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const ToastNotificationContext = createContext({});

export const ToastNotificationProvider = (props) => {

    const notificationRef = useRef();
    const [timeOutId, setTimeOutId] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);

    const updateToast = (text, color = "red", icon = faExclamationTriangle) => {
        setToastNotification({text, color, icon});

        if (timeOutId) {
            clearTimeout(timeOutId);
            setTimeOutId(null);
        }
        setTimeOutId(setTimeout(close, 5000));
    }

    const close = () => {
        notificationRef.current.classList.add("toast-hidden");
    }

    const onAnimationEnd = (event) => {
        if (event.animationName === "moveOut")
            setToastNotification(null);
    }

    return (
        <ToastNotificationContext.Provider value={updateToast}>
            <div className={"toast-notification" + (toastNotification ? "" : " toast-hidden") + " toast-" + toastNotification?.color}
                 onAnimationEnd={onAnimationEnd} ref={notificationRef} onClick={close}>
                {toastNotification && <div className="toast-content">
                    <FontAwesomeIcon icon={toastNotification.icon} />
                    <h2>{toastNotification.text}</h2>
                </div>}
            </div>

            {props.children}
        </ToastNotificationContext.Provider>
    );
}