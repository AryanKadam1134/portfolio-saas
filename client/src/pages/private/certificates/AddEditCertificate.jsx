import React, { useState, useEffect } from "react";

import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Trash2, Loader, ExternalLink, Link, Calendar } from "lucide-react";

import CoverImage from "../../../components/common/CoverImage";
import CommonSkeleton from "../../../components/common/CommonSkeleton";
import DragDropUpload from "../../../components/common/DragDropUpload";

import LabelInput from "../../../components/ui/LabelInput";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import ActionButton from "../../../components/ui/ActionButton";
import CustomTextArea from "../../../components/ui/CustomTextArea";
import CustomCheckbox from "../../../components/ui/CustomCheckbox";
import CustomDatePicker from "../../../components/ui/CustomDatePicker";
import CustomMultiSelect from "../../../components/ui/CustomMultiSelect";
import CustomRadioButtons from "../../../components/ui/CustomRadioButtons";

import { formatDate } from "../../../utils/formatDate";

import { certificateEndpoints } from "../../../services/certificateService";

import useSkillsList from "../../../hooks/useSkillsList";
import useVisibilities from "../../../hooks/useVisibilities";

import { useNotify } from "../../../context/notification/useNotify";

export default function AddEditCertificate() {
  const { notify } = useNotify();

  const { skillsList } = useSkillsList();
  const { visibilities } = useVisibilities();

  const { certificateId } = useParams();

  const [id, setId] = useState(certificateId);

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
  } = useForm({
    defaultValues: {
      sortOrder: 0,
      featured: true,
      visibility: "public",
    },
    mode: "onChange",
  });

  const credentialUrl = useWatch({ control, name: "credentialUrl" });
  const certificateImage = useWatch({ control, name: "certificateImage" });
  const issueDate = watch("issueDate");
  const expiryDate = watch("expiryDate");

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

  const fetchCertificate = async () => {
    try {
      const res = await certificateEndpoints.getCertificate(id);

      const data = res.data;

      reset({
        ...data,
        issueDate: formatDate(data?.issueDate),
        expiryDate: formatDate(data?.expiryDate),
      });
      console.log("Certificate: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch certificate");
    } finally {
      setLoading(false);
    }
  };

  const addUpdateCertificate = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);

        res = await certificateEndpoints.updateCertificate(id, updatedData);
        notify.msgSuccess("Certificate Updated!");
      } else {
        res = await certificateEndpoints.addCertificate(payload);
        notify.msgSuccess("Certificate Saved!");
      }

      const data = res.data;

      setId(data?._id);
      // console.log("Certificate Saved: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to save certificate");
    }
  };

  // Can uplaod multiple
  const updateCertificateImage = async (files) => {
    const file = files[0];

    setImagesUploading(true);

    try {
      const formData = new FormData();

      formData.append("certificateImage", file);

      await certificateEndpoints.updateCertificateImage(id, formData);

      fetchCertificate();
      notify.msgSuccess("Certificate Image Updated!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to update certificate image");
    } finally {
      setImagesUploading(false);
    }
  };

  const deleteCertificateImage = async () => {
    setImageDeleting(true);
    try {
      await certificateEndpoints.deleteCertificateImage(id);

      fetchCertificate();
      notify.msgSuccess("Certificate Image Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete certificate image");
    } finally {
      setImageDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchCertificate();
  }, [id]);

  if (id && loading) {
    return <CommonSkeleton count={11} />;
  }

  return (
    <form
      onSubmit={handleSubmit(addUpdateCertificate)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {id && (
        <>
          {/* Upload Certificate Image  */}
          <LabelInput
            id="upload"
            label="Upload Certificate Image"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          >
            <DragDropUpload
              id="upload"
              accept="image/*"
              loading={imagesUploading}
              onChange={(files) => updateCertificateImage(files)}
            />
          </LabelInput>

          {/* Certificate Image */}
          <LabelInput
            label="Certificate Image"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          >
            <CoverImage
              image={certificateImage}
              imageDeleting={imageDeleting}
              deleteImage={deleteCertificateImage}
            />
          </LabelInput>

          <div className="col-span-12 border-b border-dashed border-light-border-primary dark:border-dark-border-primary" />
        </>
      )}

      {/* Certificate Name */}
      <LabelInput
        id="title"
        label="Certificate Name"
        colSpan="col-span-12 sm:col-span-6"
        required
        error={errors?.title?.message}
      >
        <CustomInput
          id="title"
          type="text"
          placeholder="Enter certificate name"
          {...register("title", {
            required: "Certificate name is required!",
            minLength: {
              value: 2,
              message: "Certificate name must be at least 2 characters",
            },
            maxLength: {
              value: 100,
              message: "Certificate name must not exceed 100 characters",
            },
          })}
        />
      </LabelInput>

      {/* Issued By */}
      <LabelInput
        id="issuer"
        label="Issued By"
        colSpan="col-span-12 sm:col-span-6"
        required
        error={errors?.issuer?.message}
      >
        <CustomInput
          id="issuer"
          type="text"
          placeholder="Organization or institution name"
          {...register("issuer", {
            required: "Issuer name is required!",
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
      </LabelInput>

      {/* Credential Id */}
      <LabelInput
        id="credentialId"
        label="Credential ID"
        colSpan="col-span-12 sm:col-span-6"
        error={errors?.credentialId?.message}
      >
        <CustomInput
          id="credentialId"
          type="text"
          placeholder="e.g., ABC123XYZ (optional)"
          {...register("credentialId", {
            maxLength: {
              value: 50,
              message: "Credential ID must not exceed 50 characters",
            },
          })}
        />
      </LabelInput>

      {/* Credential URL */}
      <LabelInput
        id="credentialUrl"
        label="Credential URL"
        colSpan="col-span-12 sm:col-span-6"
        error={errors?.credentialUrl?.message}
        attachment={
          credentialUrl && (
            <a
              href={credentialUrl}
              target="_blank"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              <ExternalLink size={13} /> <p>Visit Link</p>
            </a>
          )
        }
      >
        <CustomInput
          id="credentialUrl"
          type="text"
          icon={Link}
          placeholder="https://example.com/certificate (optional)"
          {...register("credentialUrl", {
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
          placeholder="Describe what you learned or achieved with this certificate..."
          {...register("description", {
            maxLength: {
              value: 1000,
              message: "Description must not exceed 1000 characters",
            },
          })}
        />
      </LabelInput>

      {/* Skills */}
      <LabelInput
        id="skills"
        label="Skills"
        colSpan="col-span-12 sm:col-span-6"
        error={errors?.skills?.message}
      >
        <Controller
          name="skills"
          control={control}
          render={({ field }) => (
            <CustomMultiSelect
              id="skills"
              placeholder="Select skills learned"
              options={skillsList}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </LabelInput>

      {/* Issue Date */}
      <LabelInput
        id="issueDate"
        label="Issue Date"
        colSpan="col-span-12 sm:col-span-6"
        required
        error={errors?.issueDate?.message}
      >
        <CustomDatePicker
          id="issueDate"
          icon={Calendar}
          placeholder="YYYY-MM-DD"
          {...register("issueDate", {
            required: "Issue date is required!",
            validate: (value) => {
              if (
                expiryDate &&
                value &&
                dayjs(value).isAfter(dayjs(expiryDate))
              ) {
                return "Issue date cannot be after expiry date";
              }
              return true;
            },
          })}
        />
      </LabelInput>

      {/* Expiry Date */}
      <LabelInput
        id="expiryDate"
        label="Expiry Date"
        colSpan="col-span-12 sm:col-span-6"
        error={errors?.expiryDate?.message}
      >
        <CustomDatePicker
          id="expiryDate"
          icon={Calendar}
          placeholder="YYYY-MM-DD (leave blank if no expiry)"
          {...register("expiryDate", {
            validate: (value) => {
              if (
                value &&
                issueDate &&
                dayjs(value).isBefore(dayjs(issueDate))
              ) {
                return "Expiry date cannot be before issue date";
              }
              return true;
            },
          })}
        />
      </LabelInput>

      {/* Featured */}
      <LabelInput
        id="featured"
        label="Featured"
        colSpan="col-span-12 sm:col-span-6"
        type="checkbox"
        error={errors?.featured?.message}
        attachment={
          <p className="font-normal text-xs opacity-80">
            Helps in filtering the certificates
          </p>
        }
      >
        <CustomCheckbox id="featured" {...register("featured")} />
      </LabelInput>

      {/* Sort Order */}
      <LabelInput
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
