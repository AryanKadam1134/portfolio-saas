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

import { skillCategoryEndpoints } from "../../../services/skillCategory.service";

import useApi from "../../../hooks/useApi";
import useVisibilities from "../../../hooks/useVisibilities";

import { useModal } from "../../../context/modal/useModal";
import { useNotify } from "../../../context/notification/useNotify";

export default function SkillCategories() {
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const { visibilities } = useVisibilities();
  const { loading, callApi } = useApi({ categoriesLoading: true });

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchSkillCategories = useCallback(() => {
    callApi(
      "categoriesLoading",
      () => skillCategoryEndpoints.getSkillCategories(params),
      {
        onSuccess: (res) => {
          const data = res.data;

          setCategories(data?.data);
          setPagination(data?.pagination);
        },
        onError: (error) => {
          notify.error({
            title: error?.message || "Failed to load categories",
          });
        },
      },
    );
  }, [callApi, notify, params]);

  const deleteSkillCategory = (id) => {
    callApi("deleting", () => skillCategoryEndpoints.deleteSkillCategory(id), {
      onSuccess: (res) => {
        fetchSkillCategories();
        closeModal();
        notify.success({ title: res?.message || "Category Deleted!" });
      },
      onError: (error) => {
        notify.error({
          title: error?.message || "Failed to delete category",
        });
      },
    });
  };

  const deleteSkillCategoryModal = (id) => {
    openModal(
      "Delete Skill Category",
      <Trash2 strokeWidth={3} />,
      <DeleteItemModal func={() => deleteSkillCategory(id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchSkillCategories();
  }, [fetchSkillCategories]);

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
            disabled={loading.deleting}
          />

          <ActionButton
            icon={Trash2}
            variant="red"
            onClick={() => deleteSkillCategoryModal(_id)}
            disabled={loading.deleting}
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
          icon={Plus}
          name="Add Skill Category"
          onClick={() => navigate("add")}
          className="self-end flex items-center gap-2"
        />
      </PageHeader>

      <Table
        loading={loading.categoriesLoading}
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
