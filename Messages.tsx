import React, { useState } from 'react';
import { Search, MoreVertical, Phone, Video, Send, Smile, Paperclip, Mic, UserPlus, MessageCircle, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const INITIAL_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Sarah J.',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    status: 'online',
    lastMessage: 'Hey! Are you free to practice the interview scenario?',
    timestamp: '10:30 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Mike T.',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    status: 'busy',
    lastMessage: 'Thanks for the tips on body language!',
    timestamp: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    name: 'Emma W.',
    avatar: 'https://i.pravatar.cc/150?u=emma',
    status: 'offline',
    lastMessage: 'Let\'s catch up later.',
    timestamp: 'Tue',
    unread: 0,
  },
];

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Hi Sarah! Yes, I am free in about 10 minutes.', sender: 'me', time: '10:32 AM' },
    { id: '2', text: 'Great! I really need help with the "Conflict Resolution" scenario.', sender: 'them', time: '10:33 AM' },
  ],
  '2': [
    { id: '1', text: 'Thanks for the tips on body language!', sender: 'them', time: 'Yesterday' },
    { id: '2', text: 'You are welcome! Let me know if you need more help.', sender: 'me', time: 'Yesterday' },
  ],
  '3': [
     { id: '1', text: 'Let\'s catch up later.', sender: 'them', time: 'Tue' },
  ]
};

interface MessagesProps {
  userProfile: UserProfile;
}

export const Messages: React.FC<MessagesProps> = ({ userProfile }) => {
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);

  const activeMessages = selectedFriend ? (allMessages[selectedFriend.id] || []) : [];

  const markAsRead = (friendId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFriends(friends.map(f => f.id === friendId ? { ...f, unread: 0 } : f));
  };

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    markAsRead(friend.id);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedFriend) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAllMessages({
      ...allMessages,
      [selectedFriend.id]: [...(allMessages[selectedFriend.id] || []), newMessage]
    });
    
    // Update last message in friend list
    setFriends(friends.map(f => 
      f.id === selectedFriend.id 
        ? { ...f, lastMessage: messageInput, timestamp: 'Just now' } 
        : f
    ));

    setMessageInput('');
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SociFriends</h1>
          <p className="text-gray-500 dark:text-gray-400">Connect and practice with peers.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/30">
          <UserPlus size={18} /> Find Practice Partner
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex">
        {/* Sidebar List */}
        <div className={`w-full md:w-80 border-r border-gray-100 dark:border-gray-700 flex flex-col ${selectedFriend ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search friends..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {friends.map(friend => (
              <div 
                key={friend.id}
                onClick={() => handleSelectFriend(friend)}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group relative ${selectedFriend?.id === friend.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
              >
                <div className="relative">
                  <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${friend.status === 'online' ? 'bg-green-500' : friend.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{friend.name}</h3>
                    <span className="text-xs text-gray-400">{friend.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{friend.lastMessage}</p>
                </div>
                {friend.unread > 0 && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => markAsRead(friend.id, e)}
                      className="p-1 text-gray-400 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Mark as read"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <div className="w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {friend.unread}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!selectedFriend ? 'hidden md:flex' : 'flex'}`}>
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedFriend(null)} className="md:hidden text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <img src={selectedFriend.avatar} alt={selectedFriend.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{selectedFriend.name}</h3>
                    <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> {selectedFriend.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><Phone size={20} /></button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><Video size={20} /></button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><MoreVertical size={20} /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                {activeMessages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'them' && (
                        <img src={selectedFriend.avatar} alt={selectedFriend.name} className="w-8 h-8 rounded-full object-cover self-end mb-1" />
                    )}
                    <div className={`max-w-[70%] rounded-2xl p-4 ${msg.sender === 'me' ? 'bg-primary-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <span className={`text-[10px] mt-1 block ${msg.sender === 'me' ? 'text-primary-100' : 'text-gray-400'}`}>{msg.time}</span>
                    </div>
                    {msg.sender === 'me' && (
                        <div className="w-8 h-8 rounded-full overflow-hidden self-end mb-1 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                            {userProfile.avatar ? (
                                <img src={userProfile.avatar} alt="Me" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                                    {userProfile.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><Paperclip size={20} /></button>
                  <input 
                    type="text" 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><Smile size={20} /></button>
                  {messageInput.trim() ? (
                    <button onClick={handleSendMessage} className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"><Send size={18} /></button>
                  ) : (
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><Mic size={20} /></button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-10 h-10 opacity-40" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Conversation</h3>
              <p className="max-w-xs mx-auto">Choose a friend from the list to start chatting or find a new practice partner.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
