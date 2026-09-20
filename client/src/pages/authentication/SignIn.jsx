import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { LockKeyholeOpen } from "lucide-react";

import Authentication from "../../components/authentication/Authentication";

import FormField from "../../components/ui/FormField";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomCheckbox from "../../components/ui/CustomCheckbox";
import CustomInputPassword from "../../components/ui/CustomInputPassword";

import { useAuth } from "../../context/auth/useAuth";

export default function SignIn() {
  const { error, login, googleAuth } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const rememberMe = useWatch({ control, name: "rememberMe" });

  const onSubmit = async (payload) => {
    const success = await login(payload);
    if (success) navigate("/details");
  };

  return (
    <Authentication
      heading="Welcome to Profilo"
      onSubmit={handleSubmit(onSubmit)}
      formContent={
        <>
          {/* User Credential */}
          <FormField
            id="userCredential"
            label="Username or Email"
            required
            error={errors?.userCredential?.message}
          >
            <CustomInput
              id="userCredential"
              type="text"
              placeholder="username / email"
              {...register("userCredential", {
                required: "username or email is required!",
              })}
            />
          </FormField>

          {/* Password */}
          <FormField
            id="password"
            label="Password"
            attachment={
              <p
                onClick={() => navigate("/forgot-password")}
                className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
              >
                Forgot Password?
              </p>
            }
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

          {/* Remember Me */}
          <FormField
            id="rememberMe"
            label="Remember Me?"
            type="checkbox"
            error={errors?.rememberMe?.message}
          >
            <CustomCheckbox id="rememberMe" {...register("rememberMe")} />
          </FormField>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          {/* Submit */}
          <CustomButton
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
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

          <GoogleLogin
            onSuccess={(credentialResponse) =>
              googleAuth(credentialResponse, rememberMe)
            }
            theme="outlined"
            size="large"
            shape="pill"
            text="signin_with"
            width="100%"
          />

          <p className="mt-2 text-center text-xs text-light-text-primary dark:text-dark-text-primary">
            <span>Don't have an account yet? </span>

            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
            >
              Sign Up
            </span>
          </p>
        </>
      }
    />
  );
}
