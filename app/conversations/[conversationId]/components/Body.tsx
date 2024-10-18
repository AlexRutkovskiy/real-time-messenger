'use client'

import { useRef, useState, useEffect } from "react";
import axios from "axios";

import { FullMessageType } from "@/app/types";
import { useConversation } from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import { API_ROUTES } from "@/app/utils/routes";
import { pusherClient } from "@/app/libs/pusher";
import { PUSHER_EVENTS } from "@/app/utils/constance";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({
  initialMessages
}: BodyProps) => {
  
  const [ messages, setMessages ] = useState(initialMessages)
  const { conversationId } = useConversation()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef.current?.scrollIntoView();

    const handlerNewMessage = (message: FullMessageType) => {
      axios.post(API_ROUTES.SEEN.replace(":id", conversationId));
      setMessages(current => {
        if (find(current, {id: message.id})) {
          return current;
        }

        return [...current, message];
      })

      bottomRef.current?.scrollIntoView();
    }

    const handlerUpdateMessage = (newMessage: FullMessageType) => {
      setMessages((prev) => {
        return [...prev.map((m) => m.id === newMessage.id ? newMessage : m)]
      })
    }

    pusherClient.bind(PUSHER_EVENTS.MESSAGE_NEW, handlerNewMessage);
    pusherClient.bind(PUSHER_EVENTS.MESSAGE_UPDATE, handlerUpdateMessage);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind(PUSHER_EVENTS.MESSAGE_NEW, handlerNewMessage);
      pusherClient.unbind(PUSHER_EVENTS.MESSAGE_UPDATE, handlerUpdateMessage);
    }
  }, [conversationId])

  useEffect(() => {
    axios.post(API_ROUTES.SEEN.replace(":id", conversationId));
  }, [conversationId])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => {
        return (
          <MessageBox 
            key={index}
            isLast={index === messages.length - 1}
            data={message}
          />
        )
      })}
      <div ref={bottomRef} className="pt-24" />
    </div>
  )
}

export default Body;