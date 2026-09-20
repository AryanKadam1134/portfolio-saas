import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import { ExternalLink, Link, Calendar } from "lucide-react";

import PageHeader from "../../../components/common/PageHeader";
import ImageGallery from "../../../components/common/ImageGallery";
import CommonSkeleton from "../../../components/common/CommonSkeleton";
import DragDropUpload from "../../../components/common/DragDropUpload";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomSelect from "../../../components/ui/CustomSelect";
import CustomCheckbox from "../../../components/ui/CustomCheckbox";
import CustomTextArea from "../../../components/ui/CustomTextArea";
import CustomDatePicker from "../../../components/ui/CustomDatePicker";
import CustomRadioButtons from "../../../components/ui/CustomRadioButtons";

import { formatDateInISO } from "../../../utils/formatDate";

import { achievementEndpoints } from "../../../services/achievement.service";

import useVisibilities from "../../../hooks/useVisibilities";
import useCertificatesList from "../../../hooks/useCertificatesList";

import { useNotify } from "../../../context/notification/useNotify";

export default function AddEditAchievement() {
  const { notify } = useNotify();

  const { visibilities } = useVisibilities();
  const { certificatesList } = useCertificatesList();

  const { achievementId } = useParams();

  const [id, setId] = useState(achievementId);

  const [loading, setLoading] = useState(true);

  const [imagesUploading, setImagesUploading] = useState(false);
  const [imageDeleting, setImageDeleting] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
    setValue,
  } = useForm({
    defaultValues: {
      sortOrder: 0,
      featured: true,
      visibility: "public",
    },
    mode: "onChange",
  });

  const achievementImages = useWatch({ control, name: "achievementImages" });
  const coverImageIndex = useWatch({ control, name: "coverImageIndex" });
  const link = useWatch({ control, name: "link" });

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

  const fetchAchievement = async () => {
    try {
      const res = await achievementEndpoints.getAchievement(id);

      const data = res.data;

      reset({
        ...data,
        date: formatDateInISO(data?.date),
      });
      console.log("Achievement: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch achievement");
    } finally {
      setLoading(false);
    }
  };

  const addUpdateAchievement = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        res = await achievementEndpoints.updateAchievement(id, updatedData);
        notify.msgSuccess("Achievement Updated!");
      } else {
        res = await achievementEndpoints.addAchievement(payload);
        notify.msgSuccess("Achievement Saved!");
      }

      const data = res.data;

      setId(data?._id);
      // console.log("Achievement Saved: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to save achievement");
    }
  };

  const handleCoverChange = async (idx) => {
    try {
      await achievementEndpoints.updateAchievement(id, {
        coverImageIndex: idx,
      });

      setValue("coverImageIndex", idx, { shouldDirty: true });
      notify.msgSuccess("Cover Image Changed!");
    } catch (err) {
      notify.msgError(err?.message || "Failed to update cover image");
    }
  };

  // Can uplaod multiple
  const updateAchievementImage = async (files) => {
    setImagesUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("achievementImages", file);
      });

      await achievementEndpoints.updateAchievementImage(id, formData);

      fetchAchievement();
      notify.msgSuccess("Achievement Images Updated!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to update achievement images");
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteAchievementImage = async (imagePublicId) => {
    setImageDeleting(imagePublicId);

    try {
      await achievementEndpoints.deleteAchievementImage(id, imagePublicId);

      fetchAchievement();
      notify.msgSuccess("Achievement Image Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete achievement image");
    } finally {
      setImageDeleting(null);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchAchievement();
  }, [id]);

  if (id && loading) {
    return <CommonSkeleton count={9} />;
  }

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading={id ? "Edit Achievement" : "Add Achievement"}
        subHeading={
          id
            ? "Update this portfolio achievement"
            : "Highlight an award or milestone"
        }
      />

      <form
        onSubmit={handleSubmit(addUpdateAchievement)}
        className="grid grid-cols-12 gap-6 text-sm"
      >
        {id && (
          <>
            {/* Upload Achievement Images  */}
            <FormField
              id="upload"
              label="Upload Achievement Images (5 max)"
              colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            >
              <DragDropUpload
                id="upload"
                multiple
                accept="image/*"
                loading={imagesUploading}
                onChange={(files) => updateAchievementImage(files)}
              />
            </FormField>

            <ImageGallery
              className="col-span-12 sm:col-span-9"
              images={achievementImages}
              coverImageIndex={coverImageIndex}
              imageDeletingId={imageDeleting}
              handleCoverChange={handleCoverChange}
              deleteImage={deleteAchievementImage}
            />

            <div className="col-span-12 border-b border-dashed border-light-border-primary dark:border-dark-border-primary" />
          </>
        )}

        {/* Achievement Name */}
        <FormField
          id="title"
          label="Achievement Name"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.title?.message}
        >
          <CustomInput
            id="title"
            type="text"
            placeholder="Enter achievement name"
            {...register("title", {
              required: "Achievement name is required!",
              minLength: {
                value: 2,
                message: "Achievement name must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message: "Achievement name must not exceed 100 characters",
              },
            })}
          />
        </FormField>

        {/* Issuer */}
        <FormField
          id="issuer"
          label="Issued By"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.issuer?.message}
        >
          <CustomInput
            id="issuer"
            type="text"
            placeholder="Organization or person name"
            {...register("issuer", {
              required: "Issuer is required!",
              minLength: {
                value: 2,
                message: "Issuer name must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message: "Issuer name must not exceed 100 characters",
              },
            })}
          />
        </FormField>

        {/* Attached Certificate */}
        <FormField
          id="certificateId"
          label="Attach Existing Certificate"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.certificateId?.message}
        >
          <Controller
            name="certificateId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                id="certificateId"
                placeholder="Select"
                options={certificatesList}
                value={field.value}
                onChange={field.onChange} // send value to hook form
              />
            )}
          />
        </FormField>

        {/* Reffered Link */}
        <FormField
          id="link"
          label="Reffered Link"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.link?.message}
          attachment={
            link && (
              <a
                href={link}
                target="_blank"
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
              >
                <ExternalLink size={13} /> <p>Visit Link</p>
              </a>
            )
          }
        >
          <CustomInput
            id="link"
            type="text"
            icon={Link}
            placeholder="https://example.com (optional)"
            {...register("link", {
              pattern: {
                value: /^https:\/\/.+$/,
                message: "URL must start with https://",
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
            placeholder="Describe your achievement and why it matters..."
            {...register("description", {
              maxLength: {
                value: 1000,
                message: "Max 1000 characters allowed!",
              },
            })}
          />
        </FormField>

        {/* Date */}
        <FormField
          id="date"
          label="Date"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.date?.message}
        >
          <CustomDatePicker
            id="date"
            icon={Calendar}
            placeholder="Select Date"
            {...register("date", {
              required: "Date is required!",
            })}
          />
        </FormField>

        {/* Featured */}
        <FormField
          id="featured"
          label="Featured"
          colSpan="col-span-12 sm:col-span-6"
          type="checkbox"
          attachment={
            <p className="font-normal text-xs opacity-80">
              Helps in filtering the achievements
            </p>
          }
        >
          <CustomCheckbox
            id="featured"
            {...register("featured")}
            error={errors?.featured?.message}
          />
        </FormField>

        {/* Sort Order */}
        <FormField
          id="sortOrder"
          label="Sort Order"
          colSpan="col-span-12 sm:col-span-6"
        >
          <CustomInput
            id="sortOrder"
            type="number"
            min={0}
            placeholder="Sort Order"
            {...register("sortOrder", { valueAsNumber: true })}
            error={errors?.sortOrder?.message}
          />
        </FormField>

        {/* Visibility  */}
        <FormField
          id="visibility"
          label="Visibility"
          colSpan="col-span-12 sm:col-span-6"
          required
        >
          <CustomRadioButtons
            id="visibility"
            name="visibility"
            options={visibilities}
            {...register("visibility", {
              required: "Visibility is required!",
            })}
            error={errors?.visibility?.message}
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
