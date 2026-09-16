import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { ExternalLink, Link } from "lucide-react";

import CommonSkeleton from "../../../components/common/CommonSkeleton";

import LabelInput from "../../../components/ui/LabelInput";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomSelect from "../../../components/ui/CustomSelect";
import CustomRadioButtons from "../../../components/ui/CustomRadioButtons";

import { socialPlatformEndpoints } from "../../../services/socialPlatformService";

import useVisibilities from "../../../hooks/useVisibilities";

import { useNotify } from "../../../context/notification/useNotify";
import PageHeader from "../../../components/common/PageHeader";

const SOCIAL_APPS_LIST = [
  {
    id: 61,
    title: "Facebook",
    category: "Social",
    route: "https://svgl.app/library/facebook-icon.svg",
    wordmark: "https://svgl.app/library/facebook-wordmark.svg",
    url: "https://www.facebook.com",
    brandUrl: "https://about.meta.com/brand/resources/facebook/logo",
  },
  {
    id: 62,
    title: "Twitter",
    category: "Social",
    route: "https://svgl.app/library/twitter.svg",
    url: "https://twitter.com/",
  },
  {
    id: 78,
    title: "YouTube",
    category: ["Google", "Social"],
    route: "https://svgl.app/library/youtube.svg",
    wordmark: {
      light: "https://svgl.app/library/youtube-wordmark-light.svg",
      dark: "https://svgl.app/library/youtube-wordmark-dark.svg",
    },
    url: "https://www.youtube.com",
    brandUrl: "https://brand.youtube",
  },
  {
    id: 85,
    title: "LinkedIn",
    category: "Social",
    route: "https://svgl.app/library/linkedin.svg",
    url: "https://www.linkedin.com/",
    brandUrl: "https://brand.linkedin.com/",
  },
  {
    id: 86,
    title: "Telegram",
    category: "Social",
    route: "https://svgl.app/library/telegram.svg",
    url: "https://web.telegram.org/",
  },
  {
    id: 87,
    title: "Matrix",
    category: "Social",
    route: {
      light: "https://svgl.app/library/matrix-light.svg",
      dark: "https://svgl.app/library/matrix-dark.svg",
    },
    url: "https://matrix.org/",
  },
  {
    id: 88,
    title: "WhatsApp",
    category: "Social",
    route: "https://svgl.app/library/whatsapp-icon.svg",
    wordmark: "https://svgl.app/library/whatsapp-wordmark.svg",
    url: "https://web.whatsapp.com",
    brandUrl: "https://www.meta.com/brand/resources/whatsapp/whatsapp-brand",
  },
  {
    id: 110,
    title: "Arc",
    category: "Social",
    route: {
      light: "https://svgl.app/library/arc.svg",
      dark: "https://svgl.app/library/arc_dark.svg",
    },
    url: "https://arc.dev",
  },
  {
    id: 215,
    title: "Mastodon",
    category: "Social",
    route: "https://svgl.app/library/mastodon.svg",
    url: "https://joinmastodon.org/",
  },
  {
    id: 229,
    title: "Messenger",
    category: "Social",
    route: "https://svgl.app/library/messenger.svg",
    url: "https://www.messenger.com/",
  },
  {
    id: 248,
    title: "Infojobs",
    category: "Social",
    route: "https://svgl.app/library/infojobs-logo.svg",
    url: "https://www.infojobs.net/",
  },
  {
    id: 252,
    title: "Skype",
    category: "Social",
    route: "https://svgl.app/library/skype.svg",
    url: "https://www.skype.com/",
  },
  {
    id: 261,
    title: "Threads",
    category: "Social",
    route: {
      light: "https://svgl.app/library/threads.svg",
      dark: "https://svgl.app/library/threads_dark.svg",
    },
    url: "https://threads.net/",
  },
  {
    id: 262,
    title: "Instagram",
    category: "Social",
    route: "https://svgl.app/library/instagram-icon.svg",
    wordmark: "https://svgl.app/library/instagram-wordmark.svg",
    url: "https://www.instagram.com/",
    brandUrl: "https://about.instagram.com/brand",
  },
  {
    id: 284,
    title: "X",
    category: "Social",
    route: {
      light: "https://svgl.app/library/x.svg",
      dark: "https://svgl.app/library/x_dark.svg",
    },
    url: "https://x.com",
    brandUrl: "https://about.x.com/en/who-we-are/brand-toolkit",
  },
  {
    id: 293,
    title: "VK",
    category: "Social",
    route: "https://svgl.app/library/vk.svg",
    url: "https://vk.com",
  },
  {
    id: 313,
    title: "Hashnode",
    category: "Social",
    route: "https://svgl.app/library/hashnode.svg",
    url: "https://hashnode.com",
  },
  {
    id: 317,
    title: "Patreon",
    category: "Social",
    route: {
      light: "https://svgl.app/library/patreon.svg",
      dark: "https://svgl.app/library/patreon_dark.svg",
    },
    url: "https://www.patreon.com/",
  },
  {
    id: 318,
    title: "Peerlist",
    category: "Social",
    route: "https://svgl.app/library/peerlist.svg",
    url: "https://www.peerlist.io/",
  },
  {
    id: 343,
    title: "Pinterest",
    category: "Social",
    route: "https://svgl.app/library/pinterest.svg",
    url: "https://pinterest.com/",
  },
  {
    id: 353,
    title: "Reddit",
    category: "Social",
    route: "https://svgl.app/library/reddit.svg",
    url: "https://www.reddit.com/",
    brandUrl: "https://redditinc.com/brand",
  },
  {
    id: 404,
    title: "Meta",
    category: "Social",
    route: "https://svgl.app/library/meta.svg",
    url: "https://about.meta.com/es/",
    brandUrl: "https://about.meta.com/brand/resources/",
  },
  {
    id: 426,
    title: "TikTok",
    category: "Social",
    route: {
      light: "https://svgl.app/library/tiktok-icon-light.svg",
      dark: "https://svgl.app/library/tiktok-icon-dark.svg",
    },
    wordmark: {
      light: "https://svgl.app/library/tiktok-wordmark-light.svg",
      dark: "https://svgl.app/library/tiktok-wordmark-dark.svg",
    },
    url: "https://www.tiktok.com",
  },
  {
    id: 471,
    title: "Carrd",
    category: ["Social"],
    route: "https://svgl.app/library/carrd.svg",
    url: "https://carrd.co/",
  },
  {
    id: 475,
    title: "Bluesky",
    category: "Social",
    route: "https://svgl.app/library/bluesky.svg",
    url: "https://blueskyweb.xyz/",
  },
  {
    id: 477,
    title: "daily.dev",
    category: ["Social", "Community"],
    route: {
      light: "https://svgl.app/library/daily-dev-ligth.svg",
      dark: "https://svgl.app/library/daily-dev-dark.svg",
    },
    url: "https://daily.dev/",
  },
  {
    id: 542,
    title: "Zulip",
    category: ["Software", "Social"],
    route: "https://svgl.app/library/zulip.svg",
    wordmark: "https://svgl.app/library/zulip-wordmark.svg",
    url: "https://zulip.com/",
    brandUrl:
      "https://github.com/zulip/zulip/tree/bd29fb3e2691daef570ba5661351922a16782dd2/static/images/logo",
  },
];

