import React, { useState, useRef, useEffect } from "react"
type OtpInputProps = {
  onInput: (p: string[]) => void
}
const OTPInput: React.FC<OtpInputProps> = ({ onInput }) => {
  const [otp, setOTP] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const handleInputChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOTP = [...otp]
      newOTP[index] = value.slice(-1)
      setOTP(newOTP)

      if (value !== "" && index <= 5) {
        if (index === 5) {
          onInput(newOTP)
          console.log("last input")
        }
        focusNextInput(index)
      } else if (value === "" && index > 0) {
        focusPreviousInput(index)
      }

      // if (value !== "") {
      //   if (index === 5) {
      //     onInput(newOTP)
      //     console.log("last input")
      //   }
      //   focusNextInput(index)
      // }
    }
  }

  const focusNextInput = (index: number) => {
    if (inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const focusPreviousInput = (index: number) => {
    if (inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    currentIndex: number,
  ) => {
    const clipboardData = e.clipboardData
    const pastedText = clipboardData.getData("text/plain").trim()
    const newOTP = [...otp]

    if (pastedText.length <= 6 - currentIndex) {
      for (let i = 0; i < pastedText.length; i++) {
        newOTP[currentIndex + i] = pastedText.charAt(i)
      }
      setOTP(newOTP)
      focusNextInput(currentIndex + pastedText.length - 1)
    } else {
      for (let i = 0; i < 6 - currentIndex; i++) {
        newOTP[currentIndex + i] = pastedText.charAt(i)
      }
      setOTP(newOTP)
      focusNextInput(5)
    }
    if (newOTP.length === otp.length) {
      onInput(newOTP)
      console.log("last input")
    }

    e.preventDefault()
  }
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && otp[index] === "") {
      focusPreviousInput(index)
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusPreviousInput(index)
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      focusNextInput(index)
    }
    inputRefs.current.forEach((input) => {
      if (input) {
        input.selectionStart = input.selectionEnd = input.value.length
      }
    })
  }
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <div className="flex">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          className="w-10 h-12 mx-1 text-center border rounded focus:outline-none"
          type="text"
          // maxLength={1}
          value={digit}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onPaste={(e) => handlePaste(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  )
}

export default OTPInput
