import { useCallback, useEffect, useMemo, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { authEndpoints } from "../../services/auth.service";

import useApi from "../../hooks/useApi";

import { AuthContext } from "./useAuth";

import { useNotify } from "../notification/useNotify";

export function AuthProvider({ children }) {
  const { notify } = useNotify();

  const { callApi } = useApi({ authenticating: true });

  const [isServerRunning, setIsServerRunning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const authenticated =
      localStorage.getItem("isAuthenticated") === "true" ? true : false;

    return authenticated;
  });
  const [user, setUser] = useState(null);

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

  const updateSession = useCallback((user, authFlag) => {
    setUser(user);
    setIsAuthenticated(authFlag);
    localStorage.setItem("isAuthenticated", authFlag);
  }, []);

  const googleAuth = (body) => {
    callApi("authenticating", () => authEndpoints.googleAuth(body, config), {
      onSuccess: (res) => {
        updateSession(res?.data, true);
      },
      onError: (error) => {
        notify.error({
          title: error?.message || "Google Authentication failed!",
        });
      },
    });
  };

  const login = async (payload) => {
    return await callApi(
      "authenticating",
      () => authEndpoints.login(payload, config),
      {
        onSuccess: (res) => {
          updateSession(res?.data, true);
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

  const restoreSession = useCallback(() => {
    callApi("authenticating", () => authEndpoints.restoreSession(config), {
      onSuccess: (res) => {
        updateSession(res?.data, true);
      },
      onError: () => {
        updateSession(null, false);
      },
    });
  }, [callApi, config, updateSession]);

  const checkHealth = useCallback(() => {
    callApi("checking", authEndpoints.healthCheck, {
      onSuccess: () => {
        setIsServerRunning(true);
        restoreSession();
      },
      onError: () => {
        updateSession(null, false);
      },
    });
  }, [updateSession, restoreSession, callApi]);

  useEffect(() => {
    if (isServerRunning) return;

    checkHealth();

    const interval = setInterval(() => {
      checkHealth();
    }, 15000);

    return () => clearInterval(interval);
  }, [isServerRunning, checkHealth]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isServerRunning,
        user,
        setUser,
        deviceId,
        googleAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
