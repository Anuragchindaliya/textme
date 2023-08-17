import { useAppSelector } from "@/app/hooks"
import { selectCurrentEmail } from "./authSlice"
import { useCallback } from "react"
import OTPInput from "@/features/auth/components/OtpInput"
import { useVerifyOTPMutation } from "./authAPI"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/Router"
import {
  RegisterScreenType,
  registerScreens,
} from "@/pages/authentication/page"

type OTPFormProps = {
  setOtpScreen: React.Dispatch<React.SetStateAction<RegisterScreenType>>
}
const OTPForm = ({ setOtpScreen }: OTPFormProps) => {
  const email = useAppSelector(selectCurrentEmail)
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation()
  const { toast } = useToast()
  const navigate = useNavigate()
  const onInput = useCallback(async (otp: string[]) => {
    console.log({ otp })
    try {
      const result = await verifyOTP({ email, otp: otp.join("") }).unwrap()
      if (result.statusCode === 200) {
        setOtpScreen(registerScreens.PASSWORD)
        toast({
          title: result.message,
        })
      } else {
        toast({
          variant: "destructive",
          title: result.message,
        })
      }
    } catch (error: any) {
      console.log("otp ", error)
      toast({
        variant: "destructive",
        title: error.data.message,
        // description: error.data.message,
      })
    }
  }, [])
  return (
    <form>
      <p className="mb-5 text-sm ">
        an OTP has been sent on your email ID{" "}
        <span className=" font-semibold">{email}</span>{" "}
        <button
          className="text-coral font-bold"
          onClick={() => {
            setOtpScreen(registerScreens.REGISTER)
          }}
        >
          (Change)
        </button>
      </p>
      <div>OTP</div>
      <OTPInput onInput={onInput} />
    </form>
  )
}
export default OTPForm
