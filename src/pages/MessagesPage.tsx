import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Search,
  MessageSquare,
  CheckCheck,
  Check,
  User,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { timeAgo } from '../utils/formatters';

export const MessagesPage: React.FC = () => {
  const {
    currentUser,
    users,
    messages,
    sendMessage,
    activeConversationUserId,
    setActiveConversationUserId,
    markConversationAsRead,
    setSelectedFreelancerId,
    setCurrentView,
    projects,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages into conversations based on participants
  const conversations = React.useMemo(() => {
    if (!currentUser) return [];

    const otherUsersMap = new Map<string, { user: any; lastMsg: any; unread: number }>();

    messages.forEach((msg) => {
      let otherId = '';
      if (msg.sender_id === currentUser.id) {
        otherId = msg.receiver_id;
      } else if (msg.receiver_id === currentUser.id) {
        otherId = msg.sender_id;
      } else {
        return;
      }

      const otherUser = users.find((u) => u.id === otherId);
      if (!otherUser) return;

      const existing = otherUsersMap.get(otherId);
      const isUnread = !msg.is_read && msg.receiver_id === currentUser.id;

      if (!existing || new Date(msg.created_at) > new Date(existing.lastMsg.created_at)) {
        otherUsersMap.set(otherId, {
          user: otherUser,
          lastMsg: msg,
          unread: (existing?.unread || 0) + (isUnread ? 1 : 0),
        });
      } else if (isUnread) {
        existing.unread += 1;
      }
    });

    // If active conversation user has no previous message yet, include them
    if (activeConversationUserId && !otherUsersMap.has(activeConversationUserId)) {
      const activeUser = users.find((u) => u.id === activeConversationUserId);
      if (activeUser && activeUser.id !== currentUser.id) {
        otherUsersMap.set(activeConversationUserId, {
          user: activeUser,
          lastMsg: {
            text: 'Start a conversation...',
            created_at: new Date().toISOString(),
          },
          unread: 0,
        });
      }
    }

    return Array.from(otherUsersMap.values()).sort(
      (a, b) => new Date(b.lastMsg.created_at).getTime() - new Date(a.lastMsg.created_at).getTime()
    );
  }, [messages, currentUser, users, activeConversationUserId]);

  // Set default active conversation if none
  useEffect(() => {
    if (!activeConversationUserId && conversations.length > 0) {
      setActiveConversationUserId(conversations[0].user.id);
    }
  }, [activeConversationUserId, conversations, setActiveConversationUserId]);

  // Mark as read when conversation opens
  useEffect(() => {
    if (activeConversationUserId) {
      markConversationAsRead(activeConversationUserId);
    }
  }, [activeConversationUserId, markConversationAsRead]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversationUserId]);

  const activeUser = users.find((u) => u.id === activeConversationUserId);

  // Active thread messages
  const activeThread = messages.filter(
    (m) =>
      currentUser &&
      activeConversationUserId &&
      ((m.sender_id === currentUser.id && m.receiver_id === activeConversationUserId) ||
        (m.sender_id === activeConversationUserId && m.receiver_id === currentUser.id))
  );

  // Check if they have an active project contract
  const activeContract = projects.find(
    (p) =>
      (p.client_id === currentUser?.id && p.freelancer_id === activeConversationUserId) ||
      (p.freelancer_id === currentUser?.id && p.client_id === activeConversationUserId)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationUserId) return;
    sendMessage(activeConversationUserId, inputText);
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
            <span>DIRECT MESSAGING</span>
            <span className="w-6 h-0.5 bg-blue-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Client & Freelancer Communications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discuss project requirements, milestones, and deliverable handovers in real time.
          </p>
        </div>

        {/* Messaging Box */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[680px]">
          {/* Conversation List Sidebar */}
          <div className="md:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
            <div className="p-4 border-b border-slate-200 bg-white">
              <h3 className="font-bold text-sm text-slate-900">Conversations</h3>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active conversations yet. Visit a job or freelancer profile to initiate contact.
                </div>
              ) : (
                conversations.map(({ user, lastMsg, unread }) => {
                  const isSelected = activeConversationUserId === user.id;

                  return (
                    <div
                      key={user.id}
                      onClick={() => setActiveConversationUserId(user.id)}
                      className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50/80 border-l-4 border-blue-600'
                          : 'hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {user.full_name}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {timeAgo(lastMsg.created_at)}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {lastMsg.text}
                        </p>
                      </div>

                      {unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {unread}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat Conversation Area */}
          <div className="md:col-span-8 flex flex-col h-full bg-white">
            {activeUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeUser.avatar_url}
                      alt={activeUser.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{activeUser.full_name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 font-semibold capitalize text-slate-700">
                          {activeUser.role}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {activeUser.title} · {activeUser.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeUser.role === 'freelancer' && (
                      <button
                        onClick={() => {
                          setSelectedFreelancerId(activeUser.id);
                          setCurrentView('freelancer-detail');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Contract Notice Bar if applicable */}
                {activeContract && (
                  <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
                    <div className="flex items-center gap-1.5 truncate">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-bold">Active Contract:</span>
                      <span className="truncate">{activeContract.job_title}</span>
                    </div>
                    <button
                      onClick={() => setCurrentView('projects')}
                      className="font-bold text-blue-700 hover:underline shrink-0 ml-2"
                    >
                      Track Project &rarr;
                    </button>
                  </div>
                )}

                {/* Messages Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                  {activeThread.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-6 text-slate-400 text-xs">
                      Send a message to initiate discussion with {activeUser.full_name}.
                    </div>
                  ) : (
                    activeThread.map((msg) => {
                      const isMe = msg.sender_id === currentUser?.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex items-end gap-2 ${
                            isMe ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {!isMe && (
                            <img
                              src={msg.sender_avatar}
                              alt={msg.sender_name}
                              className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                            />
                          )}

                          <div
                            className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-blue-700 text-white rounded-br-xs'
                                : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                                isMe ? 'text-blue-200' : 'text-slate-400'
                              }`}
                            >
                              <span>{timeAgo(msg.created_at)}</span>
                              {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Box */}
                <form
                  onSubmit={handleSend}
                  className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Message ${activeUser.full_name}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-xs cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                Select a conversation on the left to start chatting.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
