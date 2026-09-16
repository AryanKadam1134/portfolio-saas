import React, { useState, useEffect } from "react";

import { filterEndpoints } from "../services/filter.service";

export default function useSkillsList() {
  const [skillsListLoading, setLoading] = useState(true);
  const [skillsList, setSkillsList] = useState([]);

  const fetchSkillsList = async () => {
    try {
      const res = await filterEndpoints.getSkillsList();

      const data = res.data;

      setSkillsList(data);
      // console.log("Skills List: ", data);
    } catch (error) {
      console.error("Error fetching Skills List: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsList();
  }, []);

  return { skillsListLoading, skillsList };
}
