'use client';

import { useState, useCallback } from "react"
import { 
  type FieldValues, 
  type SubmitHandler,
  useForm 
} from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs"

import Input from "@/app/components/input/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";


const VARIANT_TYPE = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER"
} as const

type Variant = "LOGIN" | "REGISTER";



export default function AuthForm() {
  const [ variant, setVariant ] = useState<Variant>(VARIANT_TYPE.LOGIN);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const toggleVariant = useCallback(() => {
    const tmpV = variant === VARIANT_TYPE.LOGIN 
      ? VARIANT_TYPE.REGISTER 
      : VARIANT_TYPE.LOGIN;
    setVariant(tmpV)
  }, [variant])

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    console.log(data)
    if (variant === VARIANT_TYPE.LOGIN) {
      // AXIOS LOGIN
    } else {
      // AXIOS REGISTER
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true)
    console.log(action)
    // NextAuth Social Sign In
  }

  return (
    <div className="mt-8 mx-auto w-full sm:max-w-md">
      <div className="px-4 py-8 shadow sm:rounded-lg sm:px-10 bg-white">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === VARIANT_TYPE.REGISTER && (
            <Input 
              label="Name"
              id="name"
              register={register} 
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input 
            label="Email address"
            id="email"
            type="email"
            register={register} 
            errors={errors}
            disabled={isLoading}
          />
          <Input 
            label="Password"
            id="password"
            type="password"
            register={register} 
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button type="submit" disabled={isLoading} fullWidth>
              {variant === VARIANT_TYPE.LOGIN ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>

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
            <AuthSocialButton 
              icon={BsGithub}
              onClick={()=>socialAction("github")} 
              disabled={isLoading}
            />
            <AuthSocialButton 
              icon={BsGoogle}
              onClick={()=>socialAction("google")} 
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2 justify-center text-sm px-2 text-gray-500">
          <div>
            {variant === VARIANT_TYPE.LOGIN ? "New to Messenger?" : "Already have an account?"}
          </div>
          <div
            onClick={toggleVariant}
            className="underline cursor-pointer"
          >
            {variant === VARIANT_TYPE.LOGIN ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  )
}