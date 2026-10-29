import { useGoogleLogin } from "@react-oauth/google";

import { useAuth } from "../../context/auth/useAuth";
import { useNotify } from "../../context/notification/useNotify";

import googleLogo from "../../assets/google.svg";

export default function GoogleAuthButton({ rememberMe }) {
  const { notify } = useNotify();
  const { googleAuth } = useAuth();

  const authenticate = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      await googleAuth({ code: codeResponse.code, rememberMe });
    },
    onError: () => {
      notify.error({ title: "Google Authentication failed!" });
    },
  });

  return (
    <div
      onClick={() => authenticate()}
      className="p-2.5 flex items-center justify-between gap-3
      text-light-text-primary dark:text-dark-text-primary
      bg-light-bg-secondary dark:bg-dark-bg-secondary
      hover:bg-light-bg-tertiary hover:dark:bg-dark-bg-tertiary
      border border-light-border-primary dark:border-dark-border-primary
      rounded-full cursor-pointer transition-all duration-200"
    >
      <img src={googleLogo} alt="Google Logo" className="size-5" />
      <span className="w-full text-center">Continue with Google</span>
    </div>
  );
}
