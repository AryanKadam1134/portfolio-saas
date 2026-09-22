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

import { experienceEndpoints } from "../../../services/experience.service";

import useVisibilities from "../../../hooks/useVisibilities";
import useEmploymentTypes from "../../../hooks/useEmploymentTypes";
import useLocationTypesList from "../../../hooks/useLocationTypesList";

import { useModal } from "../../../context/modal/useModal";
import { useNotify } from "../../../context/notification/useNotify";

export default function Experiences() {
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const { visibilities } = useVisibilities();
  const { employmentTypes } = useEmploymentTypes();
  const { locationTypesList } = useLocationTypesList();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchExperiences = async () => {
    try {
      const res = await experienceEndpoints.getExperiences(params);

      const data = res.data;

      setExperiences(data?.data);
      setPagination(data?.pagination);
      // console.log("User Experiences: ", data);
    } catch (error) {
      notify.error({ title: error?.message || "Failed to fetch experiences" });
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (experienceId) => {
    setDeleting(true);

    try {
      await experienceEndpoints.deleteExperience(experienceId);

      fetchExperiences();
      closeModal();
      notify.success({ title: "Experience Deleted!" });
    } catch (error) {
      notify.error({ title: error?.message || "Failed to delete experience" });
    } finally {
      setDeleting(false);
    }
  };

  const deleteExperienceModal = (_id) => {
    openModal(
      "Delete Experience",
      <Trash2 strokeWidth={3} />,
      <DeleteItemModal func={() => deleteExperience(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchExperiences();
  }, [params?.page]);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Organiaztion Name" },
    { label: "Exployment Type" },
    { label: "Location" },
    { label: "Location Type" },
    { label: "Visibility" },
    { label: "Actions" },
  ];

  const tableBody = experiences?.map((data, index) => {
    const {
      _id,
      organization,
      employmentType,
      location,
      locationType,
      visibility,
    } = data;

    return {
      cells: [
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        organization,
        getOptionLabel(employmentTypes, employmentType),
        location,
        getOptionLabel(locationTypesList, locationType),
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
            onClick={() => deleteExperienceModal(_id)}
            disabled={deleting}
          />
        </div>,
      ],
    };
  });

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading="Experience"
        subHeading="Document your professional journey"
      >
        <CustomButton
          onClick={() => navigate("add")}
          className="self-end flex items-center gap-2"
        >
          <Plus size={18} /> Add Experience
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
