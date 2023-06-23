import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../contexts/WebsocketContext';
import axios from "axios";

type AuthPayload = {
  content: string;
  msg: string;
};

const Websocket = () => {
  const [value, setValue] = useState('');
  const [authDatas, setAuthDatas] = useState<AuthPayload[]>([]);
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected! Socket Id: ',socket.id);
      localStorage.setItem("socket_id", socket.id); 
    });
    socket.on('onAuthDone', (authResponse: any) => {
      let face_id_exists=0;
      authDatas.map((row,index)=>{
        if(row.content==authResponse.content.face_id){
          face_id_exists=1;
        }
      });
      if(face_id_exists==0){
        authDatas.push({'content':authResponse.content.face_id,'msg':authResponse.msg});
        console.log('authentication success!');
        console.log('authDatas1',authResponse);
        setAuthDatas(authDatas);
      }
      
    });
    return () => {
      //console.log('Unregistering Events...');
      socket.off('connect');
      socket.off('onMessage');
    };
  }, []);

  const onSubmit = async () => {
    let accessTokenUrl='https://apidev.facechain.org/auth/api/access-token?clientId=7bsvancpl4tio60600pn6hnr58&clientSecret=1d5bssl48phc3vjfh5ljntkl9b2u6a0r80kit6vg08f9kpf70ch9';
    let accessTokenResponse:any=await new Promise(function (resolve, reject) {
      axios.get(accessTokenUrl , {timeout: 60000, maxContentLength: Infinity, maxBodyLength: Infinity }).then(function (response) {
          if(response.data['error']){
              reject(new Error(response.data['error']['code']+": "+response.data['error']['message']));
          }else{
              resolve(response.data) ;
          }
      }).catch(function (error) {
          if (error.response) {
              reject(new Error('Connecting to API Server failed: HTTP '+  error.response.data));
          }else{
              reject(new Error('Connecting to API Server failed: '+  error.code + " " + error.message));
          }
      });
    });
    let accessToken=accessTokenResponse.data.access_token;
    //console.log('accessToken',accessToken);
    let sendRequestResponse:any=await  new Promise(function (resolve, reject) {
      let headers={ 'Accept': 'application/json','Authorization': 'Bearer '+accessToken };
      let data={
        "socket_id":localStorage.getItem("socket_id"),
        "phone": value
      }
      let sendRequestUrl='http://localhost:3015/facelink/request/sendLink';
      axios.post(sendRequestUrl , data, {timeout: 60000, maxContentLength: Infinity, maxBodyLength: Infinity, headers: headers })
      .then(function (response) {
          if(response.data['error']){
              reject(new Error(response.data['error']['code']+": "+response.data['error']['message']));
          }else{
              resolve(response.data) ;
          }
      }).catch(function (error) {
          if (error.response) {
              reject(new Error('Connecting to API Server failed: HTTP '+  error.response.data));
          }else{
              reject(new Error('Connecting to API Server failed: '+  error.code + " " + error.message));
          }
      });
    });
    console.log('sendRequestResponse',sendRequestResponse);
  };

  return (
    <div>
      <div>
        <h1>Web Socket Send Request</h1>
        <div>
          <p>Enter phone number starting with country code</p>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={onSubmit}>Send</button>
        </div>
        <div>&nbsp;</div>
        <div>
          {authDatas.length === 0 ? (
            <div>No User Connected</div>
          ) : (
            <div>
              <div>{authDatas.length} User Connected</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Websocket;
