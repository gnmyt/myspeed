import './App.sass';
import Home from "./pages/Home";
import HeaderComponent from "./common/components/Header";
import {SpeedtestProvider} from "./common/contexts/Speedtests";
import {ConfigProvider} from "./common/contexts/Config";
import {StatusProvider} from "./common/contexts/Status";
import {InputDialogProvider} from "@/common/contexts/InputDialog/InputDialog";

const App = () => {

    return (
        <>
            <SpeedtestProvider>
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
            </SpeedtestProvider>
        </>
    );
}

export default App;
