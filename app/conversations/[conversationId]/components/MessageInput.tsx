'use client'

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  id: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const MessageInput: React.FC<MessageInputProps> = ({
  id,
  type = "text",
  placeholder = '',
  required = false,
  register,
}: MessageInputProps) => {
  return (
    <div className="relative w-full">
      <input 
        id={id}
        type={type}
        autoComplete={id}
        placeholder={placeholder}
        {...register(id, { required })}
        className="text-black font-light py-2 px-4 w-full rounded-full bg-neutral-100 focus:outline-none"
      />
    </div>
  )
}

export default MessageInput;