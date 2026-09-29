import { useCallback, useEffect, useState } from "react";

import { Laptop, LoaderCircle, LogOut } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import UserSessionCard from "../../components/user/UserSessionCard";

import { userEndpoints } from "../../services/user.service";

import useApi from "../../hooks/useApi";

import { useNotify } from "../../context/notification/useNotify";

export default function UserSessions() {
  const { notify } = useNotify();

  const { loading, callApi } = useApi();

  const isLoading = loading.sessionsLoading;
  const [userSessions, setUserSessions] = useState([]);

  const fetchUserSessions = useCallback(() => {
    callApi("sessionsLoading", userEndpoints.getUserSessions, {
      onSuccess: (res) => {
        setUserSessions(res.data || []);
      },
      onError: (error) => {
        if (error?.statusCode !== 404) {
          notify.error({
            title: error?.message || "Failed to load active sessions!",
          });
        }
      },
    });
  }, [callApi, notify]);

  useEffect(() => {
    fetchUserSessions();
  }, [fetchUserSessions]);

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading="Active Sessions"
        subHeading="Review where your account is signed in and remove access you no longer recognize"
      >
        <div className="hidden items-center gap-2 rounded-md border border-light-border-primary bg-light-bg-primary px-3 py-2 text-xs text-light-text-secondary shadow-sm dark:border-dark-border-primary dark:bg-dark-bg-tertiary dark:text-dark-text-secondary sm:flex">
          <LogOut size={15} />
          {userSessions.length} active
        </div>
      </PageHeader>

      {isLoading && (
        <div className="flex items-center justify-center rounded-md border border-light-border-primary bg-light-bg-primary py-16 text-light-text-secondary dark:border-dark-border-primary dark:bg-dark-bg-tertiary dark:text-dark-text-secondary">
          <LoaderCircle size={20} className="mr-2 animate-spin" />
          Loading sessions...
        </div>
      )}

      {!isLoading && !userSessions.length && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-light-border-primary bg-light-bg-primary px-6 py-16 text-center dark:border-dark-border-primary dark:bg-dark-bg-tertiary">
          <div className="rounded-full bg-light-bg-secondary p-3 text-light-text-secondary dark:bg-dark-bg-secondary dark:text-dark-text-secondary">
            <Laptop size={24} />
          </div>
          <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
            No active sessions found
          </p>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Your active sign-ins will appear here.
          </p>
        </div>
      )}

      {!isLoading && userSessions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {userSessions.map((session) => (
            <UserSessionCard
              key={session?._id}
              session={session}
              onDelete={fetchUserSessions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
