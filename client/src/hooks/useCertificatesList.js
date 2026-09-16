import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

export default function useCertificatesList() {
  const [certificatesListLoading, setLoading] = useState(true);
  const [certificatesList, setCertificatesList] = useState([]);

  const fetchCertificatesList = async () => {
    try {
      const res = await filterEndpoints.getCertificatesList();

      const data = res.data;

      setCertificatesList(data);
      // console.log("Ceritficates List: ", data);
    } catch (error) {
      console.error("Error fetching Ceritficates List: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificatesList();
  }, []);

  return { certificatesListLoading, certificatesList };
}
