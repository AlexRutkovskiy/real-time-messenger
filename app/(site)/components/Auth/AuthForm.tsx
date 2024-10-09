'use client';

import { useState, useCallback, useEffect } from "react"
import { 
  type FieldValues, 
  type SubmitHandler,
  useForm 
} from "react-hook-form";
import { signIn, SignInResponse, useSession } from "next-auth/react"
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Input from "@/app/components/input/Input";
import Button from "@/app/components/Button";
import AuthSocial from "./AuthSocial/AuthSocial";
import { VARIANT_TYPE, SOCIALS } from "@/app/utils/constance";
import { API_ROUTES, SITE_ROUTES } from "@/app/utils/routes";
import { authChainCallback } from "@/app/api/register/action"
import AuthButton from "./AuthButton";

type Variant = typeof VARIANT_TYPE.LOGIN | typeof VARIANT_TYPE.REGISTER;


export default function AuthForm() {
  const session = useSession();
  const router = useRouter();
  const [ variant, setVariant ] = useState<Variant>(VARIANT_TYPE.LOGIN);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    if(session?.status === "authenticated") {
      router.push(SITE_ROUTES.USERS)
    }
  }, [router, session?.status])

  const toggleVariant = useCallback(() => {
    const tmpV = variant === VARIANT_TYPE.LOGIN 
      ? VARIANT_TYPE.REGISTER 
      : VARIANT_TYPE.LOGIN;
    setVariant(tmpV)
  }, [variant])

  const request = useCallback((callback:() => Promise<SignInResponse | undefined>) => {
    authChainCallback(
      callback,
      (isOk: boolean, msg: string) => {
        const fn = isOk ? toast.success : toast.error;
        fn(msg);
        
        if (isOk) {
          reset();
          router.push(SITE_ROUTES.USERS)  
        }
      },
      () => toast.error("Something went wrong!"),
      () => setIsLoading(false)
    );    
  }, [reset, router])

  const onSubmit: SubmitHandler<FieldValues> = useCallback((data) => {
    setIsLoading(true)

    const callback: () => Promise<SignInResponse | undefined> = 
      (variant === VARIANT_TYPE.LOGIN)
      ? () => signIn("credentials", {...data, redirect: false})
      : () => axios.post(API_ROUTES.AUTH.REGISTER, data)
        .then(() => signIn("credentials", {...data, redirect: false}))

    request(callback);
  }, [request, variant])

  const socialAction = useCallback((action: string) => {
    setIsLoading(true)
    request(() => signIn(action, { redirect: false }))
  }, [request])

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

        <AuthSocial 
          items={SOCIALS}
          onClick={socialAction}
          disabled={isLoading}
        />

        <AuthButton 
          variant={variant}
          toggleVariant={toggleVariant}
        />
      </div>
    </div>
  )
}