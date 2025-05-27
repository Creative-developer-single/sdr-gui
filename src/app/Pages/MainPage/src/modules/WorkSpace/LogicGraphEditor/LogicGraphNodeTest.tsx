import { useEffect, useState } from "react";
import { useLogicGraph } from "../LogicGraphProvider/LogicGraphProvider";
import { LogicGraphNode } from "./LogicGraphNode";

export function LogicGraphNodeTest() {
    const { Nodes, Actions } = useLogicGraph();

    return (
        <div className="z-9999">
            {Nodes.map((node) => (
                <LogicGraphNode key={node.ID} nodeID={node.ID}></LogicGraphNode>
            ))}
        </div>
    )
}