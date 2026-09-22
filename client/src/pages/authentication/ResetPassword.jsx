import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyholeOpen } from "lucide-react";

import Authentication from "../../components/authentication/Authentication";

import FormField from "../../components/ui/FormField";
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
      notify.success({ title: res?.message });
    } catch (error) {
      console.error("Reset Password failed: ", error);
      notify.error({ title: error?.message });
      setError(error?.message);
    }
  };

  return (
    <Authentication
      heading="Reset Password"
      subHeading="Choose a new password for your Profilo account"
      onSubmit={handleSubmit(onSubmit)}
      formContent={
        <>
          {/* New Password */}
          <FormField
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
          </FormField>

          {/* Confirm Password */}
          <FormField
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
          </FormField>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          {/* Submit */}
          <CustomButton
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </CustomButton>
        </>
      }
    />
  );
}
