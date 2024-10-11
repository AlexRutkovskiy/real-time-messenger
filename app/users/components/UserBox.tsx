'use client'

import Avatar from "@/app/components/Avatar";
import { API_ROUTES, SITE_ROUTES } from "@/app/utils/routes";
import { User } from "@prisma/client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UserBoxProps {
  data: User
}

const UserBox: React.FC<UserBoxProps> = ({
  data
}: UserBoxProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  console.log(isLoading)

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios.post(API_ROUTES.CONVERSATIONS, {
      userId: data.id
    })
    .then(({data}) => {
      router.push(SITE_ROUTES.CONVERSATIONS_ID.replace(":id", data.id))
    })
    .finally(() => setIsLoading(false))

  }, [data.id, router])

  return (
    <div
      onClick={handleClick}
      className="w-full relative flex items-center space-x-3 bg-white p-3
        hover:bg-neutral-100 rounded-lg transition cursor-pointer
      "
    >
      <Avatar user={data} />

      <div className="min-w-1 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">
              {data?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserBox