'use client'

import { useRef, useState, useEffect } from "react";
import axios from "axios";

import { FullMessageType } from "@/app/types";
import { useConversation } from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import { API_ROUTES } from "@/app/utils/routes";

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
    const url = API_ROUTES.SEEN.replace(":id", conversationId);
    axios.post(url)
    
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