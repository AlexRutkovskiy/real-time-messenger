'use client'

import { useCallback, useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Link from "next/link";
import { Conversation, User } from "@prisma/client";


import useOtherUser from "@/app/hooks/useOtherUser";
import { SITE_ROUTES } from "@/app/utils/routes";
import Avatar from "@/app/components/Avatar";
import ProfileDrawer from "./ProfileDrawer";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  }
}

const Header: React.FC<HeaderProps> = ({conversation}: HeaderProps) => {
  
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return "Active"
  }, [conversation])

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  return (
    <>
      <ProfileDrawer 
        data={conversation}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
      />
      <div 
        className="bg-white w-full flex border-b-[1px] sm:px-4 
          py-3 px-4 lg:px-6 justify-between items-center shadow-sm"
      >
        <div className="flex gap-3 items-center">
          <Link 
            className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
            href={SITE_ROUTES.CONVERSATION}
          >
            <HiChevronLeft  size={24}/>
          </Link>
          
          <Avatar 
            isGroup={conversation.isGroup as boolean}
            user={otherUser} 
          />
          
          <div className="flex flex-col">
            <div>
              {conversation.name || otherUser.name}
            </div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>

        <HiEllipsisHorizontal 
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="cursor-pointer text-sky-500 hover:text-sky-600 transition"
        />
      </div>
    </>
  )
}

export default Header;