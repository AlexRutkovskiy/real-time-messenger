import { BsGithub, BsGoogle } from "react-icons/bs";

export const SOCIALS = [
  {
    icon: BsGithub,
    name: "github"
  },
  {
    icon: BsGoogle,
    name: "google"
  }
]

export const VARIANT_TYPE = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER"
} as const;

export const PUSHER_EVENTS = {
  MESSAGE_NEW: "message:new",
  MESSAGE_UPDATE: "message:update",
  CONVERSATION_UPDATE: "conversation:update",
  CONVERSATION_NEW: "conversation:new",
  CONVERSATION_REMOVE: "conversation:remove"
}