import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import i18n, {t} from "i18next";
import {faCheck, faChevronDown, faChevronUp, faFloppyDisk, faTrash, faTrashArrowUp} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {deleteRequest, patchRequest, putRequest} from "@/common/utils/RequestUtil";
import {generateRelativeTime} from "@/pages/Home/components/LatestTest/utils";

export const IntegrationItem = ({integration, data, remove, isOpen}) => {
    const [open, setOpen] = useState(isOpen);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const [changesConfirmed, setChangesConfirmed] = useState(false);
    const [displayName, setDisplayName] = useState(data.displayName || t(`integrations.${integration.name}.title`));

    const [identifier, setIdentifier] = useState(data.id);

    const states = integration.fields.map(field => {
        return {name: field.name, value: useState(data.data[field.name] || "")};
    });

    const updateDisplayName = (event) => {
        setDisplayName(event.target.value);
        setUnsavedChanges(true);
    }

    const updateState = (index, value) => {
        setUnsavedChanges(true);
        states[index].value[1](value);
    }

    const processConfirmed = () => {
        setUnsavedChanges(false);
        setChangesConfirmed(true);
        setTimeout(() => setChangesConfirmed(false), 1000);
    }

    const saveIntegration = () => {
        const updatedData = {};
        states.forEach(state => updatedData[state.name] = state.value[0]);

        updatedData["integration_name"] = displayName;

        if (!identifier) {
            putRequest(`/integrations/${integration.name}`, updatedData)
                .then(data => data.json())
                .then(processed => {
                    setIdentifier(processed.id);
                    processConfirmed();
                });
        } else {
            patchRequest(`/integrations/${identifier}`, updatedData)
                .then(() => processConfirmed())
        }

    }

    const deleteIntegration = () => {
        if (!deleteConfirmed) {
            setDeleteConfirmed(true);
            return;
        }

        if (!identifier) {
            remove();
            return;
        }

        deleteRequest(`/integrations/${identifier}`)
            .then(() => remove());
    }

    const getState = (index) => states[index].value[0];

    const getPlaceholder = (integration, field) => t(`integrations.${integration}.fields.${field}`
            + (i18n.exists(`integrations.${integration}.fields.${field}_placeholder`) ? "_placeholder" : ""))

    return (
        <div className={"integration-item"+(changesConfirmed ? " green-border" : "")}>
            <div className="integration-item-header">
                <div className="integration-item-left">
                    <FontAwesomeIcon icon={integration.icon} className="integration-item-icon"/>
                    <div className="integration-title-container">
                        <h3>{displayName}</h3>
                        <div className="integration-item-activity">
                            <div className={"integration-item-activity-circle circle-"+(data.activityFailed ? "error"
                                : (data.lastActivity === null || !data.lastActivity ? "inactive" : "active"))} />
                            <p>{data.activityFailed ? t("failed") : (data.lastActivity === null || !data.lastActivity
                                ? "Nie ausgeführt" : "Zuletzt vor " + generateRelativeTime(data.lastActivity))}</p>
                        </div>
                    </div>

                </div>
                <div className="integration-item-right">
                    {unsavedChanges && !changesConfirmed && <FontAwesomeIcon icon={faFloppyDisk} onClick={saveIntegration}
                                                        className="integration-green" />}
                    {changesConfirmed && <FontAwesomeIcon icon={faCheck} className="icon-green" />}

                    {!deleteConfirmed && <FontAwesomeIcon icon={faTrash} className="integration-red" onClick={deleteIntegration} />}
                    {deleteConfirmed && <FontAwesomeIcon icon={faTrashArrowUp} className="integration-red" onClick={deleteIntegration} />}

                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} onClick={() => setOpen(!open)}
                                     className="integration-green" />
                </div>
            </div>
            {open && <div className="integration-body">

                <div className="integration-field">
                    <p className="integration-field-title">{t(`integrations.display_name`)}</p>
                    <input className="integration-field-input" type="text" value={displayName}
                           onChange={updateDisplayName}
                           placeholder={t(`integrations.display_name`)}/>
                </div>

                {integration.fields.map((field, index) => <div className="integration-field" key={index}>
                    <p className="integration-field-title">{t(`integrations.${integration.name}.fields.${field.name}`)}</p>

                    {field.type === "text" && <input className="integration-field-input" type="text" value={getState(index)}
                                                        onChange={e => updateState(index, e.target.value)}
                                                       placeholder={getPlaceholder(integration.name, field.name)}/>}

                    {field.type === "textarea" && <textarea className="integration-field-input text-area" value={getState(index)}
                                                                onChange={e => updateState(index, e.target.value)}
                                                                placeholder={getPlaceholder(integration.name, field.name)} />}

                    {field.type === "boolean" && <input type="checkbox" checked={getState(index)}
                                                        onChange={e => updateState(index, e.target.checked)}/>}
                </div>)}
            </div>}
        </div>
    )

}