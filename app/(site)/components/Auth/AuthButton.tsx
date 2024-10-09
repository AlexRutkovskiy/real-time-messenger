'use client'

import { VARIANT_TYPE } from "@/app/utils/constance"

interface AuthButton {
  variant: string;
  toggleVariant: () => void;
}

const LABELS = {
  DESCRIPTION: {
    LOGIN: "New to Messenger?",
    REGISTER: "Already have an account?"
  },
  LINK: {
    LOGIN: "Create an account",
    REGISTER: "Login"
  }
}


const AuthButton = ({
  variant,
  toggleVariant
}: AuthButton) => {
  return (
    <div className="mt-6 flex gap-2 justify-center text-sm px-2 text-gray-500">
      <div>
        {
          variant === VARIANT_TYPE.LOGIN 
            ? LABELS.DESCRIPTION.LOGIN
            : LABELS.DESCRIPTION.REGISTER
        }
      </div>
      <div
        onClick={toggleVariant}
        className="underline cursor-pointer"
      >
        {
          variant === VARIANT_TYPE.LOGIN 
            ? LABELS.LINK.LOGIN
            : LABELS.LINK.REGISTER
        }
      </div>
    </div>
  )
}

export default AuthButton;