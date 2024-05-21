import React from "react";
import {Trans} from "react-i18next";
import {t} from "i18next";

const RESULT_URL = "https://www.speedtest.net/result/c/";

export const averageResultDialog = (timeString, props) => <Trans components={{Bold: <span className="dialog-value"/> }}
                                                                 values={{amount: props.amount, date: timeString, down: props.down,
                                                                     up: props.up, duration: props.duration}}>test.average.description</Trans>

export const resultDialog = (props) => <Trans components={{Bold: <span className="dialog-value"/>,
    Link: (props.resultId ? <a href={RESULT_URL + props.resultId} target="_blank" rel="noreferrer"/> : <span/>) }}
                                              values={{down: props.down, up: props.up,
                                                  type: t("test.result." + (props.type === "custom" ? "from_you" : "automatic")),
                                                  duration: props.duration}}>test.result.description</Trans>