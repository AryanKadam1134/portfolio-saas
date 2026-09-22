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

import { skillCategoryEndpoints } from "../../../services/skillCategory.service";

import useVisibilities from "../../../hooks/useVisibilities";

import { useModal } from "../../../context/modal/useModal";
import { useNotify } from "../../../context/notification/useNotify";

export default function SkillCategories() {
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchSkillCategories = async () => {
    try {
      const res = await skillCategoryEndpoints.getSkillCategories(params);

      const data = res.data;

      setCategories(data?.data);
      setPagination(data?.pagination);
      console.log("User Skill Categories: ", data);
    } catch (error) {
      notify.error({ title: error?.message || "Failed to fetch skill categories" });
    } finally {
      setLoading(false);
    }
  };

  const deleteSkillCategory = async (categoryId) => {
    setDeleting(true);

    try {
      await skillCategoryEndpoints.deleteSkillCategory(categoryId);

      fetchSkillCategories();
      closeModal();
      notify.success({ title: "Category Deleted!" });
    } catch (error) {
      notify.error({ title: error?.message || "Failed to delete skill category" });
    } finally {
      setDeleting(false);
    }
  };

  const deleteSkillCategoryModal = (_id) => {
    openModal(
      "Delete Skill Category",
      <Trash2 strokeWidth={3} />,
      <DeleteItemModal func={() => deleteSkillCategory(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchSkillCategories();
  }, [params?.page]);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Category Name" },
    { label: "Sort Order" },
    { label: "Visibility" },
    { label: "Actions" },
  ];

  const tableBody = categories?.map((data, index) => {
    const { _id, name, sortOrder, visibility } = data;

    return {
      cells: [
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        name,
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
            onClick={() => deleteSkillCategoryModal(_id)}
            disabled={deleting}
          />
        </div>,
      ],
    };
  });

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading="Skill Categories"
        subHeading="Organize your skills into clear categories"
      >
        <CustomButton
          onClick={() => navigate("add")}
          className="self-end flex items-center gap-2"
        >
          <Plus size={18} /> Add Skill Category
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
