import { SignInResponse } from "next-auth/react"

const authChainCallback = (
  callback: () => Promise<SignInResponse | undefined>,
  success: ((isOk: boolean, msg: string) => void) | null,
  error: (() => void) | null,
  finallyCall: (() => void) | null
) => {
  callback()
    .then((callback: SignInResponse | undefined) => {
      let msg = "Succes!"
      if (callback?.error) msg = "Invalid creadentials!";

      if(success) success(!callback?.error as boolean, msg);
    })
    .catch((e) => {
      console.log(e)

      if(error) error();
    })
    .finally(() => {
      if(finallyCall) finallyCall()
    })
}

export { authChainCallback }