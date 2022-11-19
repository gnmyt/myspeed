import React from "react";
import {Trans} from "react-i18next";
import {t} from "i18next";

export const averageResultDialog = (timeString, props) => <Trans components={{Bold: <span className="dialog-value"/> }}
                                                                 values={{amount: props.amount, date: timeString, down: props.down,
                                                                     up: props.up, duration: props.duration}}>test.average.description</Trans>

export const resultDialog = (props) => <Trans components={{Bold: <span className="dialog-value"/> }}
                                              values={{down: props.down, up: props.up,
                                                  type: t("test.result." + (props.type === "custom" ? "from_you" : "automatic")),
                                                  duration: props.duration}}>test.result.description</Trans>