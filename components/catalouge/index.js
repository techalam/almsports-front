import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Row } from "react-bootstrap";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiEye,
  FiShare,
  FiArrowDown,
  FiArrowRightCircle,
  FiCopy,
} from "react-icons/fi";
import CatalougeModal from "./Modal"; // Create similar to CollectionModal
import { useRouter } from "next/router";
import { Share } from "@mui/icons-material";
import { Toast, ToastContainer } from "react-bootstrap";

const Catalouge = () => {
  const [show, setShow] = useState(false);
  const [catalouges, setCatalouges] = useState([]);
  const [selectedCatalouge, setSelectedCatalouge] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth);
  const router = useRouter();

  const handleClose = () => {
    setSelectedCatalouge(null);
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const getAllCatalouges = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://almsports-node-techalams-projects.vercel.app/api/catalouges/catalouges",
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      setCatalouges(response.data);
    } catch (error) {
      console.error("Error fetching catalouges:", error);
      Swal.fire("Error", "Could not fetch catalouges", "error");
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCatalouges();
  }, []);

  const handleEdit = (item) => {
    setSelectedCatalouge(item);
    handleShow();
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.post(
          "https://almsports-node-techalams-projects.vercel.app/api/catalouges/deleteCatalouge",
          { id },
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire("Deleted!", "Catalouge has been removed.", "success");
        getAllCatalouges();
      } catch (err) {
        console.error("Error deleting catalouge:", err);
        Swal.fire("Error", "Could not delete catalouge", "error");
      }
    }
  };

  const handleCopy = (id) => {
    const textToCopy = `https://almsports-front.vercel.app/viewCatalogue?id=${id}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => setShowToast(true))
        .catch(() => alert("Failed to copy"));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setShowToast(true);
      } catch {
        alert("Failed to copy");
      }
      document.body.removeChild(textArea);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <FiEye
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() =>
                router.push(
                  `addProducts?selectedCollection=${row?.original?.id}`
                )
              }
            />
            <FiEdit
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => handleEdit(row?.original)}
            />
            <FiTrash
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDelete(row?.original?.id)}
            />
            <FiCopy
              style={{ cursor: "pointer", color: "green" }}
              onClick={() => handleCopy(row?.original?.id)}
            />
          </div>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => catalouges, [catalouges]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={1500}
          autohide
        >
          <Toast.Body className="text-white">Copied!</Toast.Body>
        </Toast>
      </ToastContainer>
      <Row className="d-flex justify-content-between align-items-center px-3">
        <h5 style={{ width: "auto", margin: 0 }}>Catalouges</h5>
        <Button
          size="sm"
          variant="primary"
          onClick={handleShow}
          className="mt-2"
          style={{
            width: "35%",
            background: "linear-gradient(135deg, #43cea2, #185a9d)",
          }}
        >
          <FiPlus /> &nbsp;Add New
        </Button>
      </Row>

      <CatalougeModal
        show={show}
        handleClose={handleClose}
        getAllCatalouges={getAllCatalouges}
        selectedCatalouge={selectedCatalouge}
        setSelectedCatalouge={setSelectedCatalouge}
      />

      {loading ? (
        <div className="mt-3">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                {Array.from({ length: 3 }).map((_, i) => (
                  <th key={i}>
                    <div
                      className="skeleton-line"
                      style={{ height: "20px", width: "80%" }}
                    ></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 3 }).map((_, colIndex) => (
                    <td key={colIndex}>
                      <div
                        className="skeleton-line"
                        style={{ height: "18px", width: "100%" }}
                      ></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3">
          <table {...getTableProps()} className="table table-bordered">
            <thead className="thead-light">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No catalouges found
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Catalouge;
