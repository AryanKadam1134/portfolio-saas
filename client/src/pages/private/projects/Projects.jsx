import React, { useCallback, useEffect, useState } from "react";

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

import { projectEndpoints } from "../../../services/project.service";

import useApi from "../../../hooks/useApi";
import useVisibilities from "../../../hooks/useVisibilities";

import { useModal } from "../../../context/modal/useModal";
import { useNotify } from "../../../context/notification/useNotify";

export default function Projects() {
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const { visibilities } = useVisibilities();
  const { loading, callApi } = useApi({ projectsLoading: true });

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchProjects = useCallback(() => {
    callApi("projectsLoading", () => projectEndpoints.getProjects(params), {
      onSuccess: (res) => {
        const data = res.data;

        setProjects(data?.data);
        setPagination(data?.pagination);
      },
      onError: (error) => {
        notify.error({
          title: error?.message || "Failed to load projects!",
        });
      },
    });
  }, [callApi, notify, params]);

  const deleteProject = (id) => {
    callApi("deleting", () => projectEndpoints.deleteProject(id), {
      onSuccess: (res) => {
        fetchProjects();
        closeModal();
        notify.success({ title: res?.message || "Project deleted!" });
      },
      onError: (error) => {
        notify.error({
          title: error?.message || "Failed to delete project!",
        });
      },
    });
  };

  const deleteProjectModal = (id) => {
    openModal(
      "Delete Project",
      <Trash2 strokeWidth={3} />,
      <DeleteItemModal func={() => deleteProject(id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Project Name" },
    { label: "Live Link" },
    { label: "Github Link" },
    { label: "Sort Order" },
    { label: "Visibility" },
    { label: "Featured" },
    { label: "Actions" },
  ];

  const tableBody = projects?.map((data, index) => {
    const {
      _id,
      title,
      liveLink,
      githubLink,
      sortOrder,
      visibility,
      featured,
    } = data;

    return {
      cells: [
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        title,
        liveLink && (
          <a
            href={`${liveLink}`}
            target="_blank"
            className="text-blue-500 hover:text-blue-600"
          >
            <ExternalLink size={18} />
          </a>
        ),
        githubLink && (
          <a
            href={`${githubLink}`}
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
            onClick={() => deleteProjectModal(_id)}
            disabled={loading.deleting}
          />
        </div>,
      ],
    };
  });

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading="Projects"
        subHeading="Manage the work in your portfolio"
      >
        <CustomButton
          icon={Plus}
          name="Add Project"
          onClick={() => navigate("add")}
          className="self-end flex items-center gap-2"
        />
      </PageHeader>

      <Table
        loading={loading.projectsLoading}
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