const SOCIAL_APPS = SOCIAL_APPS_LIST.map((app) => ({
  value: app.title,
  label: app.title,
}));

export default function AddEditSocialPlatform() {
  const { notify } = useNotify();

  const { visibilities } = useVisibilities();

  const { platformId } = useParams();

  const [id, setId] = useState(platformId);

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

  const platformLink = useWatch({ control, name: "link" });

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

  const fetchSocialPlatform = async () => {
    try {
      const res = await socialPlatformEndpoints.getSocialPlatform(id);

      const data = res.data;

      reset(data);
      console.log("Social Platform: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch social platform");
    } finally {
      setLoading(false);
    }
  };

  const addUpdatePlatform = async (payload) => {
    try {
      let res;
      if (id) {
        const updatedData = getUpdatedFields(payload, dirtyFields);
        res = await socialPlatformEndpoints.updateSocialPlatform(
          id,
          updatedData,
        );
        notify.msgSuccess("Platform Updated!");
      } else {
        res = await socialPlatformEndpoints.addSocialPlatform(payload);
        notify.msgSuccess("Platform Added!");
      }

      const data = res.data;

      setId(data?._id);
      // console.log("Social Platform Saved: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to save social platform");
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchSocialPlatform();
  }, [id]);

  if (id && loading) {
    return <CommonSkeleton count={5} />;
  }

  return (
    <div>
      <PageHeader
        heading={id ? "Edit Platform" : "Add Platform"}
        subHeading={
          id
            ? "Update this social platform in your portfolio"
            : "Add a social platform to your portfolio"
        }
        className="mb-6"
      />

      <form
        onSubmit={handleSubmit(addUpdatePlatform)}
        className="grid grid-cols-12 gap-6 text-sm"
      >
        {!id && (
          <>
            <LabelInput
              id="popular"
              label="Popular Platforms"
              colSpan="col-span-12 sm:col-span-6"
            >
              <CustomSelect
                id="popular"
                placeholder="Select Platform"
                options={SOCIAL_APPS}
                value={null}
                onChange={(value) => reset({ name: value })} // send value to hook form
              />
            </LabelInput>

            <div className="col-span-12 border-b border-dashed border-light-border-primary dark:border-dark-border-primary" />
          </>
        )}

        {/* Platform Name */}
        <LabelInput
          id="name"
          label="Platform Name"
          colSpan="col-span-12 sm:col-span-6"
          required
          error={errors?.name?.message}
        >
          <CustomInput
            id="name"
            type="text"
            placeholder="e.g., GitHub, LinkedIn, Twitter"
            {...register("name", {
              required: "Platform name is required!",
              minLength: {
                value: 1,
                message: "Platform name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Platform name must not exceed 50 characters",
              },
            })}
          />
        </LabelInput>

        {/* Logo URL */}
        <LabelInput
          id="logoUrl"
          label="Logo URL"
          colSpan="col-span-12 sm:col-span-6"
          error={errors?.logoUrl?.message}
        >
          <CustomInput
            id="logoUrl"
            type="text"
            placeholder="e.g., /images/github.svg"
            {...register("logoUrl")}
          />
        </LabelInput>

        {/* Platform Link */}
        <LabelInput
          id="link"
          label="Link"
          colSpan="col-span-12 sm:col-span-6"
          attachment={
            platformLink && (
              <a
                href={platformLink}
                target="_blank"
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
              >
                <ExternalLink size={13} /> <p>Visit Link</p>
              </a>
            )
          }
          required
          error={errors?.link?.message}
        >
          <CustomInput
            id="link"
            type="text"
            icon={Link}
            placeholder="https://github.com/username or your profile URL"
            {...register("link", {
              required: "Platform link is required!",
              pattern: {
                value: /^(https:\/\/.+)?$/,
                message: "URL must start with https://",
              },
            })}
          />
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
    </div>
  );
}
