import { useDispatch } from "react-redux";
import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage } from "../services/chatApi";
import { addNewMessage, createNewChat, setChats, setCurrentChatId, setError, setIsLoading } from "../chat.slice";

export const useChat = () => {

    const dispatch = useDispatch()

    const handleSendMessage = async ({message, chatId}) => {
        dispatch(setIsLoading(true));
        const data = await sendMessage({message, chatId})

        const { chat, AIMessage } = data.data
        
        dispatch(createNewChat({
            chatId: chat._id,
            title: chat.title
        }))

        dispatch(addNewMessage({
            chatId: chat._id,
            content: message,
            role: "user"
        }))

        dispatch(addNewMessage({
            chatId: chat._id,
            content: AIMessage.content,
            role: AIMessage.role
        }))
        dispatch(setCurrentChatId(chat._id))
    }

    return {
        initializeSocketConnection,
        handleSendMessage
    }
}