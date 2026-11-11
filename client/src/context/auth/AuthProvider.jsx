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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const authenticated =
      localStorage.getItem("isAuthenticated") === "true" ? true : false;

    return authenticated;
  });

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

  const updateSession = (user, authFlag) => {
    setUser(user);
    setIsAuthenticated(authFlag);
    localStorage.setItem("isAuthenticated", authFlag);
  };

  const googleAuth = (body) => {
    callApi("authLoading", () => authEndpoints.googleAuth(body, config), {
      onSuccess: (res) => {
        updateSession(res?.data, true);
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
    return await callApi(
      "loading",
      () => authEndpoints.login(payload, config),
      {
        onSuccess: (res) => {
          updateSession(res?.data, true);
          setError(null);
        },
        onError: (error) => {
          notify.error({ title: error?.message || "Login failed!" });
        },
      },
    );
  };

  const logout = () => {
    callApi("loggingOut", authEndpoints.logout, {
      onSuccess: () => {
        updateSession(null, false);
      },
    });
  };

  useEffect(() => {
    const restoreSession = () => {
      callApi("authLoading", () => authEndpoints.restoreSession(config), {
        onSuccess: (res) => {
          updateSession(res?.data, true);
        },
        onError: () => {
          updateSession(null, false);
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
        isAuthenticated,
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
