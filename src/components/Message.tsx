import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../contexts/WebsocketContext';

type MessagePayload = {
  content: string;
  msg: string;
};

const Message = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!',socket.id);
    });
    socket.on('onMessage', (newMessage: MessagePayload) => {
      console.log('onMessage event received!');
      console.log('newMessage',newMessage);
      messages.push(newMessage);
      setMessages(messages);
      console.log('messages',messages)
    });
    socket.on('onAuthDone', (authResponse: any) => {
      console.log('authentication success!');
      console.log(authResponse);
    });
    return () => {
      //console.log('Unregistering Events...');
      socket.off('connect');
      socket.off('onMessage');
    };
  }, []);

  const onSubmit = () => {
    socket.emit('newMessage', {'message':value,'socket_id':socket.id});
    setValue('');
  };

  return (
    <div>
      <div>
        <h1>Message Test</h1>
        <div>
          {messages.length === 0 ? (
            <div>No Messages</div>
          ) : (
            <div>
              {messages.map((meaage,i) => (
                <div key={i}>
                  <p>{meaage.msg}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Message;
