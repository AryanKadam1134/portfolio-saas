import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

export default function useCategoriesList() {
  const [categoriesLoading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState([]);

  const fetchSkillCategories = async () => {
    try {
      const res = await filterEndpoints.getSkillCategoriesList();

      const data = res.data;

      setCategoriesList(data);
      // console.log("Skill Categories Filter: ", data);
    } catch (error) {
      console.error("Error fetching Skill Categories: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillCategories();
  }, []);

  return { categoriesLoading, categoriesList };
}
