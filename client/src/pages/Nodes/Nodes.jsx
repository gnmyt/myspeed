import "./styles.sass";
import NodeHeader from "@/pages/Nodes/components/NodeHeader";
import NodeContainer from "@/pages/Nodes/components/NodeContainer";
import {useContext, useEffect, useState} from "react";
import {NodeContext} from "@/common/contexts/Node";
import {t} from "i18next";
import CreateNodeDialog from "@/pages/Nodes/components/CreateNodeDialog";
import {ConfigContext} from "@/common/contexts/Config";
import {InputDialogContext} from "@/common/contexts/InputDialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export const Nodes = (props) => {
    const [config] = useContext(ConfigContext);
    const [nodes, updateNodes] = useContext(NodeContext);
    const [setDialog] = useContext(InputDialogContext);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const openPreviewInfoDialog = () => {
        setDialog({title: t("preview.title"), description: t("nodes.preview_active"), buttonText: t("dialog.close")});
    }

    useEffect(() => {
        updateNodes();
    }, []);

    return (
        <div className="node-page">
            {createDialogOpen && <CreateNodeDialog onClose={() => setCreateDialogOpen(false)}/>}
            <NodeHeader/>
            <div className="node-area">
                <NodeContainer name={t("nodes.this_server")} url={location.host} currentNode={true}
                               setShowNodePage={props.setShowNodePage} id={0}/>

                {nodes.map(node => <NodeContainer {...node} key={node.id} setShowNodePage={props.setShowNodePage} />)}

                <div className={"node-add" + (config.previewMode ? " node-disabled" : "")} onClick={() => config.previewMode
                    ? openPreviewInfoDialog() : setCreateDialogOpen(true)}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <h1>{t("nodes.add")}</h1>
                </div>
            </div>
        </div>
    )
}