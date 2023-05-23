import i18n, {t} from "i18next";
import {useState} from "react";
import {deleteRequest, patchRequest, putRequest} from "@/common/utils/RequestUtil";
import IntegrationItemHeader from "./components/IntegrationItemHeader";
import "./styles.sass";

export const IntegrationItem = ({integration, data, remove, isOpen}) => {
    const [open, setOpen] = useState(isOpen);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const [changesConfirmed, setChangesConfirmed] = useState(false);
    const [displayName, setDisplayName] = useState(data.displayName || t(`integrations.${integration.name}.title`));
    const [error, setError] = useState(false);

    const [identifier, setIdentifier] = useState(data.id);

    const states = integration.fields.map(field => {
        return {name: field.name, value: useState(data.data[field.name] || (field.type === "boolean" ? false : ""))};
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
            putRequest(`/integrations/${integration.name}`, updatedData).then(data => {
                if (!data.ok) throw new Error();
                return data.json();
            }).then(processed => {
                setIdentifier(processed.id);
                processConfirmed();
                setError(false);
            }).catch(() => setError(true));
        } else {
            patchRequest(`/integrations/${identifier}`, updatedData).then(data => {
                if (!data.ok) throw new Error();
            }).then(() => {
                processConfirmed();
                setError(false);
            }).catch(() => setError(true));
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

    const isValidInput = (field, index) => {
        if (field.required && !getState(index)) return false;
        if (field.regex && !new RegExp(field.regex).test(getState(index))) return false;
        if (field.type === "text" && getState(index).length > 255) return false;

        return !(field.type === "textarea" && getState(index).length > 2000);
    }

    const getState = (index) => states[index].value[0];

    const getPlaceholder = (integration, field) => t(`integrations.${integration}.fields.${field}`
            + (i18n.exists(`integrations.${integration}.fields.${field}_placeholder`) ? "_placeholder" : ""))

    return (
        <div className={"integration-item"+(error ? " item-error-border" : (changesConfirmed ? " green-border" : ""))}>
            <IntegrationItemHeader open={open} setOpen={setOpen} displayName={displayName}
                                   changesConfirmed={changesConfirmed} deleteConfirmed={deleteConfirmed}
                                   deleteIntegration={deleteIntegration} saveIntegration={saveIntegration}
                                   unsavedChanges={unsavedChanges} integration={integration} data={data}/>

            {open && <div className="integration-body">
                <div className="integration-field">
                    <p className="integration-field-title">{t(`integrations.display_name`)}</p>
                    <input className="integration-field-input" type="text" value={displayName}
                           onChange={updateDisplayName} placeholder={t(`integrations.display_name`)}/>
                </div>

                {integration.fields.map((field, index) => <div className="integration-field" key={index}>
                    <p className={"integration-field-title" + (!isValidInput(field, index)
                        ? " error-item" : "")}>{t(`integrations.${integration.name}.fields.${field.name}`)}</p>

                    {field.type === "text" && <input className={"integration-field-input" + (!isValidInput(field, index)
                        ? " item-error-border" : "")} type="text" value={getState(index)}
                                                     onChange={e => updateState(index, e.target.value)}
                                                     placeholder={getPlaceholder(integration.name, field.name)}/>}

                    {field.type === "textarea" && <textarea className={"integration-field-input text-area"
                        + (!isValidInput(field, index) ? " item-error-border" : "")} value={getState(index)}
                                                                onChange={e => updateState(index, e.target.value)}
                                                                placeholder={getPlaceholder(integration.name, field.name)} />}

                    {field.type === "boolean" && <input type="checkbox" checked={getState(index)}
                                                        onChange={e => updateState(index, e.target.checked)}/>}
                </div>)}
            </div>}
        </div>
    )

}