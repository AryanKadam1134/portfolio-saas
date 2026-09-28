import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

export default function useLocationTypesList() {
  const { loading, callApi } = useApi({ locationTypesLoading: true });

  const [locationTypesList, setLocationTypes] = useState([]);

  useEffect(() => {
    callApi("locationTypesLoading", filterEndpoints.getLocationTypes, {
      onSuccess: (res) => {
        setLocationTypes(res.data);
      },
    });
  }, [callApi]);

  return {
    locationTypesLoading: loading.locationTypesLoading,
    locationTypesList,
  };
}
