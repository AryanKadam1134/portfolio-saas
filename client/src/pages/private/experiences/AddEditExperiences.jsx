import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useForm, Controller, useWatch, useFieldArray } from "react-hook-form";
import { Trash2, ExternalLink, Plus, Link, Calendar } from "lucide-react";

import PageHeader from "../../../components/common/PageHeader";
import CoverImage from "../../../components/common/CoverImage";
import CommonSkeleton from "../../../components/common/CommonSkeleton";
import DragDropUpload from "../../../components/common/DragDropUpload";

import LabelInput from "../../../components/ui/LabelInput";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import ActionButton from "../../../components/ui/ActionButton";
import CustomSelect from "../../../components/ui/CustomSelect";
import CustomTextArea from "../../../components/ui/CustomTextArea";
import CustomCheckbox from "../../../components/ui/CustomCheckbox";
import CustomDatePicker from "../../../components/ui/CustomDatePicker";
import CustomMultiSelect from "../../../components/ui/CustomMultiSelect";
import CustomRadioButtons from "../../../components/ui/CustomRadioButtons";

import { formatDateInISO } from "../../../utils/formatDate";

import { experienceEndpoints } from "../../../services/experience.service";

import useSkillsList from "../../../hooks/useSkillsList";
import useVisibilities from "../../../hooks/useVisibilities";
import useEmploymentTypes from "../../../hooks/useEmploymentTypes";
import useLocationTypesList from "../../../hooks/useLocationTypesList";

import { useNotify } from "../../../context/notification/useNotify";

