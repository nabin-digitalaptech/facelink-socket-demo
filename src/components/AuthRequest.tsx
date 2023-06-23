import { useEffect, useState } from 'react';
import axios from "axios";

type MessagePayload = {
  content: string;
  msg: string;
};

const AuthRequest = () => {
  let state = {
    selectedFile: null
  };
  const [value, setValue] = useState(state);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
   
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const socket_id:any = urlParams.get('socket_id');
    console.log('socket_id',socket_id);
    localStorage.setItem("socket_id", socket_id); 
  }, []);

  const handleChange = async(event:any) => {
    const name = event.target.name;
    const file = event.target.files[0];
    console.log('image',file);
    setValue({ selectedFile: file });

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
          let headers={ 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' , 'Authorization': 'Bearer '+accessToken };
          const formData = new FormData();
          let socket_id:any=localStorage.getItem("socket_id");
          formData.append('selfie_image', file);
          formData.append('socket_id', socket_id);
          let sendRequestUrl='https://apidev.facechain.org/facelink/request/login-request';
          axios.post(sendRequestUrl , formData, {timeout: 60000, maxContentLength: Infinity, maxBodyLength: Infinity, headers: headers })
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
        setMessages([{content: 'authdone',msg: 'Authentication success!'}])
  }

  return (
    <div>
      <div>
        <h1>Web Socket Login Request</h1>
        <div>
          <p>Choose Your Face Photo</p>
          <input
            type="file"
            name="image" 
            value=""
            onChange={handleChange}
          />
        </div>
        <div>&nbsp;</div>
        <div>
          {messages.length === 0 ? (
            <div>Not Loged In</div>
          ) : (
            <div>Loged In</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthRequest;
