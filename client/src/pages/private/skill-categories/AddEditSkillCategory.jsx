import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import PageHeader from "../../../components/common/PageHeader";
import CommonSkeleton from "../../../components/common/CommonSkeleton";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomRadioButtons from "../../../components/ui/CustomRadioButtons";

import { skillCategoryEndpoints } from "../../../services/skillCategory.service";

import useVisibilities from "../../../hooks/useVisibilities";

import { useNotify } from "../../../context/notification/useNotify";

export default function AddEditSkillCategory() {
  const { notify } = useNotify();

  const { visibilities } = useVisibilities();

  const { categoryId } = useParams();

  const [id, setId] = useState(categoryId);

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
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

  const fetchSkillCategory = async () => {
    try {
      const res = await skillCategoryEndpoints.getSkillCategory(id);

      const data = res.data;

      reset(data);
      console.log("Skill Category: ", data);
    } catch (error) {
      notify.error({ title: error?.message || "Failed to fetch skill category" });
    } finally {
      setLoading(false);
    }
  };

  const addUpdateSkillCategory = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        res = await skillCategoryEndpoints.updateSkillCategory(id, updatedData);
        notify.success({ title: "Category Updated!" });
      } else {
        res = await skillCategoryEndpoints.addSkillCategory(payload);
        notify.success({ title: "Category Saved!" });
      }

      const data = res.data;

      setId(data?._id);
      // console.log("Skill Category Saved: ", data);
    } catch (error) {
      notify.error({ title: error?.message || "Failed to save skill category" });
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchSkillCategory();
  }, [id]);

  if (id && loading) {
    return <CommonSkeleton count={4} />;
  }

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading={id ? "Edit Skill Category" : "Add Skill Category"}
        subHeading={
          id
            ? "Update this skill category"
            : "Create a category for your skills"
        }
      />

      <form
        onSubmit={handleSubmit(addUpdateSkillCategory)}
        className="grid grid-cols-12 gap-6 text-sm"
      >
        {/* Category Name */}
        <FormField
          id="name"
          label="Category Name"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.name?.message}
        >
          <CustomInput
            id="name"
            type="text"
            placeholder="e.g., Frontend, Backend, DevOps"
            {...register("name", {
              required: "Category name is required!",
              minLength: {
                value: 2,
                message: "Category name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Category name must not exceed 50 characters",
              },
            })}
          />
        </FormField>

        {/* Category Logo URL */}
        <FormField
          id="logoUrl"
          label="Logo URL"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.logoUrl?.message}
        >
          <CustomInput
            id="logoUrl"
            type="text"
            placeholder="e.g. /images/frontend.svg"
            {...register("logoUrl")}
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
