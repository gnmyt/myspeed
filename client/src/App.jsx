import './App.sass';
import Home from "./pages/Home";
import HeaderComponent from "./common/components/Header";
import {SpeedtestProvider} from "./common/contexts/Speedtests";
import {ConfigProvider} from "./common/contexts/Config";
import {StatusProvider} from "./common/contexts/Status";
import {InputDialogProvider} from "@/common/contexts/InputDialog/InputDialog";
import {useState} from "react";
import i18n from './i18n';
import Loading from "@/pages/Loading";
import "@/common/styles/spinner.sass";
import Error from "@/pages/Error";

const App = () => {
    const [translationsLoaded, setTranslationsLoaded] = useState(false);
    const [translationError, setTranslationError] = useState(false);

    i18n.on("initialized", () => setTranslationsLoaded(true));
    i18n.on("failedLoading", () => setTranslationError(true));

    return (
        <>
            {!translationsLoaded && !translationError && <Loading/>}
            {translationError && <Error text="Failed to load translations"/>}
            {translationsLoaded && !translationError && <SpeedtestProvider>
                <InputDialogProvider>
                    <ConfigProvider>
                        <StatusProvider>
                            <HeaderComponent/>
                            <main>
                                <Home/>
                            </main>
                        </StatusProvider>
                    </ConfigProvider>
                </InputDialogProvider>
            </SpeedtestProvider>}
        </>
    );
}

export default App;
