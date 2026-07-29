"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { getMessages, sendMessage } from "@/lib/services/chat.service";
import type { Message } from "@/types/post";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";

export default function ChatPage() {
  const { claimId } = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling for new messages every 3 seconds
  useEffect(() => {
    if (!user) return; // tunggu sampai user terload

    async function fetchMsgs() {
      try {
        const data = await getMessages(Number(claimId));
        setMessages(data);
      } catch (error) {
        console.error("Gagal memuat pesan", error);
      } finally {
        if (loading) setLoading(false);
      }
    }

    fetchMsgs(); // Initial fetch
    
    const interval = setInterval(() => {
      fetchMsgs();
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [claimId, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      // Optimistic update
      const tempMsg: Message = {
        id: Date.now(),
        claim_id: Number(claimId),
        sender_id: user!.id,
        body: newMessage.trim(),
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);
      setNewMessage("");

      // Actual send
      const sentMsg = await sendMessage(Number(claimId), tempMsg.body);
      
      // Update the temp msg with real id (or just rely on next poll)
      setMessages((prev) => prev.map(m => m.id === tempMsg.id ? sentMsg : m));
    } catch (error) {
      alert("Gagal mengirim pesan");
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    if (user?.role === "pelanggan") {
      router.push("/pelanggan/posts");
    } else {
      router.push("/mitra/my-jobs");
    }
  };

  if (isLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat Obrolan...</div>;
  }

  // Determine chat partner name (we don't have it directly from getMessages unless joined, 
  // but let's just make it generic or we could fetch claim details)
  const partnerName = user?.role === "pelanggan" ? "Mitra" : "Pelanggan";

  return (
    <div className="flex flex-col h-screen bg-gray-50 md:py-8 md:px-4">
      <div className="flex-1 flex flex-col bg-white w-full max-w-3xl mx-auto md:rounded-3xl md:shadow-xl md:border border-gray-200 overflow-hidden relative">
        
        {/* Header */}
        <header className="flex items-center gap-4 p-4 border-b border-gray-100 bg-white z-10 shrink-0">
          <button onClick={handleBack} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Ruang Obrolan</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
              Diskusi dengan {partnerName}
            </p>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={32} />
              </div>
              <p>Belum ada pesan. Mulai sapa sekarang!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              const time = new Date(msg.created_at).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm 
                      ${isMe 
                        ? "bg-teal-700 text-white rounded-br-none" 
                        : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                  >
                    <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? "text-teal-200" : "text-gray-400"}`}>
                      {time}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-2 items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 h-12 bg-gray-100 border-transparent rounded-full px-5 text-sm outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center hover:bg-teal-800 disabled:opacity-50 disabled:hover:bg-teal-700 transition-colors shadow-md"
            >
              {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-0.5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Temporary import for icon used in empty state
import { MessageCircle } from "lucide-react";
