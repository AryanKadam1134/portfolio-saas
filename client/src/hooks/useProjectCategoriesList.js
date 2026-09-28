import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

export default function useProjectCategoriesList() {
  const { loading, callApi } = useApi({ projectCategoriesLoading: true });

  const [projectCategoriesList, setProjectCategoriesList] = useState([]);

  useEffect(() => {
    callApi(
      "projectCategoriesLoading",
      filterEndpoints.getProjectCategoriesList,
      {
        onSuccess: (res) => {
          setProjectCategoriesList(res.data);
        },
      },
    );
  }, [callApi]);

  return {
    projectCategoriesLoading: loading.projectCategoriesLoading,
    projectCategoriesList,
  };
}
