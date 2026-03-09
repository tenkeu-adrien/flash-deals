'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { 
  getAllOrderChats,
  getOrderMessages,
  sendOrderMessage,
  markMessagesAsRead,
  ChatMessage
} from '@/lib/firebase';

export default function AllChatsPage() {
  const [chats, setChats] = useState<Array<{
    orderId: string;
    lastMessage?: ChatMessage;
    unreadCount: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    setLoading(true);
    const result = await getAllOrderChats();
    
    if (result.success && result.chats) {
      // Filtrer seulement les chats qui ont des messages
      const chatsWithMessages = result.chats.filter(c => c.lastMessage);
      setChats(chatsWithMessages);
    }
    
    setLoading(false);
  };

  const loadChatMessages = async (orderId: string) => {
    const result = await getOrderMessages(orderId);
    
    if (result.success && result.messages) {
      setChatMessages(result.messages);
      
      // Marquer comme lu
      const adminId = 'current-admin-id'; // À adapter
      await markMessagesAsRead(orderId, adminId);
      
      // Recharger la liste pour mettre à jour le compteur
      await loadChats();
    }
  };

  const handleSelectChat = async (orderId: string) => {
    setSelectedOrderId(orderId);
    await loadChatMessages(orderId);
  };

  const handleSendMessage = async () => {
    if (!selectedOrderId || !newMessage.trim()) return;

    const result = await sendOrderMessage(
      selectedOrderId,
      newMessage.trim(),
      'admin',
      'Admin' // À adapter selon votre système
    );

    if (result.success) {
      setNewMessage('');
      await loadChatMessages(selectedOrderId);
      await loadChats();
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-screen flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tous les Chats Clients
      </h1>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Liste des conversations */}
        <div className="w-1/3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-900">Conversations</h2>
            <p className="text-sm text-gray-600">
              {chats.filter(c => c.unreadCount > 0).length} non lu(s)
            </p>
          </div>

          <div className="divide-y">
            {chats.map((chat) => (
              <button
                key={chat.orderId}
                onClick={() => handleSelectChat(chat.orderId)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedOrderId === chat.orderId ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-semibold text-gray-900">
                    Commande #{chat.orderId.slice(-8)}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                
                {chat.lastMessage && (
                  <div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage.senderName}: {chat.lastMessage.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {chat.lastMessage.senderRole === 'client' ? '👤 Client' : 
                       chat.lastMessage.senderRole === 'manager' ? '👔 Manager' : '👨‍💼 Admin'}
                    </p>
                  </div>
                )}
              </button>
            ))}

            {chats.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Aucune conversation
              </div>
            )}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {selectedOrderId ? (
            <>
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">
                  Commande #{selectedOrderId.slice(-8)}
                </h2>
                <p className="text-sm text-gray-600">
                  Conversation avec le client
                </p>
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
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
                  <p className="text-center text-gray-500">Aucun message</p>
                )}
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Envoyer
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Sélectionnez une conversation pour commencer
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
