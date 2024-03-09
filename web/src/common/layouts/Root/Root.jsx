import {Outlet} from "react-router-dom";
import Navigation from "@/common/components/Navigation";
import "./styles.sass";

export const Root = () => {
    return (
        <>
            <Navigation />
            <main>
                <Outlet/>
            </main>
        </>
  );
}