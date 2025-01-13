
import React, { useState, useEffect } from 'react';
import { firestore, collection, addDoc, serverTimestamp, onSnapshot, query, where, doc, setDoc } from '../firebase';

const ChatWidget = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [sending, setSending] = useState(false); // State to manage sending status

  useEffect(() => {
    if (userId) {
      const messagesCollection = collection(firestore, 'messages');
      const q = query(messagesCollection, where('userId', '==', userId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        messagesData.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)); // Sort messages by timestamp, handle null values
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const startChat = async () => {
    if (!name || !email || !phone) {
      alert('Please fill all fields');
      return;
    }
    const userSessionId = `user_${new Date().getTime()}`;
    setUserId(userSessionId);

    // Get the current page title
    const pageTitle = document.title;

    // Create user document with chatStatus and pageTitle
    const userDocRef = doc(firestore, 'users', userSessionId);
    await setDoc(userDocRef, {
      name,
      email,
      phone,
      chatStatus: 'Open',
      pageTitle
    });

    setChatStarted(true);
  };

  const sendMessage = async () => {
    if (!message) return;
    setSending(true); // Set sending to true
    await addDoc(collection(firestore, 'messages'), {
      userId,
      name,
      email,
      phone,
      message,
      sender: 'user',
      timestamp: serverTimestamp()
    });
    setMessage('');
    setSending(false); // Set sending to false
  };

  return (
    <div className="chat-widget">
      <div className="header">Chat with us</div>
      <div className='chat-box'>
        <div className='chat-container'>
          {!chatStarted ? (
            <>
            <div className='headerchat'> Chat with us</div>
            <div className='subheaderchat'>
              We can't wait to chat with you. Please provide your details to start the chat.
            </div>
            <div className='chat-inputs'>
              <input className='inputchat' value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
              <input className='inputchat' value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
              <input className='inputchat' value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
              <button className='startchat' onClick={startChat}>Start Chat</button>
            </div>
            </>
          ) : (
            <>
            <div className='afterstart'>
              <div className='headerchatA'> Chat with us<div className='subhead'>Typically replies within few hours</div></div>
              
              <div className="messageschat">
                <div className='msgtitle'>Cuvette.Tech</div> 
                <div className='msgcontent d'>Hello there! Need Help? Reach out to us right here.</div>
                {messages.map(msg => (
                  <div key={msg.id} className={msg.sender === 'user' ? 'company-message' : 'user-message'}>
                    <div className='msgtitle'>{msg.sender === 'user' ? name : 'Cuvette Tech'}</div> 
                    <div className='msgcontent d'>{msg.message}</div>
                  </div>
                ))}
              </div>
              <div className='chatbottom'>
                <textarea className='replyhere' value={message} onChange={e => setMessage(e.target.value)} placeholder="Reply Here.." />
                <button className='sendbtnlast' onClick={sendMessage} disabled={sending}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
