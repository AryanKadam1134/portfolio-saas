import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LockKeyholeOpen, Mail } from "lucide-react";

import LabelInput from "../../components/ui/LabelInput";
import PageHeader from "../../components/common/PageHeader";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";

import { authEndpoints } from "../../services/authService";

import { useNotify } from "../../context/notification/useNotify";

export default function ForogtPassword() {
  const { notify } = useNotify();

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isOtp, setIsOtp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange", // 🔥 important
  });

  const onSubmit = async (payload) => {
    try {
      let res;
      if (isOtp) {
        res = await authEndpoints.verifyOTP(payload);
        navigate("/reset-password", { state: { email: payload?.email } });
      } else {
        res = await authEndpoints.forgotPassword(payload);
        setIsOtp(true);
      }

      setError(null);
      notify.msgSuccess(res?.message);
    } catch (error) {
      console.error("Forgot Password failed: ", error);
      notify.msgError(error?.message);
      setError(error?.message);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <div className="w-full max-w-md bg-light-bg-primary dark:bg-dark-bg-tertiary p-8 rounded-2xl shadow-lg border border-light-border-primary dark:border-dark-border-primary">
        <PageHeader
          heading="Forgot Password"
          subHeading={
            isOtp
              ? "Enter the verification code sent to your email"
              : "Recover access to your Profilo account"
          }
          className="mb-8 justify-center text-center"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 text-sm"
        >
          {/* Email */}
          {!isOtp && (
            <LabelInput
              id="email"
              label="Email"
              required
              error={errors?.email?.message}
            >
              <CustomInput
                id="email"
                type="email"
                icon={Mail}
                placeholder="example@gmail.com"
                {...register("email", {
                  required: "email is required!",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email format",
                  },
                })}
              />
            </LabelInput>
          )}

          {/* OTP */}
          {isOtp && (
            <LabelInput
              id="otp"
              label="OTP"
              required
              error={errors?.otp?.message}
            >
              <CustomInput
                id="otp"
                type="number"
                {...register("otp", {
                  required: "otp is required!",
                  minLength: 6,
                  maxLength: 6,
                })}
              />
            </LabelInput>
          )}

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          {/* Submit */}
          <CustomButton
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isOtp
              ? isSubmitting
                ? "Verifying..."
                : "Verifying OTP"
              : isSubmitting
                ? "Sending..."
                : "Send OTP"}
          </CustomButton>
        </form>
      </div>
    </div>
  );
}
