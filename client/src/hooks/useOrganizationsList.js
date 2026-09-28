import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

export default function useOrganizationsList() {
  const { loading, callApi } = useApi({ organiaztionsLoading: true });

  const [organizationsList, setOrganizationsList] = useState([]);

  useEffect(() => {
    callApi("organiaztionsLoading", filterEndpoints.getOrganizationsList, {
      onSuccess: (res) => {
        setOrganizationsList(res.data);
      },
    });
  }, [callApi]);

  return {
    organiaztionsLoading: loading.organiaztionsLoading,
    organizationsList,
  };
}
