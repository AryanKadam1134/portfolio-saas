import React, { useState, useEffect } from "react";

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

import { educationEndpoints } from "../../../services/education.service";

import { useNotify } from "../../../context/notification/useNotify";

export default function AddEditEducation() {
  const { notify } = useNotify();

  const { educationId } = useParams();

  const [id, setId] = useState(educationId);

  const [loading, setLoading] = useState(true);

  const [imagesUploading, setImagesUploading] = useState(false);
  const [imageDeleting, setImageDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
    watch,
  } = useForm({ mode: "onChange" });

  const instituteImage = useWatch({ control, name: "instituteImage" });
  const startYear = watch("startYear");

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

  const fetchEducation = async () => {
    try {
      const res = await educationEndpoints.getEducation(id);

      const data = res.data;

      reset(data);
      console.log("Education: ", data);
    } catch (error) {
      notify.error({ title: error?.message || "Failed to fetch education" });
    } finally {
      setLoading(false);
    }
  };

  const addUpdateEducation = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);

        res = await educationEndpoints.updateEducation(id, updatedData);
        notify.success({ title: "Education Updated!" });
      } else {
        res = await educationEndpoints.addEducation(payload);
        notify.success({ title: "Education Saved!" });
      }

      const data = res.data;

      setId(data?._id);
      // console.log("Education Saved: ", data);
    } catch (error) {
      notify.error({ title: error?.message || "Failed to save education" });
    }
  };

  // Can uplaod multiple
  const updateInstituteImage = async (files) => {
    const file = files[0];

    setImagesUploading(true);

    try {
      const formData = new FormData();

      formData.append("instituteImage", file);

      await educationEndpoints.updateInstituteImage(id, formData);

      fetchEducation();
      notify.success({ title: "Institute Image Updated!" });
    } catch (error) {
      notify.error({ title: error?.message || "Failed to update institute image" });
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteInstituteImage = async () => {
    setImageDeleting(true);
    try {
      await educationEndpoints.deleteInstituteImage(id);

      fetchEducation();
      notify.success({ title: "Institute Image Deleted!" });
    } catch (error) {
      notify.error({ title: error?.message || "Failed to delete institute image" });
    } finally {
      setImageDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchEducation();
  }, [id]);

  if (id && loading) {
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
                loading={imagesUploading}
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
                imageDeleting={imageDeleting}
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
          className="col-span-12 place-self-end"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </CustomButton>
      </form>
    </div>
  );
}
