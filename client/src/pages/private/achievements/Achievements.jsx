import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FilePenLine, Plus, Trash2 } from "lucide-react";

import PageHeader from "../../../components/common/PageHeader";
import DeleteItemModal from "../../../components/common/DeleteItemModal";

import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import ActionButton from "../../../components/ui/ActionButton";
import CustomButton from "../../../components/ui/CustomButton";

import { getOptionLabel } from "../../../utils/getOptionLabel";
import { calculateSerialNumber } from "../../../utils/calculateSerialNumber";

import { achievementEndpoints } from "../../../services/achievement.service";

import useVisibilities from "../../../hooks/useVisibilities";

import { useModal } from "../../../context/modal/useModal";
import { useNotify } from "../../../context/notification/useNotify";

export default function Achievements() {
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchAchievements = async () => {
    try {
      const res = await achievementEndpoints.getAchievements(params);

      const data = res.data;

      setAchievements(data?.data);
      setPagination(data?.pagination);
      console.log("User Achievements: ", data);
    } catch (error) {
      notify.error({ title: error?.message || "Failed to fetch achievements" });
    } finally {
      setLoading(false);
    }
  };

  const deleteAchievement = async (achievementId) => {
    setDeleting(true);

    try {
      await achievementEndpoints.deleteAchievement(achievementId);

      fetchAchievements();
      closeModal();
      notify.success({ title: "Achievement Deleted!" });
    } catch (error) {
      notify.error({ title: error?.message || "Failed to delete achievement" });
    } finally {
      setDeleting(false);
    }
  };

  const deleteAchievementModal = (_id) => {
    openModal(
      "Delete Achievement",
      <Trash2 strokeWidth={3} />,
      <DeleteItemModal func={() => deleteAchievement(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchAchievements();
  }, [params?.page]);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Title" },
    { label: "Issuer" },
    { label: "Link" },
    { label: "Sort Order" },
    { label: "Visibility" },
    { label: "Featured" },
    { label: "Actions" },
  ];

  const tableBody = achievements?.map((data, index) => {
    const { _id, title, issuer, link, sortOrder, visibility, featured } = data;

    return {
      cells: [
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        title,
        issuer,
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
        featured ? "Yes" : "No",
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
            onClick={() => deleteAchievementModal(_id)}
            disabled={deleting}
          />
        </div>,
      ],
    };
  });

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading="Achievements"
        subHeading="Highlight awards and milestones"
      >
        <CustomButton
          onClick={() => navigate("add")}
          className="self-end flex items-center gap-2"
        >
          <Plus size={18} /> Add Achievement
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
