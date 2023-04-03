import React, {useState, createContext, useEffect} from "react";
import {baseRequest} from "@/common/utils/RequestUtil";

export const NodeContext = createContext({});

export const NodeProvider = (props) => {

    const [nodes, setNodes] = useState(null);
    const [currentNode, setCurrentNode] = useState(parseInt(localStorage.getItem("currentNode")) || 0);

    const updateNodes = () => baseRequest("/nodes").then(nodes => nodes.json()).then(nodes => setNodes(nodes));

    useEffect(() => {
        updateNodes();
        const interval = setInterval(() => updateNodes(), 60000);
        return () => clearInterval(interval);
    }, []);

    const updateCurrentNode = (node) => {
        localStorage.setItem("currentNode", node);
        setCurrentNode(parseInt(node));
    }

    return (
        <NodeContext.Provider value={[nodes, updateNodes, currentNode, updateCurrentNode]}>
            {props.children}
        </NodeContext.Provider>
    )
}