'use client'

import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto, HiPaperAirplane } from "react-icons/hi2";
import { 
  CldUploadButton, 
  CloudinaryUploadWidgetResults, 
  CloudinaryUploadWidgetInfo 
} from "next-cloudinary"

import { useConversation } from "@/app/hooks/useConversation";
import { API_ROUTES } from "@/app/utils/routes";
import MessageInput from "./MessageInput";

const Form = () => {

  const { conversationId } = useConversation();
  const { 
    register, 
    setValue, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FieldValues>({
    defaultValues: {
      message: ""
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", {shouldValidate: true});

    axios.post(API_ROUTES.MESSAGES, {
      ...data,
      conversationId: conversationId
    })
  }

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    const info = result?.info as CloudinaryUploadWidgetInfo;

    axios.post(API_ROUTES.MESSAGES, {
      image: info?.secure_url,
      conversationId: conversationId
    })
  }

  return (
    <div
      className="p-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full"
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="lganrog8"
      >
        <HiPhoto 
          size={30} 
          className="cursor-pointer text-sky-500 hover:text-sky-600" 
        />
      </CldUploadButton>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput 
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane 
            size={18}
            className="text-white"
          />
        </button>
      </form>
    </div>
  )
}

export default Form;