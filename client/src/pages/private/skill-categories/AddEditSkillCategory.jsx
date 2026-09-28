import React, { useState, useEffect, useCallback } from "react";

import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import PageHeader from "../../../components/common/PageHeader";
import CommonSkeleton from "../../../components/common/CommonSkeleton";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomRadioButtons from "../../../components/ui/CustomRadioButtons";

import { skillCategoryEndpoints } from "../../../services/skillCategory.service";

import useApi from "../../../hooks/useApi";
import useVisibilities from "../../../hooks/useVisibilities";

import { useNotify } from "../../../context/notification/useNotify";

export default function AddEditSkillCategory() {
  const { notify } = useNotify();

  const { visibilities } = useVisibilities();
  const { loading, callApi } = useApi({ categoryLoading: true });

  const { categoryId } = useParams();

  const [id, setId] = useState(categoryId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
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

  const fetchSkillCategory = useCallback(() => {
    callApi(
      "categoryLoading",
      () => skillCategoryEndpoints.getSkillCategory(id),
      {
        loading: false,
        onSuccess: (res) => {
          reset(res?.data);
        },
        onError: (error) => {
          notify.error({
            title: error?.message || "Failed to load category details",
          });
        },
      },
    );
  }, [callApi, notify, id, reset]);

  const addUpdateSkillCategory = (payload) => {
    const isEditing = Boolean(id);
    const updatedData = getUpdatedFields(payload, dirtyFields);

    callApi(
      "updating",
      () =>
        isEditing
          ? skillCategoryEndpoints.updateSkillCategory(id, updatedData)
          : skillCategoryEndpoints.addSkillCategory(payload),
      {
        onSuccess: (res) => {
          setId(res.data?._id);
          fetchSkillCategory();
          notify.success({
            title:
              res?.message ||
              (isEditing ? "Category Updated!" : "Category Added!"),
          });
        },
        onError: (error) => {
          notify.error({
            title: error?.message || "Failed to save category",
          });
        },
      },
    );
  };

  useEffect(() => {
    if (!id) return;
    fetchSkillCategory();
  }, [fetchSkillCategory, id]);

  if (id && loading.categoryLoading) {
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
          name={loading.updating ? "Saving..." : "Save"}
          className="col-span-12 place-self-end"
          loading={loading.updating}
        />
      </form>
    </div>
  );
}
