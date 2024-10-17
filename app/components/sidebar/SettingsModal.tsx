'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { User } from "@prisma/client";
import { 
  CldUploadButton,
  CloudinaryUploadWidgetInfo, 
  CloudinaryUploadWidgetResults 
} from "next-cloudinary";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";


import Modal from "../Modal";
import { API_ROUTES } from "@/app/utils/routes";
import Input from "../input/Input";
import Button from "../Button";


interface SettingsModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  isOpen,
  onClose
}) => {
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  })

  const image = watch("image");
  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    const info = result?.info as CloudinaryUploadWidgetInfo;
    setValue("image", info?.secure_url, {
      shouldValidate: true
    })
  }

  const onSubmitHandle: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post(API_ROUTES.SETTINGS, data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(()=> toast.error("Something went wrong"))
      .finally(() => setIsLoading(false))
  }


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmitHandle)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input 
                id="name"
                label="Name"
                errors={errors}
                register={register}
                disabled={isLoading}
                required
              />

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <Image 
                    alt="avatar"
                    width="48"
                    height="48"
                    className="rounded-full"
                    src={image || currentUser?.image || "/images/placeholder.jpg"}
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset="lganrog8"
                  >
                    <Button
                      disabled={isLoading}
                      type="button"
                      secondary
                    >
                      Change
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button 
              disabled={isLoading}
              secondary
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              disabled={isLoading}
              type="submit"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SettingsModal;