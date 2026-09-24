import { useGoogleLogin } from "@react-oauth/google";

import { useAuth } from "../../context/auth/useAuth";
import { useNotify } from "../../context/notification/useNotify";

import googleLogo from "../../assets/google.svg";

export default function GoogleAuthButton({ rememberMe }) {
  const { notify } = useNotify();
  const { googleAuth } = useAuth();

  const authenticate = useGoogleLogin({
    flow: "auth-code",
    redirect_uri:
      "https://portfolio-saas-p7ph.onrender.com/oauth/google/callback",
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
      bg-light-input-bg dark:bg-dark-input-bg
      border border-light-input-border dark:border-dark-input-border
      rounded-full cursor-pointer"
    >
      <img src={googleLogo} alt="Google Logo" className="size-5" />
      <span className="w-full text-center">Continue with Google</span>
    </div>
  );
}
