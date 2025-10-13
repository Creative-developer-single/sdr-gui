import FloatWindow from "../../FloatWindow/FloatWindow";
import { FloatWindowProp, FloatWindowPropInterface, UpdateStatusInterface } from "../../FloatWindow/FloatWindowPropInterface";
import { useLLMAssistant } from "../Provider/LLMAssistantProvider";

export function LLMAssistantGUI(){
    // 获取LLM Context
    const llmContext = useLLMAssistant();

    const windowData:FloatWindowPropInterface = {
        icon: '🤖',
        id: llmContext.GUIProps.id,
        title: llmContext.GUIProps.title || '大模型助手',
        isOpen: llmContext.GUIProps.isOpen,
        posX: llmContext.GUIProps.pos.x,
        posY: llmContext.GUIProps.pos.y,
        width: llmContext.GUIProps.width,
        height: llmContext.GUIProps.height,
        onUpdateStatus: (data:UpdateStatusInterface) => {
            console.log('LLM Assistant GUI status updated:', data);
            llmContext.Actions.UpdateLLMGUIStatus({
                id: data.id,
                isOpen: data.isOpen,
                pos: { x: data.posX, y: data.posY },
                width: data.width,
                height: data.height,
                title: llmContext.GUIProps.title || '大模型助手'
            });
        },
        onGUIDestroy: (id) => {
            llmContext.Actions.RemoveLLMGUI(id);
            console.log('LLM Assistant GUI destroyed:', id);
        }
    }

    return (
        <FloatWindow data={windowData}>
            <div>
            <iframe
                src="http://localhost/chatbot/Ts4BE5yNott0jMjt"
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '500px',
                }}
                frameBorder="0"
                allow="microphone">
            </iframe>
            </div>
        </FloatWindow>
    )
}