import React, { useState, useEffect } from "react";

import { socialPlatformEndpoints } from "../services/socialPlatform.service";

export default function useSocailPlatforms() {
  const [platformsLoading, setLoading] = useState(true);
  const [socialPlatforms, setSocialPlatforms] = useState([]);

  const fetchSocialPlatforms = async () => {
    try {
      const res = await socialPlatformEndpoints.getSocialPlatforms();

      const data = res.data;

      setSocialPlatforms(data);
      // console.log("Social Platforms: ", data);
    } catch (error) {
      console.error("Error fetching Social Platforms: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialPlatforms();
  }, []);

  return { platformsLoading, socialPlatforms };
}
