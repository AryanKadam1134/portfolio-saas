import { useEffect, useMemo, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { authEndpoints } from "../../services/auth.service";

import useApi from "../../hooks/useApi";

import { AuthContext } from "./useAuth";

import { useNotify } from "../notification/useNotify";

export function AuthProvider({ children }) {
  const { notify } = useNotify();

  const { loading, callApi } = useApi({ authLoading: true });

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const authLoading = loading.authLoading;

  const [deviceId] = useState(() => {
    let storedDeviceId = localStorage.getItem("deviceId");

    if (!storedDeviceId) {
      storedDeviceId = uuidv4();
      localStorage.setItem("deviceId", storedDeviceId);
    }

    return storedDeviceId;
  });

  const config = useMemo(() => {
    return {
      headers: {
        "x-device-id": deviceId,
      },
    };
  }, [deviceId]);

  const googleAuth = (body) => {
    callApi("authLoading", () => authEndpoints.googleAuth(body, config), {
      onSuccess: (res) => {
        setUser(res.data?.user);
        setError(null);
      },
      onError: (error) => {
        notify.error({
          title: error?.message || "Google Authentication failed!",
        });
        setError(error?.message);
      },
    });
  };

  const login = async (payload) => {
    const res = await callApi(
      "loading",
      () => authEndpoints.login(payload, config),
      {
        onSuccess: (res) => {
          setUser(res.data?.user);
          setError(null);
        },
        onError: (error) => {
          notify.error({ title: error?.message || "Login failed!" });
          setError(error?.message);
        },
      },
    );

    return res?.success;
  };

  const logout = () => {
    callApi("loggingOut", authEndpoints.logout, {
      onSuccess: () => {
        setUser(null);
      },
    });
  };

  useEffect(() => {
    const restoreSession = () => {
      callApi("authLoading", () => authEndpoints.restoreSession(config), {
        onSuccess: (res) => {
          setUser(res.data?.user);
        },
      });
    };

    restoreSession();
  }, [callApi, config, deviceId]);

  return (
    <AuthContext.Provider
      value={{
        error,
        setError,
        user,
        setUser,
        deviceId,
        authLoading,
        googleAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
