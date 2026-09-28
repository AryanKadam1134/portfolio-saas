import React, { useCallback, useEffect, useState } from "react";

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

import useApi from "../../../hooks/useApi";
import useVisibilities from "../../../hooks/useVisibilities";

import { useModal } from "../../../context/modal/useModal";
import { useNotify } from "../../../context/notification/useNotify";

export default function Achievements() {
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const { visibilities } = useVisibilities();
  const { loading, callApi } = useApi({ achievementsLoading: true });

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [achievements, setAchievements] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchAchievements = useCallback(() => {
    callApi(
      "achievementsLoading",
      () => achievementEndpoints.getAchievements(params),
      {
        onSuccess: (res) => {
          const data = res.data;

          setAchievements(data?.data);
          setPagination(data?.pagination);
        },
        onError: (error) => {
          notify.error({
            title: error?.message || "Failed to load achievements",
          });
        },
      },
    );
  }, [callApi, notify, params]);

  const deleteAchievement = (id) => {
    callApi("deleting", () => achievementEndpoints.deleteAchievement(id), {
      onSuccess: (res) => {
        fetchAchievements();
        closeModal();
        notify.success({ title: res?.message || "Achievement Deleted!" });
      },
      onError: (error) => {
        notify.error({
          title: error?.message || "Failed to delete achievement",
        });
      },
    });
  };

  const deleteAchievementModal = (id) => {
    openModal(
      "Delete Achievement",
      <Trash2 strokeWidth={3} />,
      <DeleteItemModal func={() => deleteAchievement(id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

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
            disabled={loading.deleting}
          />

          <ActionButton
            icon={Trash2}
            variant="red"
            onClick={() => deleteAchievementModal(_id)}
            disabled={loading.deleting}
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
          icon={Plus}
          name="Add Achievement"
          onClick={() => navigate("add")}
          className="self-end flex items-center gap-2"
        />
      </PageHeader>

      <Table
        loading={loading.achievementsLoading}
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
