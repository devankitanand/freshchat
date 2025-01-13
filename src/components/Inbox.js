
import React, { useState, useEffect, useRef } from 'react';
import { auth, firestore, collection, onSnapshot, query, where, addDoc, serverTimestamp, doc, updateDoc, getDoc } from '../firebase';
import { TiDocumentText } from "react-icons/ti";
import { FaUser } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { format } from 'date-fns';

const Inbox = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [chatStatus, setChatStatus] = useState('Open');
  const [sending, setSending] = useState(false); // State to manage sending status
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch users from Firestore and filter messages sent by users
    const messagesCollection = collection(firestore, 'messages');
    const q = query(messagesCollection, where('sender', '==', 'user'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const existingUser = usersData.find(user => user.userId === data.userId);
        
        if (existingUser) {
          existingUser.message = data.message;
          existingUser.timestamp = data.timestamp;
        } else {
          usersData.push({ id: doc.id, ...data });
        }
      });
      
      // Sort users by the latest message timestamp
      usersData.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    // Fetch chat status for the selected user
    const userDoc = await getDoc(doc(firestore, 'users', user.userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setChatStatus(userData.chatStatus || 'Open');
    } else {
      setChatStatus('Open'); // Default status if no data is found
    }

    // Fetch all messages for the selected user from Firestore
    const messagesCollection = collection(firestore, 'messages');
    const q = query(messagesCollection, where('userId', '==', user.userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      messagesData.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)); // Sort messages by timestamp, handle null values
      setMessages(messagesData);
      scrollToBottom();
    });

    return () => unsubscribe();
  };

  const sendReply = async () => {
    if (!reply) return;
    setSending(true); // Set sending to true
    await addDoc(collection(firestore, 'messages'), {
      userId: selectedUser.userId,
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
      phone: '',
      message: reply,
      sender: 'company',
      timestamp: serverTimestamp()
    });
    setReply('');
    setSending(false); // Set sending to false
    scrollToBottom();
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setChatStatus(newStatus);

    // Update chat status in Firestore
    if (selectedUser) {
      await updateDoc(doc(firestore, 'users', selectedUser.userId), {
        chatStatus: newStatus
      });
    }
  };

  const getUserClass = (user) => {
    return selectedUser && selectedUser.id === user.id ? 'active' : '';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      <div className="header">
        <div><b>Team Inbox</b></div>
        <div>
          {auth.currentUser && auth.currentUser.email} <button className='logout' onClick={() => auth.signOut()}>Logout</button>
        </div>
      </div>
      <div className="inbox" style={{ display: 'flex' }}>
        <div className="users-list" style={{ width: '25%', borderRight: '1px solid #ccc' }}>
          {users.map(user => (
            <div key={user.id} className={`users ${getUserClass(user)}`} onClick={() => handleUserClick(user)}>
              <div className='userdp'>{user.name.charAt(0).toUpperCase()}</div>
              <div>
                <div className='name'>{user.name}</div>
                <div className='lastmsg'>{user.message}</div>
                <div className='pgtitle'><TiDocumentText/>Home</div>
              </div>
              
            </div>
          ))}
        </div>
        {selectedUser ? (<>
          <div className="chat-area" style={{ width: '50%', borderRight: '1px solid #ccc', padding: '20px' }}>
            <div className='wrapchat'>
                <div className='chat-header'>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                  <TiDocumentText size={20}/> <div className='headtitle'>Web Chat - Chat with us</div>
                  </div>
                
                    {/* <h3>Chat with {selectedUser.name}</h3> */}
                    <select value={chatStatus} onChange={handleStatusChange} className='select-status'>
                      <option value="Open">Open</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Waiting on Customer">Waiting on Customer</option>
                      <option value="Waiting on Internal Team">Waiting on Internal Team</option>
                    </select>
                  </div>
                  <div className='chat-messages'>
                    <div className='time'>Today</div>
                    {messages.map(message => (
                      <div key={message.id} className={message.sender === 'user' ? 'user-message' : 'company-message'}>
                        <div className='usertitlemsg'>{message.name}</div> {/* Add name of the user */}
                        <div className='msgcontent'>{message.message}</div>
                        <div className='timestamp'>
                          {message.timestamp?.seconds ? format(new Date(message.timestamp.seconds * 1000), 'PPpp') : 'Just now'} {/* Add timestamp */}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                    <div className='reply'>
                      <div className='replymsg'>
                      <textarea className='text' value={reply} onChange={e => setReply(e.target.value)} placeholder="Reply"></textarea>
                      </div>
                      <div className='btnreply'>
                        <button className='send' onClick={sendReply} disabled={sending}>
                          {sending ? 'Sending...' : <> <BsSend />&nbsp;&nbsp;Send</>}
                        </button>
                      </div>
                      
                    </div>
                    
                  </div>
                  
            </div>
     
        </div>
        <div className="user-details" style={{ width: '25%', padding: '20px' , backgroundColor: '#ebeef3'}}>
            <div className='wrapcontact'>
              <div className='headcontact'><FaUser size={15}/><div className='contact'>Contact info</div></div>
              <div className='contactinfo'>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              </div>
              
            </div>
        </div>
        </>):(<>
        <div className='none'>
          <div><b>Hello there, batch</b></div>  
          <div>Time to ace those conversation</div>  
        </div>
        </>)}
        
      </div>
    </div>
  );
};

export default Inbox;


