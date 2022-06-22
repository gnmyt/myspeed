import './App.sass';
import LatestTestComponent from "./components/LatestTestComponent";
import HeaderComponent from "./components/HeaderComponent";
import TestAreaComponent from "./components/TestAreaComponent";
import {ConfigProvider} from "./context/ConfigContext";
import {DialogProvider} from "./context/DialogContext";
import {SpeedtestProvider} from "./context/SpeedtestContext";

function App() {

    return (
        <>
            <SpeedtestProvider>
                <DialogProvider>
                    <ConfigProvider>

                        <HeaderComponent/>
                        <main>
                            <LatestTestComponent/>

                            <hr/>

                            <TestAreaComponent/>
                        </main>

                    </ConfigProvider>
                </DialogProvider>
            </SpeedtestProvider>
        </>
    );
}

export default App;
