import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

export default function useOrganizationsList() {
  const [organiaztionsLoading, setLoading] = useState(true);
  const [organizationsList, setOrganizationsList] = useState([]);

  const fetchOrganizationsList = async () => {
    try {
      const res = await filterEndpoints.getOrganizationsList();

      const data = res.data;

      setOrganizationsList(data);
      // console.log("Organizations List: ", data);
    } catch (error) {
      console.error("Error fetching Organizations List: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationsList();
  }, []);

  return { organiaztionsLoading, organizationsList };
}
