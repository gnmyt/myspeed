import './App.sass';
import LatestTestComponent from "./components/LatestTestComponent";
import HeaderComponent from "./components/HeaderComponent";
import TestAreaComponent from "./components/TestAreaComponent";
import {ConfigProvider} from "./context/ConfigContext";
import {DialogProvider} from "./context/DialogContext";
import {SpeedtestProvider} from "./context/SpeedtestContext";
import {StatusProvider} from "./context/StatusContext";

function App() {

    return (
        <>
            <SpeedtestProvider>
                <DialogProvider>
                    <ConfigProvider>
                        <StatusProvider>

                            <HeaderComponent/>
                            <main>
                                <LatestTestComponent/>

                                <hr/>

                                <TestAreaComponent/>
                            </main>

                        </StatusProvider>
                    </ConfigProvider>
                </DialogProvider>
            </SpeedtestProvider>
        </>
    );
}

export default App;
