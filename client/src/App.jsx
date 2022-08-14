import './App.sass';
import Home from "./pages/Home";
import HeaderComponent from "./common/components/Header";
import {SpeedtestProvider} from "./common/contexts/Speedtests";
import {DialogProvider} from "./common/contexts/Dialog";
import {ConfigProvider} from "./common/contexts/Config";
import {StatusProvider} from "./common/contexts/Status";

const App = () => {

    return (
        <>
            <SpeedtestProvider>
                <DialogProvider>
                    <ConfigProvider>
                        <StatusProvider>

                            <HeaderComponent/>
                            <main>
                                <Home/>
                            </main>

                        </StatusProvider>
                    </ConfigProvider>
                </DialogProvider>
            </SpeedtestProvider>
        </>
    );
}

export default App;
