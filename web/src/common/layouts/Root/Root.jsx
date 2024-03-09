import {Outlet} from "react-router-dom";
import Navigation from "@/common/components/Navigation";
import "./styles.sass";
import {useEffect} from "react";

export const Root = () => {

    useEffect(() => {
        const handleKeydown = (event) => {
            if (event.ctrlKey && (event.key === "+" || event.key === "-")) event.preventDefault();
        }

        const handleWheel = (event) => {
            if (event.ctrlKey) event.preventDefault();
        }

        document.addEventListener("keydown", handleKeydown);
        document.addEventListener("wheel", handleWheel, {passive: false});

        return () => {
            document.removeEventListener("keydown", handleKeydown);
            document.removeEventListener("wheel", handleWheel);
        }
    }, []);

    return (
        <>
            <Navigation />
            <main>
                <Outlet/>
            </main>
        </>
  );
}