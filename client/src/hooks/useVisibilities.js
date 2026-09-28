import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

export default function useVisibilities() {
  const { loading, callApi } = useApi({ visibilitiesLoading: true });

  const [visibilities, setVisibilities] = useState([]);

  useEffect(() => {
    callApi("visibilitiesLoading", filterEndpoints.getVisibilities, {
      onSuccess: (res) => {
        setVisibilities(res.data);
      },
    });
  }, [callApi]);

  return {
    visibilitiesLoading: loading.visibilitiesLoading,
    visibilities,
  };
}
