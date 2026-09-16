import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

export default function useGenders() {
  const [gendersLoading, setLoading] = useState(true);
  const [genders, setGenders] = useState([]);

  const fetchGenders = async () => {
    try {
      const res = await filterEndpoints.getGenders();

      const data = res.data;

      setGenders(data);
      // console.log("All Genders: ", data);
    } catch (error) {
      console.error("Error fetching Genders: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenders();
  }, []);

  return { gendersLoading, genders };
}
