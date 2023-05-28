import "@/common/styles/default.sass";
import "@/common/styles/fonts.sass";
import "@/common/styles/spinner.sass";
import Home from "./pages/Home";
import HeaderComponent from "./common/components/Header";
import {SpeedtestProvider} from "./common/contexts/Speedtests";
import {ConfigProvider} from "./common/contexts/Config";
import {StatusProvider} from "./common/contexts/Status";
import {InputDialogProvider} from "@/common/contexts/InputDialog/InputDialog";
import {useContext, useState} from "react";
import i18n from './i18n';
import Loading from "@/pages/Loading";
import Error from "@/pages/Error";
import {ViewContext, ViewProvider} from "@/common/contexts/View";
import Statistics from "@/pages/Statistics";
import {t} from "i18next";
import {ToastNotificationProvider} from "@/common/contexts/ToastNotification";
import Nodes from "@/pages/Nodes";
import {NodeProvider} from "@/common/contexts/Node";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, fab);

const MainContent = () => {
    const [view] = useContext(ViewContext);
    return (
        <main>
            {view === 0 && <Home/>}
            {view === 1 && <Statistics/>}
            {view !== 0 && view !== 1 && <Error text={t("errors.invalid_view")} disableReload={true}/>}
        </main>
    );
}

const App = () => {
    const [translationsLoaded, setTranslationsLoaded] = useState(false);
    const [translationError, setTranslationError] = useState(false);

    const [showNodePage, setShowNodePage] = useState(false);

    i18n.on("initialized", () => setTranslationsLoaded(true));
    i18n.on("failedLoading", () => setTranslationError(true));

    return (
        <>
            {!translationsLoaded && !translationError && <Loading/>}
            {translationError && <Error text="Failed to load translations"/>}
            {!translationError && translationsLoaded && <InputDialogProvider>
                <ToastNotificationProvider>
                    <ConfigProvider showNodePage={setShowNodePage}>
                        <NodeProvider>
                            {showNodePage && <Nodes setShowNodePage={setShowNodePage}/>}
                            {!showNodePage && <SpeedtestProvider>
                                <ViewProvider>
                                    <StatusProvider>
                                        <HeaderComponent showNodePage={setShowNodePage}/>
                                        <MainContent/>
                                    </StatusProvider>
                                </ViewProvider>
                            </SpeedtestProvider>}
                        </NodeProvider>
                    </ConfigProvider>
                </ToastNotificationProvider>
            </InputDialogProvider>}
        </>
    );
}

export default App;
