'use client'

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useSession } from "next-auth/react";
import { find } from "lodash";
import { User } from "@prisma/client";

import { useConversation } from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { pusherClient } from "@/app/libs/pusher";
import { PUSHER_EVENTS } from "@/app/utils/constance";
import { SITE_ROUTES } from "@/app/utils/routes";


interface ConversationsListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  initialItems,
  users
}: ConversationsListProps) => {
  
  const session = useSession();
  const router = useRouter();
  const [items, setItems] = useState<FullConversationType[]>(initialItems)
  const { conversationId, isOpen } = useConversation()
  const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false)

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session])

  useEffect(() => {
    if (!pusherKey) return;

    const handleNewConversation = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, {id: conversation.id})) {
          return current;
        }
        return [conversation, ...current];
      })
    }

    const handleUpdateConversation = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.map(c => {
          if (c.id === conversation.id) {
            return {
              ...c,
              messages: conversation.messages
            }
          }

          return c;
        })]
      })
    }

    const handleRemoveConversation = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter(item => item.id !== conversation.id)]
      });

      if (conversationId === conversation.id) {
        router.push(SITE_ROUTES.CONVERSATION)
      }
    }

    pusherClient.subscribe(pusherKey);
    pusherClient.bind(PUSHER_EVENTS.CONVERSATION_NEW, handleNewConversation);
    pusherClient.bind(PUSHER_EVENTS.CONVERSATION_UPDATE, handleUpdateConversation);
    pusherClient.bind(PUSHER_EVENTS.CONVERSATION_REMOVE, handleRemoveConversation);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind(PUSHER_EVENTS.CONVERSATION_NEW, handleNewConversation);
      pusherClient.unbind(PUSHER_EVENTS.CONVERSATION_UPDATE, handleUpdateConversation);
      pusherClient.unbind(PUSHER_EVENTS.CONVERSATION_REMOVE, handleRemoveConversation);
    }
  }, [conversationId, pusherKey, router])

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