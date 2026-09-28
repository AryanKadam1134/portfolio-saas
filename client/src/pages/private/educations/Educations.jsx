import React, { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FilePenLine, Plus, Trash2 } from "lucide-react";

import PageHeader from "../../../components/common/PageHeader";
import DeleteItemModal from "../../../components/common/DeleteItemModal";

import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import ActionButton from "../../../components/ui/ActionButton";
import CustomButton from "../../../components/ui/CustomButton";

import { calculateSerialNumber } from "../../../utils/calculateSerialNumber";

import { educationEndpoints } from "../../../services/education.service";

import useApi from "../../../hooks/useApi";

import { useModal } from "../../../context/modal/useModal";
import { useNotify } from "../../../context/notification/useNotify";

export default function Educations() {
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const { loading, callApi } = useApi({ educationsLoading: true });

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [educations, setEducations] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchEducations = useCallback(() => {
    callApi(
      "educationsLoading",
      () => educationEndpoints.getEducations(params),
      {
        onSuccess: (res) => {
          const data = res.data;

          setEducations(data?.data);
          setPagination(data?.pagination);
        },
        onError: (error) => {
          notify.error({
            title: error?.message || "Failed to load educations",
          });
        },
      },
    );
  }, [callApi, notify, params]);

  const deleteEducation = (id) => {
    callApi("deleting", () => educationEndpoints.deleteEducation(id), {
      onSuccess: (res) => {
        fetchEducations();
        closeModal();
        notify.success({ title: res?.message || "Education Deleted!" });
      },
      onError: (error) => {
        notify.error({
          title: error?.message || "Failed to delete education",
        });
      },
    });
  };

  const deleteEducationModal = (id) => {
    openModal(
      "Delete Education",
      <Trash2 strokeWidth={3} />,
      <DeleteItemModal func={() => deleteEducation(id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Institute Name" },
    { label: "Qualification" },
    { label: "Percentage / CGPA" },
    { label: "Is Present" },
    { label: "Actions" },
  ];

  const tableBody = educations?.map((data, index) => {
    const { _id, instituteName, qualification, percentage, cgpa, isCurrent } =
      data;

    return {
      cells: [
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        instituteName,
        qualification,
        percentage || cgpa,
        isCurrent ? "Yes" : "No",
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
            onClick={() => deleteEducationModal(_id)}
            disabled={loading.deleting}
          />
        </div>,
      ],
    };
  });

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading="Education"
        subHeading="Manage your academic background"
      >
        <CustomButton
          icon={Plus}
          name="Add Education"
          onClick={() => navigate("add")}
          className="self-end flex items-center gap-2"
        />
      </PageHeader>

      <Table
        loading={loading.educationsLoading}
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
