import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyholeOpen } from "lucide-react";

import Authentication from "../../components/authentication/Authentication";

import FormField from "../../components/ui/FormField";
import CustomButton from "../../components/ui/CustomButton";
import CustomInputPassword from "../../components/ui/CustomInputPassword";

import { passwordValidation } from "../../utils/formValidations";

import { authEndpoints } from "../../services/auth.service";

import useApi from "../../hooks/useApi";
import useFieldErrors from "../../hooks/useFieldErrors";

import { useNotify } from "../../context/notification/useNotify";

export default function ResetPassword() {
  const { notify } = useNotify();

  const { loading, callApi } = useApi();

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email,
    },
    mode: "onChange",
  });

  const { addErrors } = useFieldErrors(setError);

  const newPassword = watch("new_password");

  const onSubmit = (payload) => {
    callApi("resetting", () => authEndpoints.resetPassword(payload), {
      onSuccess: (res) => {
        setApiError(null);
        navigate("/signin");
        notify.success({ title: res?.message || "Password changed!" });
      },
      onError: (error) => {
        addErrors(error);
        setApiError(error?.message);
        notify.error({ title: error?.message || "Failed to change password!" });
      },
    });
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
                ...passwordValidation(),
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
                ...passwordValidation(),
                validate: (value) => {
                  if (value !== newPassword) {
                    return "Passwords do not match!";
                  }
                  return true;
                },
              })}
            />
          </FormField>

          {apiError && (
            <p className="text-center text-sm text-red-400">{apiError}</p>
          )}

          {/* Submit */}
          <CustomButton
            type="submit"
            name={loading.resetting ? "Saving..." : "Save"}
            className="w-full"
            loading={loading.resetting}
          />
        </>
      }
    />
  );
}
