// hooks/useHandleNewConversation.js

import { useEffect } from 'react';
import { ref, push } from "firebase/database";
import { realTimeDb } from "@/app/firebase"; // Importer Firebase Realtime Database

export const useHandleNewConversation = (user, messages) => {
  useEffect(() => {
    const handleNewConversation = async () => {
      if (user) {
        const conversationRef = ref(realTimeDb, `conversations/${user.uid}`);
        const conversationData = messages
          .map((message, index) => ({
            question: index % 2 === 0 ? message.content : null,
            response: index % 2 !== 0 ? message.content : null,
          }))
          .filter((item) => item.question || item.response); // Filtrer les entrées vides

        await push(conversationRef, conversationData);
      }
    };

    if (user && messages.length > 1) {
      handleNewConversation();
    }
  }, [user, messages]);
};
