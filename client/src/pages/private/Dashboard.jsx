import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { Mail, Phone, Link } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";

import UploadUserImage from "../../components/user/UploadUserImage";
import UploadUserResume from "../../components/user/UploadUserResume";
import UserDetailsSkeleton from "../../components/user/UserDetailsSkeleton";

import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomTextArea from "../../components/ui/CustomTextArea";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

import { userEndpoints } from "../../services/userService";

import useGenders from "../../hooks/useGenders";

import { useAuth } from "../../context/auth/useAuth";
import { useNotify } from "../../context/notification/useNotify";

export default function Dashboard() {
  const { setUser } = useAuth();
  const { notify } = useNotify();

  const { genders } = useGenders();

  const [detailsLoading, setDetailsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    mode: "onChange", // 🔥 important
  });

  const fetchUserDetails = async () => {
    try {
      const res = await userEndpoints.getCurrentUser();

      const data = res.data;

      reset(data);
      setUser(data);
      // console.log("User Details: ", data);
    } catch (error) {
      console.error("Error fetching User Details: ", error);
      notify.msgError(error?.message || "Failed to load user details");
    } finally {
      setDetailsLoading(false);
    }
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

  const onSubmit = async (data) => {
    const updatedData = getUpdatedFields(data, dirtyFields);

    console.log("Only Updated Fields:", updatedData);

    try {
      await userEndpoints.updateUser(updatedData);

      fetchUserDetails();
      notify.msgSuccess("Details Updated!");
    } catch (error) {
      console.error("Error updating User Details: ", error);
      notify.msgError(error?.message || "Failed to update user details");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (detailsLoading) {
    return <UserDetailsSkeleton />;
  }

  return (
    <div>
      <PageHeader
        heading="User Details"
        subHeading="Manage the personal information shown on your portfolio"
        className="mb-6"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-6 text-sm"
      >
        {/* User Image */}
        <div className="row-span-3 col-span-12 sm:col-span-6 lg:col-span-3 flex items-center justify-center">
          <UploadUserImage />
        </div>

        {/* First Name */}
        <LabelInput
          id="firstName"
          label="First Name"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          required
          error={errors?.firstName?.message}
        >
          <CustomInput
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            {...register("firstName", {
              required: "First name is required!",
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "First name must not exceed 50 characters",
              },
            })}
          />
        </LabelInput>

        {/* Middle Name */}
        <LabelInput
          id="middleName"
          label="Middle Name"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          error={errors?.middleName?.message}
        >
          <CustomInput
            id="middleName"
            type="text"
            placeholder="Enter middle name (optional)"
            {...register("middleName", {})}
          />
        </LabelInput>

        {/* Last Name */}
        <LabelInput
          id="lastName"
          label="Last Name"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          error={errors?.lastName?.message}
        >
          <CustomInput
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            {...register("lastName", {
              maxLength: {
                value: 50,
                message: "Last name must not exceed 50 characters",
              },
            })}
          />
        </LabelInput>

        {/* Username */}
        <LabelInput
          id="username"
          label="Username"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          required
          error={errors?.username?.message}
        >
          <CustomInput
            id="username"
            type="text"
            placeholder="Enter a unique username"
            {...register("username", {
              required: "Username is required!",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              maxLength: {
                value: 30,
                message: "Username must not exceed 30 characters",
              },
              pattern: {
                value: /^[a-zA-Z0-9_-]+$/,
                message:
                  "Username can only contain letters, numbers, hyphens, and underscores",
              },
            })}
          />
        </LabelInput>

        {/* Email */}
        <LabelInput
          id="email"
          label="Email"
          // attachment={
          //   <div className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer">
          //     <Edit size={13} /> <p>Update Email</p>
          //   </div>
          // }
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          required
          error={errors?.email?.message}
        >
          <CustomInput
            id="email"
            type="email"
            icon={Mail}
            placeholder="your.email@example.com"
            {...register("email", {
              required: "Email is required!",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            disabled
          />
        </LabelInput>

        {/* Mobile No. */}
        <LabelInput
          id="mobileNo"
          label="Mobile No."
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          required
          error={errors?.mobileNo?.message}
        >
          <CustomInput
            id="mobileNo"
            type="tel"
            icon={Phone}
            placeholder="Enter 10-digit phone number"
            {...register("mobileNo", {
              required: "Mobile number is required!",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Mobile number must be exactly 10 digits",
              },
            })}
          />
        </LabelInput>

        {/* Gender */}
        <LabelInput
          id="gender"
          label="Gender"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          required
          error={errors?.gender?.message}
        >
          <CustomRadioButtons
            name="gender"
            options={genders}
            {...register("gender", {
              required: "Gender is required!",
            })}
          />
        </LabelInput>

        <div className="hidden lg:block col-span-6"></div>

        {/* Resume PDF - Drag & Drop */}
        <LabelInput
          id="resumeOrCv"
          label="Resume PDF"
          colSpan="row-span-3 col-span-12 sm:col-span-6 lg:col-span-3"
          className="order-[98] lg:order-0"
          required
        >
          <UploadUserResume />
        </LabelInput>

        {/* Headline */}
        <LabelInput
          id="headline"
          label="Professional Headline"
          colSpan="row-span-3 col-span-12 lg:col-span-3"
          error={errors?.headline?.message}
        >
          <CustomTextArea
            id="headline"
            rows={6}
            placeholder="e.g., Full Stack Developer | React & Node.js Expert"
            {...register("headline", {
              maxLength: {
                value: 100,
                message: "Headline must not exceed 100 characters",
              },
            })}
          />
        </LabelInput>

        {/* About */}
        <LabelInput
          id="about"
          label="About You"
          colSpan="row-span-3 col-span-12 lg:col-span-6"
          error={errors?.about?.message}
        >
          <CustomTextArea
            id="about"
            rows={6}
            placeholder="Tell us about yourself, your experience, and what you're passionate about..."
            {...register("about", {
              maxLength: {
                value: 1000,
                message: "About section must not exceed 1000 characters",
              },
            })}
          />
        </LabelInput>

        {/* Resume Link */}
        <LabelInput
          id="documentUrl"
          label="Resume Link"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          className="order-[99] lg:order-0"
          error={errors?.documentUrl?.message}
        >
          <CustomInput
            id="documentUrl"
            type="text"
            icon={Link}
            placeholder="https://drive.google.com/... (optional)"
            {...register("documentUrl", {
              pattern: {
                value: /^(https:\/\/.+)?$/,
                message: "URL must start with https://",
              },
            })}
          />
        </LabelInput>

        {/* City */}
        <LabelInput
          id="city"
          label="City"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          error={errors?.location?.city?.message}
        >
          <CustomInput
            id="city"
            type="text"
            placeholder="Enter your city"
            {...register("location.city", {
              maxLength: {
                value: 50,
                message: "City name must not exceed 50 characters",
              },
            })}
          />
        </LabelInput>

        {/* State */}
        <LabelInput
          id="state"
          label="State / Province"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          error={errors?.location?.state?.message}
        >
          <CustomInput
            id="state"
            type="text"
            placeholder="Enter your state or province"
            {...register("location.state", {
              maxLength: {
                value: 50,
                message: "State name must not exceed 50 characters",
              },
            })}
          />
        </LabelInput>

        {/* Country */}
        <LabelInput
          id="country"
          label="Country"
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          error={errors?.location?.country?.message}
        >
          <CustomInput
            id="country"
            type="text"
            placeholder="Enter your country"
            {...register("location.country", {
              maxLength: {
                value: 50,
                message: "Country name must not exceed 50 characters",
              },
            })}
          />
        </LabelInput>

        <CustomButton
          type="submit"
          className="col-span-12 place-self-end order-last lg:order-0"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </CustomButton>
      </form>
    </div>
  );
}
