import React, { useEffect } from "react";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
function useRealtime(callback) {
  const WS_URL = "http://14.225.220.131:8081/websocket";
  // const WS_URL = "http://localhost:8081/websocket";
  const socket = new SockJS(WS_URL);
  const stomp = Stomp.over(socket);

  useEffect(() => {
    const onConnected = () => {
      console.log("WebSocket connected"); 
      stomp.subscribe(`/topic/auctionSession`, (message) => {
        console.log(message);
        callback && callback(message);
      });
    };
    stomp.connect({}, onConnected, null);
  }, []);
  return <></>;
}

export default useRealtime;
