import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FilePenLine, Plus, Trash2 } from "lucide-react";

import PageHeader from "../../../components/common/PageHeader";
import DeleteItemModal from "../../../components/common/DeleteItemModal";

import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import ActionButton from "../../../components/ui/ActionButton";
import CustomButton from "../../../components/ui/CustomButton";

import { calculateSerialNumber } from "../../../utils/calculateSerialNumber";

import { educationEndpoints } from "../../../services/educationService";

import { useModal } from "../../../context/modal/useModal";
import { useNotify } from "../../../context/notification/useNotify";

export default function Educations() {
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [educations, setEducations] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchEducations = async () => {
    try {
      const res = await educationEndpoints.getEducations(params);

      const data = res.data;

      setEducations(data?.data);
      setPagination(data?.pagination);
      console.log("User Educations: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch educations");
    } finally {
      setLoading(false);
    }
  };

  const deleteEducation = async (educationId) => {
    setDeleting(true);

    try {
      await educationEndpoints.deleteEducation(educationId);

      fetchEducations();
      closeModal();
      notify.msgSuccess("Education Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete education");
    } finally {
      setDeleting(false);
    }
  };

  const deleteEducationModal = (_id) => {
    openModal(
      "Delete Education",
      <Trash2 strokeWidth={3} />,
      <DeleteItemModal func={() => deleteEducation(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchEducations();
  }, [params?.page]);

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
            disabled={deleting}
          />

          <ActionButton
            icon={Trash2}
            variant="red"
            onClick={() => deleteEducationModal(_id)}
            disabled={deleting}
          />
        </div>,
      ],
    };
  });

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader heading="Education" subHeading="Manage your academic background">
        <CustomButton
          onClick={() => navigate("add")}
          className="self-end flex items-center gap-2"
        >
          <Plus size={18} /> Add Education
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
