import { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { authEndpoints } from "../../services/auth.service";

import { AuthContext } from "./useAuth";

import { useNotify } from "../notification/useNotify";

export function AuthProvider({ children }) {
  const { notify } = useNotify();

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [deviceId] = useState(() => {
    let storedDeviceId = localStorage.getItem("deviceId");

    if (!storedDeviceId) {
      storedDeviceId = uuidv4();
      localStorage.setItem("deviceId", storedDeviceId);
    }

    return storedDeviceId;
  });

  const googleAuth = async (body) => {
    try {
      const res = await authEndpoints.googleAuth(body, {
        headers: {
          "x-device-id": deviceId,
        },
      });

      const data = res.data;

      if (res?.success) {
        setUser(data?.user);
      }

      console.log("Login with Google succesfull:", data);
    } catch (error) {
      console.error("Error Login with Google: ", error);
    }
  };

  const login = async (payload) => {
    try {
      const res = await authEndpoints.login(payload, {
        headers: {
          "x-device-id": deviceId,
        },
      });
      const data = res.data;
      const success = res.success;

      if (success) {
        setUser(data?.user);
      }

      setError(null);
      return success;

      // console.log("Login succesfull:", data);
    } catch (error) {
      console.error("Error while login: ", error);
      notify.error({ title: error?.message || "Login failed!" });
      setError(error?.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authEndpoints.logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await authEndpoints.restoreSession({
          headers: {
            "x-device-id": deviceId,
          },
        });

        const data = res.data;

        if (res?.success) {
          setUser(data?.user);
        }

        console.log("Session restored: ", data);
      } catch (error) {
        console.error("Error restoring session: ", error);
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, [deviceId]);

  return (
    <AuthContext.Provider
      value={{
        error,
        setError,
        user,
        authLoading,
        googleAuth,
        login,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
