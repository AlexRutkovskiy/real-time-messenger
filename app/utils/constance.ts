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
} as const