import { useEffect, useState } from "react";
import { useLogicGraph } from "../../LogicGraphProvider/LogicGraphProvider"
import { LogicGraphNodesProp } from "../../LogicGraphProvider/LogicGraphProviderInterface";

function LogicGraphNodePort({ NodeID, PortIndex, PortType }) {
    const { VitrualEdges, Edges, Actions } = useLogicGraph();
    const [backgroundColor, setBackgroundColor] = useState("white");
  
  
    function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();

        //console.log("onMouseDown:", NodeID, PortIndex, PortType);
        // 如果是左键点击，那么视为添加节点
        if (e.button === 0){
            const EdgeProp = {
                NodeID: NodeID,
                EdgeIndex: PortIndex,
                Mode: PortType,
            };
            Actions.addVirtualEdge(PortType, EdgeProp);
        }else if (e.button === 2) {
            // 如果是右键点击，那么清除连接到该端口的边
            // 查找以该端口为终点的边
            
            Edges.map((edge) => {
                if(PortType === "TerminalPoint" && edge.EndNodeID === NodeID && edge.EndEdgeIndex === PortIndex){
                    Actions.removeEdge(edge.EdgeID);
                }
            });
        }
        
    }
  
    // ✅ 把 setBackgroundColor 放在 useEffect 中
    useEffect(() => {
      if (PortType === "StartPoint") {
        const isActive =
          VitrualEdges.StartNode.NodeID === NodeID &&
          VitrualEdges.StartNode.EdgeIndex === PortIndex &&
          VitrualEdges.StartNode.isNodeSet;
        setBackgroundColor(isActive ? "green" : "white");
      } else if (PortType === "TerminalPoint") {
        const isActive =
          VitrualEdges.EndNode.NodeID === NodeID &&
          VitrualEdges.EndNode.EdgeIndex === PortIndex &&
          VitrualEdges.EndNode.isNodeSet;
        setBackgroundColor(isActive ? "green" : "white");
      }
    }, [VitrualEdges, NodeID, PortIndex, PortType]);
  
    return (
      <div onContextMenu={(e) => {e.preventDefault();}}  className="flex flex-col flex-1 items-center justify-center">
        <div
          id={`port-${NodeID}-${PortIndex}`}
          className="w-[12px] h-[12px] bg-white border-[2px] border-[#1967d2] shadow-[#1967D233] shadow-lg"
          style={{ backgroundColor }}
          onMouseDown={onMouseDown}
        ></div>
      </div>
    );
  }

export function LogicGraphNodeInputPorts( { nodeData } : { nodeData?:LogicGraphNodesProp } ){
    if (!nodeData) {
        return null; // 如果没有找到节点数据，返回 null
    }

    //console.log("LogicGraphNodeInputPorts", nodeData.GuiProps.Ports.InputPort);
    return (
        <div className="flex flex-col h-full justify-center items-center">
            {nodeData.GuiProps.Ports.InputPort.map((item) => (
                <LogicGraphNodePort key={item.PortIndex} NodeID={nodeData.ID} PortIndex={item.PortIndex} PortType="TerminalPoint" />
            ))}
        </div>
    );
}

export function LogicGraphNodeOutputPorts( { nodeData } : { nodeData?:LogicGraphNodesProp } ){
    if (!nodeData) {
        return null; // 如果没有找到节点数据，返回 null
    }

    return (
        <div className="flex flex-col h-full justify-center items-center">
            {nodeData.GuiProps.Ports.OutputPort.map((item) => (
                <LogicGraphNodePort key={item.PortIndex} NodeID={nodeData.ID} PortIndex={item.PortIndex} PortType="StartPoint" />
            ))}
        </div>
    );
}