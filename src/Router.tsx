import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Websocket from "./components/Websocket";
import AuthRequest from "./components/AuthRequest";
import Message from "./components/Message";

const Router = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Websocket />} />
            <Route path="request-login" element={<AuthRequest />} />
            <Route path="message" element={<Message />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default Router;