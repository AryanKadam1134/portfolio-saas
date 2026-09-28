import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

export default function useCertificatesList() {
  const { loading, callApi } = useApi({ certificatesListLoading: true });

  const [certificatesList, setCertificatesList] = useState([]);

  useEffect(() => {
    callApi("certificatesListLoading", filterEndpoints.getCertificatesList, {
      onSuccess: (res) => {
        setCertificatesList(res.data);
      },
    });
  }, [callApi]);

  return {
    certificatesListLoading: loading.certificatesListLoading,
    certificatesList,
  };
}
