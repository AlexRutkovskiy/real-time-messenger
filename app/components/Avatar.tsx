'use client'

import Image from "next/image";
import { User } from "@prisma/client"
import { useMemo } from "react";

interface AvatarProps {
  user?: User;
  isGroup?:boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  user,
  isGroup
}: AvatarProps) => {
  
  const imageSrc = useMemo(() => {
    if (isGroup) {
      return "/images/users-group.png"
    }

    return user?.image || '/images/placeholder.jpg'
  }, [isGroup, user?.image])

  return (
    <div className="relative flex">
      <div
        className="relative inline-block rounded-full overflow-hidden
          h-9 w-9 md:h-11 md:w-11"
      >
        <Image
          alt="Avatar"
          src={imageSrc}
          fill
          className="object-cover"
        />
      </div>
      <span
        className="absolute block rounded-full bg-green-500
          ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3"
      />
    </div>
  )
}

export default Avatar