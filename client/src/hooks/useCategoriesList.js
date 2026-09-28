import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

export default function useCategoriesList() {
  const { loading, callApi } = useApi({ categoriesLoading: true });

  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    callApi("categoriesLoading", filterEndpoints.getSkillCategoriesList, {
      onSuccess: (res) => {
        setCategoriesList(res.data);
      },
    });
  }, [callApi]);

  return { categoriesLoading: loading.categoriesLoading, categoriesList };
}
