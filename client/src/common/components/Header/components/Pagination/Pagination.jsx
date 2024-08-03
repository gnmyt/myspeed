import "./styles.sass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartArea, faListUl } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {t} from "i18next";

export const Pagination = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeIndex, setActiveIndex] = useState(location.pathname === "/" ? 0 : 1);
    const paginationRef = useRef(null);
    const activeItemRef = useRef(null);

    useEffect(() => {
        const currentIndex = location.pathname === "/" ? 0 : 1;
        setActiveIndex(currentIndex);
    }, [location.pathname]);

    useEffect(() => {
        const updateActiveBackground = () => {
            if (paginationRef.current && activeItemRef.current) {
                const { offsetLeft, offsetWidth } = activeItemRef.current;
                paginationRef.current.style.setProperty('--active-left', `${offsetLeft}px`);
                paginationRef.current.style.setProperty('--active-width', `${offsetWidth}px`);
            }
        };

        updateActiveBackground();
        window.addEventListener('resize', updateActiveBackground);
        return () => window.removeEventListener('resize', updateActiveBackground);
    }, [activeIndex]);

    return (
        <div className="pagination" ref={paginationRef}>
            <div
                className={`pagination-item${activeIndex === 0 ? " page-active" : ""}`}
                onClick={() => {
                    navigate("/");
                    setActiveIndex(0);
                }}
                ref={activeIndex === 0 ? activeItemRef : null}
            >
                <FontAwesomeIcon icon={faListUl}/>
                <p>{t("page.overview")}</p>
            </div>
            <div
                className={`pagination-item${activeIndex === 1 ? " page-active" : ""}`}
                onClick={() => {
                    navigate("/statistics");
                    setActiveIndex(1);
                }}
                ref={activeIndex === 1 ? activeItemRef : null}
            >
                <FontAwesomeIcon icon={faChartArea}/>
                <p>{t("page.statistics")}</p>
            </div>
            <div className="pagination-active-background"></div>
        </div>
    );
};