export default function AddEditExperiences() {
  const { notify } = useNotify();

  const { skillsList } = useSkillsList();
  const { visibilities } = useVisibilities();
  const { employmentTypes } = useEmploymentTypes();
  const { locationTypesList } = useLocationTypesList();

  const { experienceId } = useParams();

  const [id, setId] = useState(experienceId);

  const [loading, setLoading] = useState(true);

  const [imagesUploading, setImagesUploading] = useState(false);
  const [imageDeleting, setImageDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: {
      sortOrder: 0,
      featured: true,
      visibility: "public",
      positions: [
        {
          role: "",
          startDate: "",
          endDate: "",
          isCurrent: null,
        },
      ],
      highlights: [""],
    },
    mode: "onChange",
  });

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: "highlights",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "positions",
  });
  const organizationImage = useWatch({ control, name: "organizationImage" });
  const organizationWebsite = useWatch({
    control,
    name: "organizationWebsite",
  });

  const handleAppendHighlight = () => {
    appendHighlight("");
  };

  const handleAppendRole = () => {
    append({ role: "", startDate: "", endDate: "", isCurrent: false });
  };

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

  const fetchExperience = async () => {
    try {
      const res = await experienceEndpoints.getExperience(id);

      const data = res.data;

      reset({
        ...data,
        positions: data?.positions?.map((pos) => ({
          ...pos,
          startDate: formatDateInISO(pos?.startDate),
          endDate: formatDateInISO(pos?.endDate),
        })),
        highlights: data?.highlights || [""],
      });
      console.log("Experience: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch experience");
    } finally {
      setLoading(false);
    }
  };

  const addUpdateExperience = async (payload) => {
    console.log("paylaod: ", payload);
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        updatedData.highlights = payload.highlights;

        res = await experienceEndpoints.updateExperience(id, updatedData);
        notify.msgSuccess("Experience Updated!");
      } else {
        res = await experienceEndpoints.addExperience(payload);
        notify.msgSuccess("Experience Saved!");
      }

      const data = res.data;

      setId(data?._id);
      // console.log("Experience Saved: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to save experience");
    }
  };

  // Can uplaod multiple
  const updateOrganizationImage = async (files) => {
    const file = files[0];

    setImagesUploading(true);

    try {
      const formData = new FormData();

      formData.append("organizationImage", file);

      await experienceEndpoints.updateOrganizationImage(id, formData);

      fetchExperience();
      notify.msgSuccess("Organization Image Updated!");
      // console.log("Images uploaded successfully!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to update organization image");
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteOrganizationImage = async () => {
    setImageDeleting(true);
    try {
      await experienceEndpoints.deleteOrganizationImage(id);

      fetchExperience();
      notify.msgSuccess("Organization Image Deleted!");
      // console.log("Image deleted successfully!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete organization image");
    } finally {
      setImageDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchExperience();
  }, [id]);

  if (id && loading) {
    return <CommonSkeleton count={9} />;
  }

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading={id ? "Edit Experience" : "Add Experience"}
        subHeading={
          id
            ? "Update this role in your professional history"
            : "Document a role in your professional history"
        }
      />

      <form
        onSubmit={handleSubmit(addUpdateExperience)}
        className="grid grid-cols-12 gap-6 text-sm"
      >
        {id && (
          <>
            {/* Upload Image  */}
            <LabelInput
              id="upload"
              label="Upload Image"
              colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            >
              <DragDropUpload
                id="upload"
                accept="image/*"
                loading={imagesUploading}
                onChange={(files) => updateOrganizationImage(files)}
              />
            </LabelInput>

            {/* Cover Image */}
            <LabelInput
              label="Cover Image"
              colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            >
              <CoverImage
                image={organizationImage}
                imageDeleting={imageDeleting}
                deleteImage={deleteOrganizationImage}
              />
            </LabelInput>

            <div className="col-span-12 border-b border-dashed border-light-border-primary dark:border-dark-border-primary" />
          </>
        )}

        {/* Organization Name */}
        <LabelInput
          id="organization"
          label="Organization Name"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.organization?.message}
        >
          <CustomInput
            id="organization"
            type="text"
            placeholder="Enter company name"
            {...register("organization", {
              required: "Organization name is required!",
              minLength: {
                value: 2,
                message: "Organization name must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message: "Organization name must not exceed 100 characters",
              },
            })}
          />
        </LabelInput>

        {/* Employment Type */}
        <LabelInput
          id="employmentType"
          label="Employment Type"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.employmentType?.message}
        >
          <Controller
            name="employmentType"
            control={control}
            rules={{ required: "Employment type is required!" }}
            render={({ field }) => (
              <CustomSelect
                id="employmentType"
                placeholder="Select: Full-time, Part-time, Contract, Freelance"
                options={employmentTypes}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </LabelInput>

        {/* Organization Size */}
        <LabelInput
          id="organizationSize"
          label="Organization Size"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.organizationSize?.message}
        >
          <CustomInput
            id="organizationSize"
            type="text"
            placeholder="e.g., 50-100 employees"
            {...register("organizationSize", {
              maxLength: {
                value: 50,
                message: "Organization size must not exceed 50 characters",
              },
            })}
          />
        </LabelInput>

        {/* Website */}
        <LabelInput
          id="organizationWebsite"
          label="Company Website"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.organizationWebsite?.message}
          attachment={
            organizationWebsite && (
              <a
                href={organizationWebsite}
                target="_blank"
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
              >
                <ExternalLink size={13} /> <p>Visit Link</p>
              </a>
            )
          }
        >
          <CustomInput
            id="organizationWebsite"
            type="text"
            icon={Link}
            placeholder="https://example.com"
            {...register("organizationWebsite", {
              pattern: {
                value: /^(https:\/\/.+)?$/,
                message: "URL must start with https://",
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
            placeholder="Describe your role, responsibilities, and key achievements..."
            {...register("description", {
              maxLength: {
                value: 1000,
                message: "Description must not exceed 1000 characters",
              },
            })}
          />
        </LabelInput>

        {/* Tech Stack */}
        <LabelInput
          id="techStack"
          label="Tech Stack"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.techStack?.message}
        >
          <Controller
            name="techStack"
            control={control}
            render={({ field }) => (
              <CustomMultiSelect
                id="techStack"
                placeholder="Select technologies used"
                options={skillsList}
                value={field.value}
                onChange={field.onChange}
              />
            )}
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

        {/* Location Type */}
        <LabelInput
          id="locationType"
          label="Location Type"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.locationType?.message}
        >
          <Controller
            name="locationType"
            control={control}
            rules={{ required: "Location Type is required!" }}
            render={({ field }) => (
              <CustomSelect
                id="locationType"
                placeholder="e.g. On Site, Remote"
                options={locationTypesList}
                value={field.value}
                onChange={field.onChange} // send value to hook form
              />
            )}
          />
        </LabelInput>

        {/* Visibility  */}
        <LabelInput
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
        </LabelInput>

        {/* Highlights */}
        <div className="col-span-12 flex flex-col gap-4 p-4 w-full bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border-primary dark:border-dark-border-primary divide-y divide-light-border-primary dark:divide-dark-border-primary rounded-md shadow-sm">
          <div className="pb-4 flex items-center justify-between gap-3">
            <p className="font-medium text-[16px] text-light-text-primary dark:text-dark-text-primary">
              Highlights{" "}
              <span className="font-normal text-light-text-secondary dark:text-dark-text-secondary">
                (your highlights inside the company)
              </span>
            </p>

            <CustomButton
              type="button"
              variant="green"
              onClick={handleAppendHighlight}
              className="hidden sm:block"
            >
              Add Highlight
            </CustomButton>

            <ActionButton
              type="button"
              variant="green"
              icon={Plus}
              onClick={handleAppendHighlight}
              className="block sm:hidden"
            />
          </div>

          {highlightFields.map((item, idx) => (
            <div
              key={item.id}
              className="pb-4 flex items-center justify-between gap-6"
            >
              <div className="w-full">
                <LabelInput
                  id={`highlights-${idx}`}
                  label={`Highlight ${idx + 1}`}
                  error={errors?.highlights?.[idx]?.message}
                >
                  <CustomInput
                    placeholder={`Highlight ${idx + 1}`}
                    {...register(`highlights.${idx}`, {
                      required: "Highlight is required",
                    })}
                  />
                </LabelInput>
              </div>

              <ActionButton
                type="button"
                variant="red"
                icon={Trash2}
                onClick={() => removeHighlight(idx)}
              />
            </div>
          ))}
        </div>

        {/* Positions */}
        <div className="col-span-12 flex flex-col gap-4 p-4 w-full bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border-primary dark:border-dark-border-primary divide-y divide-light-border-primary dark:divide-dark-border-primary rounded-md shadow-sm">
          <div className="pb-4 flex items-center justify-between gap-3">
            <p className="font-medium text-[16px] text-light-text-primary dark:text-dark-text-primary">
              Positions / Posts
            </p>

            <CustomButton
              type="button"
              variant="green"
              onClick={handleAppendRole}
              className="hidden sm:block"
            >
              Add Position
            </CustomButton>

            <ActionButton
              type="button"
              variant="green"
              icon={Plus}
              onClick={handleAppendRole}
              className="block sm:hidden"
            />
          </div>

          {fields?.map((data, idx) => (
            <div
              key={data?.role || idx}
              className="pb-4 grid grid-cols-12 gap-6"
            >
              {/* Role */}
              <LabelInput
                id={`positions-${idx}.role`}
                label="Role"
                colSpan="col-span-12 sm:col-span-6"
                required
                error={errors?.positions?.[idx]?.role?.message}
              >
                <CustomInput
                  id={`positions-${idx}.role`}
                  placeholder="Job Role"
                  {...register(`positions.${idx}.role`, {
                    required: "Role is required!",
                  })}
                />
              </LabelInput>

              {/* Start Date */}
              <LabelInput
                id={`positions-${idx}.startDate`}
                label="Start Date"
                colSpan="col-span-12 sm:col-span-6"
                required
                error={errors?.positions?.[idx]?.startDate?.message}
              >
                <CustomDatePicker
                  id={`positions-${idx}.startDate`}
                  icon={Calendar}
                  placeholder="Select Date"
                  {...register(`positions.${idx}.startDate`, {
                    required: "Start Date is required!",
                  })}
                />
              </LabelInput>

              {/* End Date */}
              <LabelInput
                id={`positions-${idx}.endDate`}
                icon={Calendar}
                label="End Date"
                colSpan="col-span-12 sm:col-span-6"
                error={errors?.positions?.[idx]?.endDate?.message}
              >
                <CustomDatePicker
                  id={`positions-${idx}.endDate`}
                  placeholder="Select Date"
                  {...register(`positions.${idx}.endDate`)}
                />
              </LabelInput>

              {/* Present */}
              <LabelInput
                id={`positions-${idx}.isCurrent`}
                label="Currently working on this position"
                colSpan="col-span-9 sm:col-span-4 lg:col-span-5"
                type="checkbox"
                error={errors?.positions?.[idx]?.isCurrent?.message}
              >
                <CustomCheckbox
                  id={`positions-${idx}.isCurrent`}
                  {...register(`positions.${idx}.isCurrent`)}
                />
              </LabelInput>

              <ActionButton
                type="button"
                variant="red"
                icon={Trash2}
                onClick={() => remove(idx)}
                className="w-fit h-fit self-center col-span-3 sm:col-span-2 lg:col-span-1"
              />
            </div>
          ))}
        </div>

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
