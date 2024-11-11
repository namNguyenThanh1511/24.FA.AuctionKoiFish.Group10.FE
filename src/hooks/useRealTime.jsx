import React, { useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

function useRealtime(callback, auctionSessionId) {
  const WS_URL = "http://14.225.220.131:8081/websocket";
  // const WS_URL = "http://localhost:8081/websocket";

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const stomp = Stomp.over(socket);

    const onConnected = () => {
      console.log("WebSocket connected to general channel");

      // Subscribe to the general channel
      stomp.subscribe(`/topic/auctionSession`, (message) => {
        console.log("General session message:", message);
        callback && callback(message);
      });

      // Subscribe to the specific auction session if provided
      if (auctionSessionId) {
        stomp.subscribe(`/topic/auctionSession/${auctionSessionId}`, (message) => {
          console.log("Specific session message:", message);
          callback && callback(message, auctionSessionId);
        });
      }
    };

    stomp.connect({}, onConnected, (error) => {
      console.error("WebSocket connection error:", error);
    });
  }, []); // Dependency array includes auctionSessionId

  return <></>;
}

export default useRealtime;
