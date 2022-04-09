import './App.sass';
import LatestTestComponent from "./components/LatestTestComponent";
import HeaderComponent from "./components/HeaderComponent";
import TestAreaComponent from "./components/TestAreaComponent";
import {ConfigProvider} from "./context/ConfigContext";
import {DialogProvider} from "./context/DialogContext";

function App() {

    return (
        <div className="App">
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
        </div>
    );
}

export default App;
