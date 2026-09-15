import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";

import CoverImage from "../../../components/common/CoverImage";
import CommonSkeleton from "../../../components/common/CommonSkeleton";
import DragDropUpload from "../../../components/common/DragDropUpload";

import LabelInput from "../../../components/ui/LabelInput";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomCheckbox from "../../../components/ui/CustomCheckbox";
import CustomTextArea from "../../../components/ui/CustomTextArea";

import { educationEndpoints } from "../../../services/educationService";

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
      notify.msgError(error?.message || "Failed to fetch education");
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
        notify.msgSuccess("Education Updated!");
      } else {
        res = await educationEndpoints.addEducation(payload);
        notify.msgSuccess("Education Saved!");
      }

      const data = res.data;

      setId(data?._id);
      // console.log("Education Saved: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to save education");
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
      notify.msgSuccess("Institute Image Updated!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to update institute image");
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteInstituteImage = async () => {
    setImageDeleting(true);
    try {
      await educationEndpoints.deleteInstituteImage(id);

      fetchEducation();
      notify.msgSuccess("Institute Image Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete institute image");
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
    <form
      onSubmit={handleSubmit(addUpdateEducation)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {id && (
        <>
          {/* Upload Institute Image  */}
          <LabelInput
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
          </LabelInput>

          {/* Institute Image */}
          <LabelInput
            label="Institute Image"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          >
            <CoverImage
              image={instituteImage}
              imageDeleting={imageDeleting}
              deleteImage={deleteInstituteImage}
            />
          </LabelInput>

          <div className="col-span-12 border-b border-dashed border-light-border-primary dark:border-dark-border-primary" />
        </>
      )}

      {/* Institute Name */}
      <LabelInput
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
      </LabelInput>

      {/* Qualification */}
      <LabelInput
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
      </LabelInput>

      {/* Description */}
      <LabelInput
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
      </LabelInput>

      {/* Location */}
      <LabelInput
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
      </LabelInput>

      {/* Start Year */}
      <LabelInput
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
      </LabelInput>

      {/* End Year */}
      <LabelInput
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
      </LabelInput>

      {/* Present */}
      <LabelInput
        id="isCurrent"
        label="Currently studying here"
        colSpan="col-span-12 sm:col-span-6"
        type="checkbox"
        error={errors?.isCurrent?.message}
      >
        <CustomCheckbox id="isCurrent" {...register("isCurrent")} />
      </LabelInput>

      {/* Percentage */}
      <LabelInput
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
      </LabelInput>

      {/* CGPA */}
      <LabelInput
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
      </LabelInput>

      <CustomButton
        type="submit"
        className="col-span-12 place-self-end"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
