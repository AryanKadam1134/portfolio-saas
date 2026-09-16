import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

export default function useProjectCategoriesList() {
  const [projectCategoriesLoading, setLoading] = useState(true);
  const [projectCategoriesList, setProjectCategoriesList] = useState([]);

  const fetchProjectCategoriesList = async () => {
    try {
      const res = await filterEndpoints.getProjectCategoriesList();

      const data = res.data;

      setProjectCategoriesList(data);
      // console.log("Project Categories List: ", data);
    } catch (error) {
      console.error("Error fetching Project Categories List: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectCategoriesList();
  }, []);

  return { projectCategoriesLoading, projectCategoriesList };
}
