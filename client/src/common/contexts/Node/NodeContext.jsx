import React, {useState, createContext, useEffect, useContext} from "react";
import {baseRequest} from "@/common/utils/RequestUtil";
import {ConfigContext} from "@/common/contexts/Config";

export const NodeContext = createContext({});

export const NodeProvider = (props) => {

    const [config] = useContext(ConfigContext);
    const [nodes, setNodes] = useState([]);
    const [currentNode, setCurrentNode] = useState(parseInt(localStorage.getItem("currentNode")) || 0);

    const updateNodes = async () => baseRequest("/nodes").then(async nodes => {
        if (nodes.ok) setNodes(await nodes.json());
    });

    useEffect(() => {
        if (Object.keys(config).length === 0) return;
        if (!config.viewMode) updateNodes();
    }, [config]);

    const updateCurrentNode = (node) => {
        localStorage.setItem("currentNode", node);
        setCurrentNode(parseInt(node));
    }

    const findNode = (nodeId) => nodes.find(node => node.id === nodeId);

    return (
        <NodeContext.Provider value={[nodes, updateNodes, currentNode, updateCurrentNode, findNode]}>
            {props.children}
        </NodeContext.Provider>
    )
}