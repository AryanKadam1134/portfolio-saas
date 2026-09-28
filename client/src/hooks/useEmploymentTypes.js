import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

export default function useEmploymentTypes() {
  const { loading, callApi } = useApi({ employemntTypesLoading: true });

  const [employmentTypes, setEmploymentTypes] = useState([]);

  useEffect(() => {
    callApi("employemntTypesLoading", filterEndpoints.getEmploymentTypes, {
      onSuccess: (res) => {
        setEmploymentTypes(res.data);
      },
    });
  }, [callApi]);

  return {
    employemntTypesLoading: loading.employemntTypesLoading,
    employmentTypes,
  };
}
