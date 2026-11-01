import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LockKeyholeOpen, Mail } from "lucide-react";

import Authentication from "../../components/authentication/Authentication";
import GoogleAuthButton from "../../components/authentication/GoogleAuthButton";

import FormField from "../../components/ui/FormField";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomInputPassword from "../../components/ui/CustomInputPassword";

import { authEndpoints } from "../../services/auth.service";

import useApi from "../../hooks/useApi";
import useFieldErrors from "../../hooks/useFieldErrors";

import { useNotify } from "../../context/notification/useNotify";

export default function SignUp() {
  const { notify } = useNotify();

  const { loading, callApi } = useApi();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const { addErrors } = useFieldErrors(setError);

  const onSubmit = (payload) => {
    callApi("registering", () => authEndpoints.register(payload), {
      onSuccess: (res) => {
        reset();
        notify.success({
          title: res?.message || "Account created!",
        });
        navigate("/signin");
      },
      onError: (error) => {
        addErrors(error);
        notify.error({ title: error?.message || "Registration failed!" });
      },
    });
  };

  return (
    <Authentication
      heading="Create your account"
      onSubmit={handleSubmit(onSubmit)}
      formContent={
        <>
          {/* First Name */}
          <FormField
            id="firstName"
            label="First Name"
            required
            error={errors?.firstName?.message}
          >
            <CustomInput
              id="firstName"
              type="text"
              placeholder="John"
              {...register("firstName", {
                required: "First Name is required!",
              })}
            />
          </FormField>

          {/* Last Name */}
          <FormField
            id="lastName"
            label="Last Name"
            error={errors?.lastName?.message}
          >
            <CustomInput
              id="lastName"
              type="text"
              placeholder="Doe"
              {...register("lastName")}
            />
          </FormField>

          {/* Username */}
          <FormField
            id="username"
            label="Username"
            required
            error={errors?.username?.message}
          >
            <CustomInput
              id="username"
              type="text"
              placeholder="username"
              {...register("username", {
                required: "Username is required!",
              })}
            />
          </FormField>

          {/* Email */}
          <FormField
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
                required: "Email is required!",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email format",
                },
              })}
            />
          </FormField>

          {/* Password */}
          <FormField
            id="password"
            label="Password"
            required
            error={errors?.password?.message}
          >
            <CustomInputPassword
              id="password"
              icon={LockKeyholeOpen}
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required!",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters",
                },
                maxLength: {
                  value: 16,
                  message: "Maximum 16 characters",
                },
              })}
            />
          </FormField>

          {/* Submit */}
          <CustomButton
            type="submit"
            name={loading.registering ? "Signing Up..." : "Sign Up"}
            className="w-full"
            loading={loading.registering}
          />
        </>
      }
      formSubContent={
        <>
          <div className="flex items-center gap-3 text-xs">
            <p className="flex-1 border-b border-light-input-border dark:border-dark-input-border"></p>
            <p className="text-light-text-secondary">OR</p>
            <p className="flex-1 border-b border-light-input-border dark:border-dark-input-border"></p>
          </div>

          <GoogleAuthButton />

          <p className="mt-2 text-center text-xs text-light-text-primary dark:text-dark-text-primary">
            <span>Already have an account? </span>

            <span
              onClick={() => navigate("/signin")}
              className="text-blue-400 hover:text-blue-500 cursor-pointer transition-colors"
            >
              Sign In
            </span>
          </p>
        </>
      }
    />
  );
}
