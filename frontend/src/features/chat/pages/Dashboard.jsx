import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../../auth/hook/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate()
  const chat = useChat();
  const { user } = useSelector((state) => state.auth);

  const { handleLogout } = useAuth();

  const [hasSent, setHasSent] = useState(false);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    setHasSent(true);
    setInput("");
  };

  return (
    <main className="h-screen flex w-full bg-neutral-900 text-neutral-200 overflow-hidden">
      {/* 🔥 Overlay (mobile only) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-neutral/50 z-40 md:hidden"
        />
      )}

      {/* 🔥 Sidebar */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-neutral-800  border-zinc-600 flex flex-col justify-between transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div>
          {/* Logo / Header */}
          <div className="p-4 font-bold text-lg border-b border-zinc-700 flex justify-between items-center">
            NeuraGen Ai
            {/* Close button (mobile) */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden cursor-pointer text-xl"
            >
              ✕
            </button>
          </div>

          {/* Chat List */}
          <div className="p-3 space-y-2 overflow-y-auto h-[65vh]">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="px-4 py-2 bg-zinc-900 rounded-full hover:bg-zinc-950 cursor-pointer text-sm"
              >
                Chat Title
              </div>
            ))}
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 border-t border-zinc-700  ">
          <p className="text-sm text-center text-zinc-400">{user?.email}</p>
          <button
            onClick={() => {
              handleLogout();
              navigate("/auth/user/login");
            }}
            className="mt-2 px-5 py-1.5 bg-neutral-200 hover:bg-neutral-300 w-full text-neutral-800 active:scale-95 transition cursor-pointer text-sm  rounded-full"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* 🔥 Main Chat */}
      <section className="flex-1 flex flex-col relative">
        {/* 🔥 Top Navbar (mobile) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-700">
          <button onClick={() => setIsSidebarOpen(true)} className="text-2xl">
            ☰
          </button>
          <h1 className="font-bold">NeuraGen Ai</h1>
          <div />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {hasSent && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="text-right">
                <div className="inline-block bg-zinc-700 px-4 py-2 rounded-lg">
                  User Message
                </div>
              </div>

              <div className="text-left">
                <div className="inline-block bg-zinc-800 px-4 py-2 rounded-lg">
                  AI Message
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div
          className={`
    w-full px-4 transition-all duration-300

    /* 📱 Mobile */
    ${
      hasSent
        ? "fixed bottom-0 left-0 right-0 pb-4 bg-black/80 backdrop-blur"
        : "flex items-center justify-center h-full"
    }

    /* 💻 Desktop override */
    md:static md:flex md:justify-center md:h-auto md:pb-4 md:bg-transparent
  `}
        >
          <div className="w-full max-w-2xl flex items-center bg-zinc-900 border border-zinc-700 rounded-full px-3 py-2">
            <span className="text-xl mr-2 cursor-pointer">+</span>

            <input
              type="text"
              placeholder="Ask anything"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />

            <button
              onClick={handleSend}
              className="ml-2 bg-white hover:bg-zinc-200 active:scale-95 transition text-black text-sm px-3 py-1 rounded-full cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
