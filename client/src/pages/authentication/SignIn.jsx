import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { LockKeyholeOpen } from "lucide-react";

import Authentication from "../../components/authentication/Authentication";
import GoogleAuthButton from "../../components/authentication/GoogleAuthButton";

import FormField from "../../components/ui/FormField";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomCheckbox from "../../components/ui/CustomCheckbox";
import CustomInputPassword from "../../components/ui/CustomInputPassword";

import { passwordValidation } from "../../utils/formValidations";

import useFieldErrors from "../../hooks/useFieldErrors";

import { useAuth } from "../../context/auth/useAuth";

export default function SignIn() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const { addErrors } = useFieldErrors(setError);

  const rememberMe = useWatch({ control, name: "rememberMe" });

  const onSubmit = async (payload) => {
    await login(payload)
      .then(() => {
        navigate("/details");
      })
      .catch(addErrors);
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
              <Link
                to="/forgot-password"
                className="text-xs text-blue-400 hover:text-blue-500 cursor-pointer"
              >
                Forgot Password?
              </Link>
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
                ...passwordValidation(),
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

          {/* Submit */}
          <CustomButton
            type="submit"
            name={isSubmitting ? "Signing In..." : "Sign In"}
            className="w-full"
            loading={isSubmitting}
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

          <GoogleAuthButton rememberMe={rememberMe} />

          <p className="mt-2 text-center text-xs text-light-text-primary dark:text-dark-text-primary">
            <span>Don't have an account yet? </span>

            <span
              onClick={() => navigate("/signup")}
              className="text-blue-400 hover:text-blue-500 cursor-pointer transition-colors"
            >
              Sign Up
            </span>
          </p>
        </>
      }
    />
  );
}
