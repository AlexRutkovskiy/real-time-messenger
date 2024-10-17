'use client'

import Modal from "@/app/components/Modal"
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageSrc
}: ImageModalProps) => {
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}  
    >
      <div>
        <Image 
          alt="image"
          width="300"
          height="300"
          src={imageSrc}
          className="object-cover w-full h-full"
        />
      </div>
    </Modal>
  )
}

export default ImageModal