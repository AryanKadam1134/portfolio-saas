import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

import PageHeader from "../../../components/common/PageHeader";
import CommonSkeleton from "../../../components/common/CommonSkeleton";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomSelect from "../../../components/ui/CustomSelect";
import CustomRadioButtons from "../../../components/ui/CustomRadioButtons";

import { skillEndpoints } from "../../../services/skill.service";

import useSkillLevels from "../../../hooks/useSkillLevels";
import useVisibilities from "../../../hooks/useVisibilities";
import useCategoriesList from "../../../hooks/useCategoriesList";

import { useNotify } from "../../../context/notification/useNotify";

const TECH_SKILLS = [
  { title: "HTML5", category: "Frontend" },
  { title: "CSS3", category: "Frontend" },
  { title: "JavaScript (ES6+)", category: "Frontend" },
  { title: "TypeScript", category: "Frontend" },
  { title: "React", category: "Frontend" },
  { title: "Vue.js", category: "Frontend" },
  { title: "Angular", category: "Frontend" },
  { title: "Svelte", category: "Frontend" },
  { title: "Next.js", category: "Frontend" },
  { title: "Tailwind CSS", category: "Frontend" },
  { title: "Sass/SCSS", category: "Frontend" },
  { title: "Redux / Context API", category: "State Management" },
  { title: "Node.js", category: "Backend" },
  { title: "Express.js", category: "Backend" },
  { title: "Python", category: "Backend" },
  { title: "Django", category: "Backend" },
  { title: "Ruby on Rails", category: "Backend" },
  { title: "PHP", category: "Backend" },
  { title: "Go (Golang)", category: "Backend" },
  { title: "GraphQL", category: "API" },
  { title: "REST API", category: "API" },
  { title: "PostgreSQL", category: "Database" },
  { title: "MongoDB", category: "Database" },
  { title: "MySQL", category: "Database" },
  { title: "Redis", category: "Database" },
  { title: "Git / GitHub", category: "Tools" },
  { title: "Docker", category: "DevOps" },
  { title: "Kubernetes", category: "DevOps" },
  { title: "AWS / Azure / GCP", category: "Cloud" },
  { title: "Vercel / Netlify", category: "Deployment" },
  { title: "CI/CD Pipelines", category: "DevOps" },
  { title: "Unit Testing (Jest/Cypress)", category: "Testing" },
  { title: "Web Performance Optimization", category: "Optimization" },
  { title: "SEO Fundamentals", category: "Marketing" },
  { title: "Web Accessibility (A11y)", category: "Frontend" },
];

const SKILLS = TECH_SKILLS.map((app) => ({
  value: app.title,
  label: app.title,
}));

export default function AddEditSkills() {
  const { notify } = useNotify();

  const { skillLevels } = useSkillLevels();
  const { visibilities } = useVisibilities();
  const { categoriesList } = useCategoriesList();

  const { skillId } = useParams();

  const [id, setId] = useState(skillId);

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: {
      visibility: "public",
    },
    mode: "onChange",
  });

  const getUpdatedFields = (data, dirtyFields) => {
    const updated = {};

    for (const key in dirtyFields) {
      if (
        typeof dirtyFields[key] === "object" &&
        !Array.isArray(dirtyFields[key])
      ) {
        updated[key] = getUpdatedFields(data[key], dirtyFields[key]);
      } else {
        updated[key] = data[key];
      }
    }

    return updated;
  };

  const fetchSkill = async () => {
    try {
      const res = await skillEndpoints.getSkill(id);

      const data = res.data;

      reset(data);
      console.log("Skill: ", data);
    } catch (error) {
      console.error("Error fetching Skill: ", error);
      notify.error({ title: error?.message || "Failed to load skill details" });
    } finally {
      setLoading(false);
    }
  };

  const addUpdateSkill = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        res = await skillEndpoints.updateSkill(id, updatedData);
        notify.success({ title: "Skill Updated!" });
      } else {
        res = await skillEndpoints.addSkill(payload);
        notify.success({ title: "Skill Saved!" });
      }

      const data = res.data;

      setId(data?._id);
      // console.log("Skill Saved: ", data);
    } catch (error) {
      console.error("Error saving Skill: ", error);
      notify.error({ title: error?.message || "Failed to save skill" });
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchSkill();
  }, [id]);

  if (id && loading) {
    return <CommonSkeleton count={6} />;
  }

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading={id ? "Edit Skill" : "Add Skill"}
        subHeading={
          id
            ? "Update this skill in your portfolio"
            : "Add a skill to your portfolio"
        }
      />

      <form
        onSubmit={handleSubmit(addUpdateSkill)}
        className="grid grid-cols-12 gap-6 text-sm"
      >
        {!id && (
          <>
            <FormField
              id="popular"
              label="Popular Skills"
              colSpan="col-span-12 sm:col-span-6"
            >
              <CustomSelect
                id="popular"
                placeholder="Select Skill"
                options={SKILLS}
                value={null}
                onChange={(value) => reset({ name: value })}
              />
            </FormField>

            <div className="hidden sm:block col-span-6" />

            <div className="col-span-12 border-b border-dashed border-light-border-primary dark:border-dark-border-primary" />
          </>
        )}

        {/* Skill Name */}
        <FormField
          id="name"
          label="Skill Name"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.name?.message}
        >
          <CustomInput
            id="name"
            type="text"
            placeholder="e.g., React, Python, UI Design"
            {...register("name", {
              required: "Skill name is required!",
              minLength: {
                value: 2,
                message: "Skill name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Skill name must not exceed 50 characters",
              },
            })}
          />
        </FormField>

        {/* Skill Category */}
        <FormField
          id="categoryId"
          label="Skill Category"
          colSpan="col-span-12 sm:col-span-6"
          className="w-full"
          error={errors?.categoryId?.message}
        >
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                id="categoryId"
                placeholder="Select Category"
                options={categoriesList}
                value={field.value}
                onChange={field.onChange} // send value to hook form
              />
            )}
          />
        </FormField>

        {/* Skill Logo URL */}
        <FormField
          id="logoUrl"
          label="Logo URL"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.logoUrl?.message}
        >
          <CustomInput
            id="logoUrl"
            type="text"
            placeholder="/images/react_light.svg"
            {...register("logoUrl")}
          />
        </FormField>

        {/* Skill Level */}
        <FormField
          id="level"
          label="Level"
          colSpan="col-span-12 sm:col-span-6"
          className="w-full"
          required
          error={errors?.level?.message}
        >
          <Controller
            name="level"
            control={control}
            rules={{ required: "Skill Level is required!" }}
            render={({ field }) => (
              <CustomSelect
                id="level"
                placeholder="Select"
                options={skillLevels}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>

        {/* Sort Order */}
        <FormField
          id="sortOrder"
          label="Display Order"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.sortOrder?.message}
        >
          <CustomInput
            id="sortOrder"
            type="number"
            min={0}
            placeholder="0 (appears first)"
            {...register("sortOrder", { valueAsNumber: true })}
          />
        </FormField>

        {/* Visibility  */}
        <FormField
          id="visibility"
          label="Visibility"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.visibility?.message}
        >
          <CustomRadioButtons
            id="visibility"
            name="visibility"
            options={visibilities}
            {...register("visibility", {
              required: "Visibility is required!",
            })}
          />
        </FormField>

        <CustomButton
          type="submit"
          className="col-span-12 place-self-end"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </CustomButton>
      </form>
    </div>
  );
}
