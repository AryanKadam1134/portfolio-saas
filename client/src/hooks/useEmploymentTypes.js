import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

export default function useEmploymentTypes() {
  const [employemntTypesLoading, setLoading] = useState(true);
  const [employmentTypes, setEmploymentTypes] = useState([]);

  const fetchEmploymentTypes = async () => {
    try {
      const res = await filterEndpoints.getEmploymentTypes();

      const data = res.data;

      setEmploymentTypes(data);
      // console.log("Employment Types: ", data);
    } catch (error) {
      console.error("Error fetching Employment Types: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmploymentTypes();
  }, []);

  return { employemntTypesLoading, employmentTypes };
}
