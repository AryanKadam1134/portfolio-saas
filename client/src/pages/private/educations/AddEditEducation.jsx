import React, { useState, useEffect, useCallback } from "react";

import { useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";

import PageHeader from "../../../components/common/PageHeader";
import CoverImage from "../../../components/common/CoverImage";
import CommonSkeleton from "../../../components/common/CommonSkeleton";
import DragDropUpload from "../../../components/common/DragDropUpload";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomCheckbox from "../../../components/ui/CustomCheckbox";
import CustomTextArea from "../../../components/ui/CustomTextArea";

import { getUpdatedFields } from "../../../utils/getUpdatedFields";

import { educationEndpoints } from "../../../services/education.service";

import useApi from "../../../hooks/useApi";

import { useNotify } from "../../../context/notification/useNotify";

export default function AddEditEducation() {
  const { notify } = useNotify();

  const { loading, callApi } = useApi({ educationLoading: true });

  const { educationId } = useParams();

  const [id, setId] = useState(educationId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, dirtyFields },
    watch,
  } = useForm({ mode: "onChange" });

  const instituteImage = useWatch({ control, name: "instituteImage" });
  const startYear = watch("startYear");

  const fetchEducation = useCallback(() => {
    callApi("educationLoading", () => educationEndpoints.getEducation(id), {
      loading: false,
      onSuccess: (res) => {
        reset(res?.data);
      },
      onError: (error) => {
        notify.error({
          title: error?.message || "Failed to load education!",
        });
      },
    });
  }, [callApi, notify, id, reset]);

  const addUpdateEducation = (payload) => {
    const isEditing = Boolean(id);
    const updatedData = getUpdatedFields(payload, dirtyFields);

    callApi(
      "updatingEducation",
      () =>
        isEditing
          ? educationEndpoints.updateEducation(id, updatedData)
          : educationEndpoints.addEducation(payload),
      {
        onSuccess: (res) => {
          setId(res.data?._id);
          fetchEducation();
          notify.success({
            title:
              res?.message ||
              (isEditing ? "Education updated!" : "Education added!"),
          });
        },
        onError: (error) => {
          notify.error({
            title: error?.message || "Failed to save education!",
          });
        },
      },
    );
  };

  const updateInstituteImage = (files) => {
    const file = files[0];
    const formData = new FormData();
    formData.append("instituteImage", file);

    callApi(
      "uploadingImage",
      () => educationEndpoints.updateInstituteImage(id, formData),
      {
        onSuccess: (res) => {
          fetchEducation();
          notify.success({
            title: res?.message || "Institute images updated!",
          });
        },
        onError: (error) => {
          notify.error({
            title: error?.message || "Failed to upload institute images!",
          });
        },
      },
    );
  };

  const deleteInstituteImage = () => {
    callApi(
      "imageDeleting",
      () => educationEndpoints.deleteInstituteImage(id),
      {
        onSuccess: (res) => {
          fetchEducation();
          notify.success({
            title: res?.message || "Institute image deleted!",
          });
        },
        onError: (error) => {
          notify.error({
            title: error?.message || "Failed to delete institute image!",
          });
        },
      },
    );
  };

  useEffect(() => {
    if (!id) return;
    fetchEducation();
  }, [fetchEducation, id]);

  if (id && loading.educationLoading) {
    return <CommonSkeleton count={9} />;
  }

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading={id ? "Edit Education" : "Add Education"}
        subHeading={
          id
            ? "Update this academic entry"
            : "Add an academic entry to your portfolio"
        }
      />

      <form
        onSubmit={handleSubmit(addUpdateEducation)}
        className="grid grid-cols-12 gap-6 text-sm"
      >
        {id && (
          <>
            {/* Upload Institute Image  */}
            <FormField
              id="upload"
              label="Upload Institute Image"
              colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            >
              <DragDropUpload
                id="upload"
                accept="image/*"
                loading={loading.uploadingImage}
                onChange={(files) => updateInstituteImage(files)}
              />
            </FormField>

            {/* Institute Image */}
            <FormField
              label="Institute Image"
              colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            >
              <CoverImage
                image={instituteImage}
                imageDeleting={loading.imageDeleting}
                deleteImage={deleteInstituteImage}
              />
            </FormField>

            <div className="col-span-12 border-b border-dashed border-light-border-primary dark:border-dark-border-primary" />
          </>
        )}

        {/* Institute Name */}
        <FormField
          id="instituteName"
          label="Institute Name"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.instituteName?.message}
        >
          <CustomInput
            id="instituteName"
            type="text"
            placeholder="Enter institute name"
            {...register("instituteName", {
              required: "Institute name is required!",
              minLength: {
                value: 2,
                message: "Institute name must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message: "Institute name must not exceed 100 characters",
              },
            })}
          />
        </FormField>

        {/* Qualification */}
        <FormField
          id="qualification"
          label="Degree / Field of Study"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.qualification?.message}
        >
          <CustomInput
            id="qualification"
            type="text"
            placeholder="e.g., Bachelor of Science in Computer Science"
            {...register("qualification", {
              required: "Degree is required!",
              minLength: {
                value: 2,
                message: "Degree must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message: "Degree must not exceed 100 characters",
              },
            })}
          />
        </FormField>

        {/* Description */}
        <FormField
          id="description"
          label="Description"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.description?.message}
        >
          <CustomTextArea
            id="description"
            rows={6}
            placeholder="Describe your education, coursework, achievements..."
            {...register("description", {
              maxLength: {
                value: 1000,
                message: "Description must not exceed 1000 characters",
              },
            })}
          />
        </FormField>

        {/* Location */}
        <FormField
          id="location"
          label="Location"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.location?.message}
        >
          <CustomInput
            id="location"
            type="text"
            placeholder="e.g., San Francisco, CA"
            {...register("location", {
              maxLength: {
                value: 100,
                message: "Location must not exceed 100 characters",
              },
            })}
          />
        </FormField>

        {/* Start Year */}
        <FormField
          id="startYear"
          label="Start Year"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.startYear?.message}
        >
          <CustomInput
            id="startYear"
            type="number"
            placeholder="e.g., 2018"
            {...register("startYear", {
              required: "Start year is required!",
              min: {
                value: 1900,
                message: "Start year must be 1900 or later",
              },
              max: {
                value: new Date().getFullYear(),
                message: `Start year cannot be in the future`,
              },
            })}
          />
        </FormField>

        {/* End Year */}
        <FormField
          id="endYear"
          label="End Year"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.endYear?.message}
        >
          <CustomInput
            id="endYear"
            type="number"
            placeholder="e.g., 2022 (leave blank if current)"
            {...register("endYear", {
              min: {
                value: 1900,
                message: "End year must be 1900 or later",
              },
              max: {
                value: new Date().getFullYear() + 10,
                message: "End year cannot be more than 10 years in the future",
              },
              validate: (value) => {
                if (value && startYear && Number(value) < Number(startYear)) {
                  return "End year cannot be before start year";
                }
                return true;
              },
            })}
          />
        </FormField>

        {/* Present */}
        <FormField
          id="isCurrent"
          label="Currently studying here"
          colSpan="col-span-12 sm:col-span-6"
          type="checkbox"
          error={errors?.isCurrent?.message}
        >
          <CustomCheckbox id="isCurrent" {...register("isCurrent")} />
        </FormField>

        {/* Percentage */}
        <FormField
          id="percentage"
          label="Percentage / Grade"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.percentage?.message}
        >
          <CustomInput
            id="percentage"
            type="number"
            step="0.01"
            min={0}
            max={100}
            placeholder="e.g., 85.5"
            {...register("percentage", {
              min: {
                value: 0,
                message: "Percentage cannot be less than 0",
              },
              max: {
                value: 100,
                message: "Percentage cannot be more than 100",
              },
            })}
          />
        </FormField>

        {/* CGPA */}
        <FormField
          id="cgpa"
          label="CGPA"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.cgpa?.message}
        >
          <CustomInput
            id="cgpa"
            type="number"
            step="0.01"
            min={0}
            max={10}
            placeholder="e.g., 8.5"
            {...register("cgpa", {
              min: {
                value: 0,
                message: "CGPA cannot be less than 0",
              },
              max: {
                value: 10,
                message: "CGPA cannot be more than 10",
              },
            })}
          />
        </FormField>

        <CustomButton
          type="submit"
          name={loading.updatingEducation ? "Saving..." : "Save"}
          className="col-span-12 place-self-end"
          loading={loading.updatingEducation}
        />
      </form>
    </div>
  );
}
