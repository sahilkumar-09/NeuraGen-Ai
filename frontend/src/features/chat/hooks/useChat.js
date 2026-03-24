import { useDispatch } from "react-redux";
import { initializeSocketConnection } from "../services/chat.socket";
import { getChat, getMessages, sendMessage } from "../services/chatApi";
import {
  addMessages,
  addNewMessage,
  createNewChat,
  setChats,
  setCurrentChatId,
  setError,
  setIsLoading,
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();

  const handleSendMessage = async ({ message, chatId }) => {
    dispatch(setIsLoading(true));
    const data = await sendMessage({ message, chatId });

    const { chat, AIMessage } = data.data;

    if (!chatId)
      dispatch(
        createNewChat({
          chatId: chat._id,
          title: chat.title,
        }),
      );
    dispatch(
      addNewMessage({
        chatId: chatId || chat._id,
        content: message,
        role: "user",
      }),
    );
    dispatch(
      addNewMessage({
        chatId: chatId || chat._id,
        content: AIMessage.content,
        role: AIMessage.role,
      }),
    );
    dispatch(setCurrentChatId(chat._id));
  };

  const handleGetChats = async () => {
    dispatch(setIsLoading(true));
    const data = await getChat();

    const chats = data.data;

    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,

            messages: (chat.messages || []).map((m) => ({
              id: m._id || m.id,
              role: m.role,
              content: m.content,
            })),
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );

    dispatch(setIsLoading(false));
  };

  const handleOpenChat = async (chatId, chats) => {
      if (chats[chatId]?.messages.length === 0) {
          
          const data = await getMessages(chatId);
      
          const messages = data.data;
      
          const formattedMessage = messages.map((msg) => ({
            content: msg.content,
            role: msg.role,
          }));
      
          dispatch(
            addMessages({
              chatId,
              messages: formattedMessage,
            }),
          );
    }

    dispatch(setCurrentChatId(chatId));
  };

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};
