import { useLogicGraph } from "../../LogicGraphProvider/LogicGraphProvider"
import { LogicGraphNode } from "./LogicGraphNode";

export function LogicGraphNodeList(){
    const LogicGraphContext = useLogicGraph();
    const { Nodes, Actions } = LogicGraphContext;

    return (
        Nodes.map(node => (
            <LogicGraphNode nodeID={node.ID}></LogicGraphNode>
        ))
    )
}