import React, { useEffect, useState } from "react";

import { formatDate } from "../../utils/formatDate";

import { userEndpoints } from "../../services/userService";

export default function UserSessions() {
  const [userSessions, setUserSessions] = useState([]);

  useEffect(() => {
    const fetchUserSesions = async () => {
      try {
        const res = await userEndpoints.getUserSessions();

        const data = res.data;

        setUserSessions(data);
        console.log("User Sessions: ", data);
      } catch (error) {
        console.error("Error fetching user sessions: ", error);
      }
    };

    fetchUserSesions();
  }, []);

  return (
    <div className="flex flex-col gap-5 text-white">
      {userSessions?.length &&
        userSessions.map((session) => {
          return (
            <div className="">
              <p>{session?.userAgent?.browser?.name}</p>
              <p>{session?.userAgent?.device?.type}</p>
              <p>{formatDate(session?.createdAt)}</p>
            </div>
          );
        })}
    </div>
  );
}
