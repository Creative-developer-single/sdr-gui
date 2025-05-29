import { useLogicGraph } from "../../LogicGraphProvider/LogicGraphProvider"
import { LogicGraphNode } from "./LogicGraphNode";

export function LogicGraphNodeList(){
    const LogicGraphContext = useLogicGraph();
    const { Nodes, Actions } = LogicGraphContext;

    return (
        Nodes.map(node => (
            <LogicGraphNode key={node.ID} nodeID={node.ID}></LogicGraphNode>
        ))
    )
}