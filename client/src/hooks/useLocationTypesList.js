import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

export default function useLocationTypesList() {
  const [ocationTypesLoading, setLoading] = useState(true);
  const [locationTypesList, setLocationTypes] = useState([]);

  const fetchLocationTypes = async () => {
    try {
      const res = await filterEndpoints.getLocationTypes();

      const data = res.data;

      setLocationTypes(data);
      // console.log("Location Types: ", data);
    } catch (error) {
      console.error("Error fetching Location Types: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationTypes();
  }, []);

  return { ocationTypesLoading, locationTypesList };
}
