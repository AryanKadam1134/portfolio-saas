import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { ExternalLink, FilePenLine, Plus, Trash2 } from "lucide-react";

import PageHeader from "../../../components/common/PageHeader";
import DeleteItemModal from "../../../components/common/DeleteItemModal";

import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import ActionButton from "../../../components/ui/ActionButton";
import CustomButton from "../../../components/ui/CustomButton";

import { getOptionLabel } from "../../../utils/getOptionLabel";
import { calculateSerialNumber } from "../../../utils/calculateSerialNumber";

import { socialPlatformEndpoints } from "../../../services/socialPlatform.service";

import useVisibilities from "../../../hooks/useVisibilities";

import { useModal } from "../../../context/modal/useModal";
import { useNotify } from "../../../context/notification/useNotify";

export default function SocialPlatforms() {
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchSocialPlatforms = async () => {
    try {
      const res = await socialPlatformEndpoints.getSocialPlatforms(params);

      const data = res.data;

      setPlatforms(data?.data);
      setPagination(data?.pagination);
      console.log("User Social Platforms: ", data);
    } catch (error) {
      notify.error({ title: error?.message || "Failed to fetch social platforms" });
    } finally {
      setLoading(false);
    }
  };

  const deletePlatform = async (platformId) => {
    setDeleting(true);

    try {
      await socialPlatformEndpoints.deleteSocialPlatform(platformId);

      fetchSocialPlatforms();
      closeModal();
      notify.success({ title: "Platform Deleted!" });
    } catch (error) {
      notify.error({ title: error?.message || "Failed to delete social platform" });
    } finally {
      setDeleting(false);
    }
  };

  const deletePlatformModal = (_id) => {
    openModal(
      "Delete Platform",
      <Trash2 strokeWidth={3} />,
      <DeleteItemModal func={() => deletePlatform(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchSocialPlatforms();
  }, [params?.page]);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Platform Name" },
    { label: "Link" },
    { label: "Sort Order" },
    { label: "Visibility" },
    { label: "Actions" },
  ];

  const tableBody = platforms?.map((data, index) => {
    const { _id, name, link, sortOrder, visibility } = data;

    return {
      cells: [
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        name,
        link && (
          <a
            href={`${link}`}
            target="_blank"
            className="text-blue-500 hover:text-blue-600"
          >
            <ExternalLink size={18} />
          </a>
        ),
        sortOrder === 0 ? "0" : sortOrder,
        getOptionLabel(visibilities, visibility),
        <div className="flex items-center gap-1">
          <ActionButton
            icon={FilePenLine}
            variant="green"
            onClick={() => navigate(`${_id}/edit`)}
            disabled={deleting}
          />

          <ActionButton
            icon={Trash2}
            variant="red"
            onClick={() => deletePlatformModal(_id)}
            disabled={deleting}
          />
        </div>,
      ],
    };
  });

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading="Social Platforms"
        subHeading="Manage your Social Platforms"
      >
        <CustomButton
          onClick={() => navigate("add")}
          className="self-end flex items-center gap-2"
        >
          <Plus size={18} /> Add Social Platfrom
        </CustomButton>
      </PageHeader>

      <Table
        loading={loading}
        tableHeading={tableHeading}
        tableBody={tableBody}
      />

      <Pagination
        currentPage={pagination?.page}
        totalPages={pagination?.totalPages}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page: page }))}
      />
    </div>
  );
}
