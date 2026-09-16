import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

export default function useVisibilities() {
  const [visibilitiesLoading, setLoading] = useState(true);
  const [visibilities, setVisibilities] = useState([]);

  const fetchVisibiities = async () => {
    try {
      const res = await filterEndpoints.getVisibilities();

      const data = res.data;

      setVisibilities(data);
      // console.log("Visibilities: ", data);
    } catch (error) {
      console.error("Error fetching Visibilities: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisibiities();
  }, []);

  return { visibilitiesLoading, visibilities };
}
