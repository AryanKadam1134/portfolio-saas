import React, { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FilePenLine, Plus, Trash2 } from "lucide-react";

import PageHeader from "../../../components/common/PageHeader";
import DeleteItemModal from "../../../components/common/DeleteItemModal";

import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import CustomButton from "../../../components/ui/CustomButton";
import ActionButton from "../../../components/ui/ActionButton";

import { getOptionLabel } from "../../../utils/getOptionLabel";
import { calculateSerialNumber } from "../../../utils/calculateSerialNumber";

import { skillEndpoints } from "../../../services/skill.service";

import useApi from "../../../hooks/useApi";
import useSkillLevels from "../../../hooks/useSkillLevels";
import useVisibilities from "../../../hooks/useVisibilities";

import { useModal } from "../../../context/modal/useModal";
import { useNotify } from "../../../context/notification/useNotify";

export default function Skills() {
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const { skillLevels } = useSkillLevels();
  const { visibilities } = useVisibilities();
  const { loading, callApi } = useApi({ skillsLoading: true });

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [skills, setSkills] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchSkills = useCallback(() => {
    callApi("skillsLoading", () => skillEndpoints.getSkills(params), {
      onSuccess: (res) => {
        const data = res.data;

        setSkills(data?.data);
        setPagination(data?.pagination);
      },
      onError: (error) => {
        notify.error({
          title: error?.message || "Failed to load skills!",
        });
      },
    });
  }, [callApi, notify, params]);

  const deleteSkill = (id) => {
    callApi("deleting", () => skillEndpoints.deleteSkill(id), {
      onSuccess: (res) => {
        fetchSkills();
        closeModal();
        notify.success({ title: res?.message || "Skill deleted!" });
      },
      onError: (error) => {
        notify.error({
          title: error?.message || "Failed to delete skill!",
        });
      },
    });
  };

  const deleteSkillModal = (id) => {
    openModal(
      "Delete Skill",
      <Trash2 strokeWidth={3} />,
      <DeleteItemModal func={() => deleteSkill(id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Skill Name" },
    { label: "Category" },
    { label: "Level" },
    { label: "Sort Order" },
    { label: "Visibility" },
    { label: "Actions" },
  ];

  const tableBody = skills?.map((data, index) => {
    const { _id, name, category, level, sortOrder, visibility } = data;

    return {
      cells: [
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        name,
        category?.name,
        getOptionLabel(skillLevels, level),
        sortOrder === 0 ? "0" : sortOrder,
        getOptionLabel(visibilities, visibility),
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
            onClick={() => deleteSkillModal(_id)}
            disabled={loading.deleting}
          />
        </div>,
      ],
    };
  });

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader heading="Skills" subHeading="Manage your professional skills">
        <CustomButton
          icon={Plus}
          name="Add Skill"
          onClick={() => navigate("add")}
          className="self-end flex items-center gap-2"
        />
      </PageHeader>

      <Table
        loading={loading.skillsLoading}
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
