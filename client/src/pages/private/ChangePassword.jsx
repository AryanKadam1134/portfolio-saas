import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { LockKeyholeOpen } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import CommonSkeleton from "../../components/common/CommonSkeleton";

import FormField from "../../components/ui/FormField";
import CustomButton from "../../components/ui/CustomButton";
import CustomInputPassword from "../../components/ui/CustomInputPassword";

import { authEndpoints } from "../../services/auth.service";

import useApi from "../../hooks/useApi";

import { useNotify } from "../../context/notification/useNotify";

export default function ChangePassword() {
  const { notify } = useNotify();

  const { loading, callApi } = useApi({ checking: true });

  const [hasPassword, setHasPassword] = useState();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  // Watch password fields for real-time validation
  const newPassword = watch("new_password");

  const changePassword = (payload) => {
    callApi("changing", () => authEndpoints.changePassword(payload), {
      onSuccess: (res) => {
        reset();
        notify.success({
          title: res?.message || "Password changed successfully!",
        });
      },
      onError: (error) => {
        notify.error({ title: error?.message || "Failed to change password" });
      },
    });
  };

  useEffect(() => {
    const checkPassword = () => {
      callApi("checking", authEndpoints.checkPassword, {
        onSuccess: (res) => {
          const data = res.data;

          reset({ isInitializing: !data });
          setHasPassword(data);
        },
        onError: (error) => {
          notify.error({
            title: error?.message || "Failed to check password",
          });
        },
      });
    };

    checkPassword();
  }, [callApi, notify, reset]);

  if (loading.checking) {
    return <CommonSkeleton count={3} />;
  }

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading="Change Password"
        subHeading="Keep your account secure with a strong password"
      />

      <form
        onSubmit={handleSubmit(changePassword)}
        className="grid grid-cols-12 gap-6 text-sm"
      >
        {/* Old Password */}
        {hasPassword && (
          <FormField
            id="old_password"
            label="Current Password"
            colSpan="col-span-12 sm:col-span-6"
            required
            error={errors?.old_password?.message}
          >
            <CustomInputPassword
              id="old_password"
              icon={LockKeyholeOpen}
              placeholder="Enter your current password"
              {...register("old_password", {
                required: "Current password is required!",
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
        )}

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

        <CustomButton
          type="submit"
          name={loading.changing ? "Saving..." : "Save"}
          className="col-span-12 place-self-end"
          loading={loading.changing}
        />
      </form>
    </div>
  );
}
