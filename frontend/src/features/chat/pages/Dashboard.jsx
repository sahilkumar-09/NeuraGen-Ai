import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/useAuth";
import { useChat } from "../hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const { user } = useSelector((state) => state.auth);
  const { handleLogout } = useAuth();

  const chat = useChat();

  const { chats, currentChatId } = useSelector((state) => state.chat);

  const handleSubmitMessage = (e) => {
    e.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  return (
    <main className="h-screen w-full bg-neutral-800 text-neutral-200 overflow-hidden">
      <section className="flex h-full w-full gap-3">
        {/* Overlay (mobile) */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-neutral-900  border-zinc-600 flex flex-col justify-between transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          {/* Logo */}
          <div className="p-4 border-b border-neutral-700 text-xl font-semibold flex items-center justify-between">
            NeuraGen Ai
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden cursor-pointer text-xl"
            >
              ✕
            </button>
          </div>

          {/* Chats List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-neutral-700">
            {Object.values(chats).map((chat) => (
              <button
                onClick={() => {
                  openChat(chat.id);
                }}
                key={chat.id}
                className="w-full rounded-lg border cursor-pointer border-neutral-600 px-3 py-2 text-left text-sm hover:bg-neutral-700 transition"
              >
                {chat.title}
              </button>
            ))}
          </div>

          {/* Profile Section */}
          <div className="p-3 border-t border-neutral-700">
            <div className="text-sm text-neutral-400 truncate text-center">
              {user?.email || "guest"}
            </div>
            <button
              className="mt-2 w-full rounded-lg border border-neutral-600 py-2 text-sm hover:bg-neutral-700 transition"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Chat Section */}
        <section className="flex flex-1 flex-col relative">
          {/* Top bar (mobile) */}
          <div className="md:hidden flex items-center justify-between border-b border-neutral-700 bg-neutral-900 px-2 py-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="px-2 py-1 border rounded-md"
            >
              ☰
            </button>
            NeuraGen Ai
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin scrollbar-thumb-neutral-700">
            {chats[currentChatId]?.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "ml-auto rounded-tr-none bg-neutral-700"
                    : "mr-auto bg-neutral-900 rounded-bl-none"
                }`}
              >
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-2 list-disc pl-5">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-2 list-decimal pl-5">{children}</ol>
                      ),

                      code({ inline, children, ...props }) {
                        return inline ? (
                          <code
                            className="rounded bg-white/10 px-1 py-0.5"
                            {...props}
                          >
                            {children}
                          </code>
                        ) : (
                          <pre className="mb-2 overflow-x-auto rounded-xl bg-black/30 p-3">
                            <code {...props}>{children}</code>
                          </pre>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <footer className="border-t border-neutral-700 bg-neutral-900 p-3">
            <form className="flex gap-2" onSubmit={handleSubmitMessage}>
              <input
                value={chatInput}
                onChange={(e) => {
                  setChatInput(e.target.value);
                }}
                type="text"
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-neutral-600 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-300"
              />
              <button
                type="submit"
                className="rounded-xl border border-neutral-500 px-5 py-2 text-sm font-medium hover:bg-neutral-700 transition"
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
