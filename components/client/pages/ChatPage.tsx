'use client';

import { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  getUserConversations,
  getChatMessages,
  sendChatMessage,
  markChatAsRead,
  ChatConversation,
  ChatMessageData
} from '@/lib/firebase/firestore-chat';
import { useClientStore } from '@/lib/stores/clientStore';

interface ChatPageProps {
  onNavigate: (page: string) => void;
}

export default function ChatPage({ onNavigate }: ChatPageProps) {
  const { user } = useClientStore();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id!);
      markChatAsRead(selectedConversation.id!, 'client');
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    setLoading(true);
    const result = await getUserConversations();
    if (result.success && result.conversations) {
      setConversations(result.conversations);
      if (result.conversations.length > 0 && !selectedConversation) {
        setSelectedConversation(result.conversations[0]);
      }
    }
    setLoading(false);
  };

  const loadMessages = async (conversationId: string) => {
    const result = await getChatMessages(conversationId);
    if (result.success && result.messages) {
      setMessages(result.messages);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);
    const result = await sendChatMessage(
      selectedConversation.id!,
      newMessage.trim(),
      'client',
      user.displayName || 'Client'
    );

    if (result.success) {
      setNewMessage('');
      await loadMessages(selectedConversation.id!);
      await loadConversations();
    } else {
      alert('❌ Erreur lors de l\'envoi du message');
    }
    setSending(false);
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header">
        <button 
          onClick={() => onNavigate('dashboard')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ← Retour
        </button>
        <div className="header-logo">💬 Mes Conversations</div>
        <div></div>
      </header>

      {conversations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#1a1a1a',
          margin: '20px',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ marginBottom: '12px' }}>Aucune conversation</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Posez une question sur un produit pour démarrer une conversation
          </p>
          <Button onClick={() => onNavigate('dashboard')} variant="primary">
            Voir les deals
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Liste des conversations */}
          <div style={{
            width: '35%',
            borderRight: '1px solid #333',
            overflowY: 'auto',
            backgroundColor: '#0a0a0a'
          }}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #333',
                  cursor: 'pointer',
                  backgroundColor: selectedConversation?.id === conv.id ? '#1a1a1a' : 'transparent',
                  position: 'relative'
                }}
              >
                {conv.campaignImage && (
                  <img
                    src={conv.campaignImage}
                    alt={conv.campaignTitle}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      marginBottom: '8px'
                    }}
                  />
                )}
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                  {conv.campaignTitle}
                </div>
                <div style={{ fontSize: '12px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.lastMessage || 'Aucun message'}
                </div>
                {conv.unreadByClient > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {conv.unreadByClient}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {/* En-tête de la conversation */}
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid #333',
                  backgroundColor: '#0a0a0a'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>
                    {selectedConversation.campaignTitle}
                  </div>
                </div>

                {/* Zone de messages */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: msg.senderRole === 'client' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%'
                      }}
                    >
                      <div style={{
                        backgroundColor: msg.senderRole === 'client' ? '#ff6b35' : '#1a1a1a',
                        padding: '12px',
                        borderRadius: '12px',
                        border: msg.senderRole === 'client' ? 'none' : '1px solid #333'
                      }}>
                        <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>
                          {msg.senderName}
                        </div>
                        <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                          {msg.message}
                        </div>
                        <div style={{ fontSize: '10px', color: '#666', textAlign: 'right' }}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie */}
                <div style={{
                  padding: '16px',
                  borderTop: '1px solid #333',
                  backgroundColor: '#0a0a0a',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !sending) {
                        handleSendMessage();
                      }
                    }}
                    style={{ flex: 1 }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    variant="primary"
                  >
                    {sending ? '⏳' : '📤'}
                  </Button>
                </div>
              </>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666'
              }}>
                Sélectionnez une conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
