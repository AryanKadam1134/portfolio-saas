import React, { useState } from "react";

import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { LockKeyholeOpen, Mail } from "lucide-react";

import AppLogo from "../../components/common/AppLogo";
import PageHeader from "../../components/common/PageHeader";

import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomCheckbox from "../../components/ui/CustomCheckbox";
import CustomInputPassword from "../../components/ui/CustomInputPassword";

import { authEndpoints } from "../../services/authService";

import { useAuth } from "../../context/auth/useAuth";

import { useNotify } from "../../context/notification/useNotify";

export default function Authentication() {
  const { notify } = useNotify();
  const { error, setError, login, googleAuth } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange", // 🔥 important
  });

  const rememberMe = useWatch({ control, name: "rememberMe" });

  const onSubmit = async (payload) => {
    if (isLogin) {
      const success = await login(payload);
      if (success) navigate("/details");
    } else {
      try {
        await authEndpoints.register(payload);

        reset();
        setIsLogin(true);
        notify.msgSuccess("Account Created Successfully!");
        // console.log("User Registered: ", data);
      } catch (error) {
        console.error("Login failed: ", error);
        notify.msgError("Registration Failed!");
        setError(error?.message);
      }
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-10 bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <AppLogo className="size-12" />

      <div className="w-full max-w-md bg-light-bg-primary dark:bg-dark-bg-tertiary p-8 rounded-xl shadow-lg border border-light-border-primary dark:border-dark-border-primary">
        <PageHeader
          heading={isLogin ? "Welcome to Profilo" : "Create your Profilo account"}
          subHeading={
            isLogin
              ? "Sign in to manage your professional portfolio"
              : "Build and share your professional portfolio"
          }
          className="mb-6 justify-center text-center"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 text-sm"
        >
          {/* First Name */}
          {!isLogin && (
            <LabelInput
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
            </LabelInput>
          )}

          {/* Last Name */}
          {!isLogin && (
            <LabelInput
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
            </LabelInput>
          )}

          {/* Username */}
          {!isLogin && (
            <LabelInput
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
            </LabelInput>
          )}

          {/* User Credential */}
          {isLogin && (
            <LabelInput
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
            </LabelInput>
          )}

          {/* Email */}
          {!isLogin && (
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

          {/* Password */}
          <LabelInput
            id="password"
            label="Password"
            attachment={
              isLogin && (
                <p
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
                >
                  Forgot Password?
                </p>
              )
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
          </LabelInput>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          {/* Remember Me */}
          {isLogin && (
            <LabelInput
              id="rememberMe"
              label="Remember Me?"
              type="checkbox"
              error={errors?.rememberMe?.message}
            >
              <CustomCheckbox id="rememberMe" {...register("rememberMe")} />
            </LabelInput>
          )}

          {/* Submit */}
          <CustomButton
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </CustomButton>

          <div className="flex items-center gap-3 text-xs">
            <p className="flex-1 border-b border-light-input-border dark:border-dark-input-border"></p>
            <p className="text-gray-400">OR</p>
            <p className="flex-1 border-b border-light-input-border dark:border-dark-input-border"></p>
          </div>

          <div className="w-full">
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                googleAuth(credentialResponse, rememberMe)
              }
              theme="outlined"
              size="large"
              shape="pill"
              text={isLogin ? "signin_with" : "signup_with"}
              width="100%"
            />
          </div>

          <p className="mt-2 text-center text-xs text-light-text-primary dark:text-dark-text-primary">
            {isLogin
              ? "Don't have an account yet? "
              : "Already have an account? "}
            <span
              onClick={() => {
                setIsLogin((prev) => {
                  setError(null);
                  return !prev;
                });
                reset();
              }}
              className="text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
