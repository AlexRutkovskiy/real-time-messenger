'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md";

import { useConversation } from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";

interface ConversationsListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  initialItems,
  users
}: ConversationsListProps) => {
  
  const router = useRouter();
  const [items, setItems] = useState<FullConversationType[]>(initialItems)
  const { conversationId, isOpen } = useConversation()
  const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false)

  return (
    <>
      <GroupChatModal 
        isOpen={isModalOpen}
        onClose={()=>setIsModalOpen(false)}
        users={users}
      />
      <aside
        className={clsx(`
          fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80
          lg:block overflow-y-auto border-r border-gray-200`,
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">
              Messages
            </div>
            <div 
              onClick={()=>setIsModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 text-gray-600 
                cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {items.map((conversation) => (
            <ConversationBox 
              key={conversation.id}
              data={conversation} 
              selected={conversation.id === conversationId}
            />
          ))}
        </div>
      </aside>
    </>    
  )
}

export default ConversationsList