import React, { Fragment, useEffect, useState } from "react";

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

import { certificateEndpoints } from "../../../services/certificateService";

import useVisibilities from "../../../hooks/useVisibilities";

import { useModal } from "../../../context/modal/useModal";
import { useNotify } from "../../../context/notification/useNotify";

export default function Certificates() {
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchCertificate = async () => {
    try {
      const res = await certificateEndpoints.getCertificates(params);

      const data = res.data;

      setCertificates(data?.data);
      setPagination(data?.pagination);
      console.log("User Certificates: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificate = async (certificateId) => {
    setDeleting(true);

    try {
      await certificateEndpoints.deleteCertificate(certificateId);

      fetchCertificate();
      closeModal();
      notify.msgSuccess("Certificate Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete certificate");
    } finally {
      setDeleting(false);
    }
  };

  const deleteCertificateModal = (_id) => {
    openModal(
      "Delete Certificate",
      <Trash2 strokeWidth={3} />,
      <DeleteItemModal func={() => deleteCertificate(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchCertificate();
  }, [params?.page]);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Title" },
    { label: "Issuer" },
    { label: "URL" },
    { label: "Visibility" },
    { label: "Sort Order" },
    { label: "Actions" },
  ];

  const tableBody = certificates?.map((data, index) => {
    const { _id, title, issuer, credentialUrl, visibility, sortOrder } = data;

    return {
      cells: [
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        title,
        issuer,
        credentialUrl && (
          <a
            href={`${credentialUrl}`}
            target="_blank"
            className="text-blue-500 hover:text-blue-600"
          >
            <ExternalLink size={18} />
          </a>
        ),
        getOptionLabel(visibilities, visibility),
        sortOrder === 0 ? "0" : sortOrder,
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
            onClick={() => deleteCertificateModal(_id)}
            disabled={deleting}
          />
        </div>,
      ],
    };
  });

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading="Certificates"
        subHeading="Showcase your professional certifications"
      >
        <CustomButton
          onClick={() => navigate("add")}
          className="self-end flex items-center gap-2"
        >
          <Plus size={18} /> Add Certificate
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
