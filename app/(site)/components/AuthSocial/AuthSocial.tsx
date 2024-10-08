'use client'

import { type FC } from "react";
import type { IconType } from "react-icons";
import AuthSocialButton from "./AuthSocialButton"

interface AuthBtn {
  icon: IconType;
  name: string;
} 

interface AuthSocialProps {
  items: AuthBtn[];
  onClick: (name: string) => void;
  disabled: boolean;
}

const AuthSocial: FC<AuthSocialProps> = ({
  items,
  onClick,
  disabled
}: AuthSocialProps) => {

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"/>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {items.map(item => {
          return (
            <AuthSocialButton 
              key={item.name}
              icon={item.icon}
              onClick={()=>onClick(item.name)} 
              disabled={disabled}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AuthSocial;