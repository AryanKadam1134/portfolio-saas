import { GoogleLogin } from "@react-oauth/google";
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

import { useAuth } from "../../context/auth/useAuth";
import { useNotify } from "../../context/notification/useNotify";

export default function SignUp() {
  const { notify } = useNotify();
  const { error, setError } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange", // 🔥 important
  });

  const onSubmit = async (payload) => {
    try {
      await authEndpoints.register(payload);

      reset();
      notify.success({ title: "Account Created Successfully!" });
      // console.log("User Registered: ", data);
    } catch (error) {
      console.error("Login failed: ", error);
      notify.error({ title: "Registration Failed!" });
      setError(error?.message);
    }
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
                required: "username is required!",
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
                required: "email is required!",
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
                required: "password is required!",
                minLength: {
                  value: 8,
                  message: "Minimum 6 characters",
                },
                maxLength: {
                  value: 16,
                  message: "Maximum 16 characters",
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
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </CustomButton>
        </>
      }
      formSubContent={
        <>
          <div className="flex items-center gap-3 text-xs">
            <p className="flex-1 border-b border-light-input-border dark:border-dark-input-border"></p>
            <p className="text-gray-400">OR</p>
            <p className="flex-1 border-b border-light-input-border dark:border-dark-input-border"></p>
          </div>

          <GoogleAuthButton />

          <p className="mt-2 text-center text-xs text-light-text-primary dark:text-dark-text-primary">
            <span>Already have an account? </span>

            <span
              onClick={() => navigate("/signin")}
              className="text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
            >
              Sign In
            </span>
          </p>
        </>
      }
    />
  );
}
