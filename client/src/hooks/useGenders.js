import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

export default function useGenders() {
  const { loading, callApi } = useApi({ gendersLoading: true });

  const [genders, setGenders] = useState([]);

  useEffect(() => {
    callApi("gendersLoading", filterEndpoints.getGenders, {
      onSuccess: (res) => {
        setGenders(res.data);
      },
    });
  }, [callApi]);

  return {
    gendersLoading: loading.gendersLoading,
    genders,
  };
}
