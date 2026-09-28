import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

export default function useSkillLevels() {
  const { loading, callApi } = useApi({ skillLevelsLoading: true });

  const [skillLevels, setSkillLevels] = useState([]);

  useEffect(() => {
    callApi("skillLevelsLoading", filterEndpoints.getSkillLevels, {
      onSuccess: (res) => {
        setSkillLevels(res.data);
      },
    });
  }, [callApi]);

  return {
    skillLevelsLoading: loading.skillLevelsLoading,
    skillLevels,
  };
}
