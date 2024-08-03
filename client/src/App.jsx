import React, {useState, useEffect} from 'react';
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import "@/common/styles/default.sass";
import "@/common/styles/spinner.sass";
import HeaderComponent from "./common/components/Header";
import {SpeedtestProvider} from "./common/contexts/Speedtests";
import {ConfigProvider} from "./common/contexts/Config";
import {StatusProvider} from "./common/contexts/Status";
import {InputDialogProvider} from "@/common/contexts/InputDialog/InputDialog";
import i18n from './i18n';
import Loading from "@/pages/Loading";
import Error from "@/pages/Error";
import {ToastNotificationProvider} from "@/common/contexts/ToastNotification";
import {NodeProvider} from "@/common/contexts/Node";
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from "@fortawesome/free-brands-svg-icons";
import {PushOverIcon} from "@/common/assets/icons/pushover";
import Nodes from "@/pages/Nodes";
import Statistics from "@/pages/Statistics";
import Home from "@/pages/Home";

library.add(fas, fab);
library.add(PushOverIcon);

const Providers = ({children}) => (
    <InputDialogProvider>
        <ToastNotificationProvider>
            <ConfigProvider>
                <NodeProvider>
                    <SpeedtestProvider>
                        <StatusProvider>
                            {children}
                        </StatusProvider>
                    </SpeedtestProvider>
                </NodeProvider>
            </ConfigProvider>
        </ToastNotificationProvider>
    </InputDialogProvider>
);

const App = () => {
    const [translationsLoaded, setTranslationsLoaded] = useState(false);
    const [translationError, setTranslationError] = useState(false);

    useEffect(() => {
        i18n.on("initialized", () => setTranslationsLoaded(true));
        i18n.on("failedLoading", () => setTranslationError(true));
    }, []);

    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <Providers>
                    <HeaderComponent/>
                    <main><Outlet/></main>
                </Providers>
            ),
            children: [
                {path: "/", element: <Home/>},
                {path: "/nodes", element: <Nodes/>},
                {path: "/statistics", element: <Statistics/>}
            ]
        }
    ]);

    if (!translationsLoaded && !translationError) {
        return <Loading/>;
    }

    if (translationError) {
        return <Error text="Failed to load translations"/>;
    }

    return <RouterProvider router={router}/>;
};

export default App;
