import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyholeOpen, Mail } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";

import LabelInput from "../../components/ui/LabelInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomInputPassword from "../../components/ui/CustomInputPassword";

import { authEndpoints } from "../../services/auth.service";

import { useNotify } from "../../context/notification/useNotify";

export default function ResetPassword() {
  const { notify } = useNotify();

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email },
    mode: "onChange", // 🔥 important
  });

  const newPassword = watch("new_password");

  const onSubmit = async (payload) => {
    try {
      const res = await authEndpoints.resetPassword(payload);

      setError(null);
      navigate("/auth");
      notify.msgSuccess(res?.message);
    } catch (error) {
      console.error("Reset Password failed: ", error);
      notify.msgError(error?.message);
      setError(error?.message);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <div className="w-full max-w-md bg-light-bg-primary dark:bg-dark-bg-tertiary p-8 rounded-2xl shadow-lg border border-light-border-primary dark:border-dark-border-primary">
        <PageHeader
          heading="Reset Password"
          subHeading="Choose a new password for your Profilo account"
          className="mb-8 justify-center text-center"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 text-sm"
        >
          {/* New Password */}
          <LabelInput
            id="new_password"
            label="New Password"
            colSpan="col-span-12 sm:col-span-6"
            required
            error={errors?.new_password?.message}
          >
            <CustomInputPassword
              id="new_password"
              icon={LockKeyholeOpen}
              placeholder="Create a new password"
              {...register("new_password", {
                required: "New password is required!",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 16,
                  message: "Password must not exceed 16 characters",
                },
              })}
            />
          </LabelInput>

          {/* Confirm Password */}
          <LabelInput
            id="confirm_password"
            label="Confirm New Password"
            colSpan="col-span-12 sm:col-span-6"
            required
            error={errors?.confirm_password?.message}
          >
            <CustomInputPassword
              id="confirm_password"
              icon={LockKeyholeOpen}
              placeholder="Re-enter your new password"
              {...register("confirm_password", {
                required: "Please confirm your password!",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 16,
                  message: "Password must not exceed 16 characters",
                },
                validate: (value) => {
                  if (value !== newPassword) {
                    return "Passwords do not match!";
                  }
                  return true;
                },
              })}
            />
          </LabelInput>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          {/* Submit */}
          <CustomButton
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </CustomButton>
        </form>
      </div>
    </div>
  );
}
