import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

export default function useSkillsList() {
  const { loading, callApi } = useApi({ skillsListLoading: true });

  const [skillsList, setSkillsList] = useState([]);

  useEffect(() => {
    callApi("skillsListLoading", filterEndpoints.getSkillsList, {
      onSuccess: (res) => {
        setSkillsList(res.data);
      },
    });
  }, [callApi]);

  return {
    skillsListLoading: loading.skillsListLoading,
    skillsList,
  };
}
