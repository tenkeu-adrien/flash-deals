'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { 
  getAllConversations,
  getChatMessages,
  sendChatMessage,
  markChatAsRead,
  ChatConversation,
  ChatMessageData
} from '@/lib/firebase';

interface CampaignChatsPageProps {
  onNavigate: (page: string) => void;
}

export default function CampaignChatsPage({ onNavigate }: CampaignChatsPageProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    const result = await getAllConversations();
    
    if (result.success && result.conversations) {
      setConversations(result.conversations);
    }
    
    setLoading(false);
  };

  const loadChatMessages = async (conversationId: string) => {
    const result = await getChatMessages(conversationId);
    
    if (result.success && result.messages) {
      setChatMessages(result.messages);
      
      await markChatAsRead(conversationId, 'admin');
      await loadConversations();
    }
  };

  const handleSelectConversation = async (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    await loadChatMessages(conversation.id!);
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    const result = await sendChatMessage(
      selectedConversation.id!,
      newMessage.trim(),
      'admin',
      'Admin'
    );

    if (result.success) {
      setNewMessage('');
      await loadChatMessages(selectedConversation.id!);
      await loadConversations();
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar currentPage="chats" onNavigate={onNavigate} />
        <div className="flex-1 ml-[260px] p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-bg-medium rounded w-1/3"></div>
            <div className="h-64 bg-bg-medium rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar currentPage="chats" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <div className="p-8 h-screen flex flex-col">
          <h1 className="text-[28px] font-bold mb-6">
            Chats Clients par Produit
          </h1>

          <div className="flex-1 flex gap-4 overflow-hidden">
            {/* Liste des conversations */}
            <div className="w-1/3 bg-bg-medium rounded-lg border border-[#333] overflow-y-auto">
              <div className="p-4 border-b border-[#333]">
                <h2 className="font-semibold mb-1">Conversations</h2>
                <p className="text-sm text-gray-medium">
                  {conversations.filter(c => c.unreadByAdmin > 0).length} non lu(s)
                </p>
              </div>

              <div className="divide-y divide-[#333]">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full p-4 text-left hover:bg-bg-card transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-bg-card' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      {conversation.campaignImage && (
                        <img
                          src={conversation.campaignImage}
                          alt={conversation.campaignTitle}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold truncate">
                            {conversation.campaignTitle}
                          </p>
                          {conversation.unreadByAdmin > 0 && (
                            <span className="px-2 py-0.5 bg-red text-white text-xs rounded-full ml-2">
                              {conversation.unreadByAdmin}
                            </span>
                          )}
                        </div>
                        
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-medium truncate">
                            {conversation.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}

                {conversations.length === 0 && (
                  <div className="p-8 text-center text-gray-medium">
                    Aucune conversation
                  </div>
                )}
              </div>
            </div>

            {/* Zone de chat */}
            <div className="flex-1 bg-bg-medium rounded-lg border border-[#333] flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-[#333]">
                    <div className="flex items-center gap-3">
                      {selectedConversation.campaignImage && (
                        <img
                          src={selectedConversation.campaignImage}
                          alt={selectedConversation.campaignTitle}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div>
                        <h2 className="font-semibold">
                          {selectedConversation.campaignTitle}
                        </h2>
                        <p className="text-sm text-gray-medium">
                          Conversation avec le client
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderRole === 'admin' || msg.senderRole === 'manager'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.senderRole === 'admin' || msg.senderRole === 'manager'
                              ? 'bg-orange text-white'
                              : 'bg-bg-dark text-white'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.senderName} - {
                              msg.senderRole === 'admin' ? '👨‍💼 Admin' :
                              msg.senderRole === 'manager' ? '👔 Manager' :
                              '👤 Client'
                            }
                          </p>
                        </div>
                      </div>
                    ))}

                    {chatMessages.length === 0 && (
                      <p className="text-center text-gray-medium">Aucun message</p>
                    )}
                  </div>

                  <div className="p-4 border-t border-[#333]">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Tapez votre message..."
                        className="flex-1 px-4 py-2 bg-bg-dark border border-[#333] rounded-lg text-white focus:outline-none focus:border-orange"
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-orange hover:bg-orange/80"
                      >
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-medium">
                  Sélectionnez une conversation pour commencer
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
