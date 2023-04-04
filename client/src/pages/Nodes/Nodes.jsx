import "./styles.sass";
import NodeHeader from "@/pages/Nodes/components/NodeHeader";
import NodeContainer from "@/pages/Nodes/components/NodeContainer";
import {useContext, useEffect, useState} from "react";
import {NodeContext} from "@/common/contexts/Node";
import {t} from "i18next";
import CreateNodeDialog from "@/pages/Nodes/components/CreateNodeDialog";

export const Nodes = (props) => {
    const [nodes, updateNodes] = useContext(NodeContext);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    useEffect(() => {
        updateNodes();
    }, []);

    return (
        <div className="node-page">
            {createDialogOpen && <CreateNodeDialog onClose={() => setCreateDialogOpen(false)}/>}
            <NodeHeader/>
            <div className="node-area">
                <NodeContainer name={t("nodes.this_server")} url={location.href} currentNode={true}
                               setShowNodePage={props.setShowNodePage} id={0}/>

                {nodes.map(node => <NodeContainer {...node} key={node.id} setShowNodePage={props.setShowNodePage} />)}

                <div className="node-add" onClick={() => setCreateDialogOpen(true)}>
                    <h1>{t("nodes.add")}</h1>
                </div>
            </div>
        </div>
    )
}