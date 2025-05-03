import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import dynamic from "next/dynamic";
import CollectionModal from "./Modal";
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Row } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { FiEdit, FiTrash } from "react-icons/fi";

const Collection = () => {
  const [show, setShow] = useState(false);
  const [collections, setCollections] = useState([]);
  const user = useSelector((state) => state.auth);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const handleClose = () => {
    setSelectedCollection(null);
    setShow(false)
  };
  const handleShow = () => setShow(true);

  const getAllCollections = async () => {
    try {
      const response = await axios.get(
        "https://almsports-node-techalams-projects.vercel.app/api/collections/collections",
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      console.log("All collections:", response.data);
      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
      Swal.fire({
        icon: "error",
        title: "Error fetching collections",
        text: error?.response?.data?.error || "Error fetching collections!",
      });
    }
  };

  useEffect(() => {
    getAllCollections();
  }, []);

  // Table columns definition
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
            <FiEdit
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => handleEdit(row.original)}
            />
            <FiTrash
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDelete(row.original.id)}
            />
          </div>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => collections, [collections]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

    const handleEdit = (item) => {
      console.log("Editing:", item);
      setSelectedCollection(item);
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
            'https://almsports-node-techalams-projects.vercel.app/api/collections/deleteCollection',
            {
              id: id,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.accessToken}`,
              },
            }
          );          
          Swal.fire("Deleted!", "The collection has been removed.", "success");
          getAllCollections(); // refresh the table
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error", "Could not delete collection.", "error");
        }
      }
    };
    

  return (
    <>
    <Row className="d-flex justify-content-between align-items-center px-3">
      <h5 style={{width: 'auto', margin: 0, padding: 0}}>Collections</h5>
      <Button size="sm" variant="primary" onClick={handleShow} className="mt-2" 
      style={{width: '35%', background: 'linear-gradient(135deg, #43cea2, #185a9d)'}}>
        <FiPlus /> &nbsp;Add New
      </Button>
    </Row>

      <CollectionModal
        show={show}
        setShow={setShow}
        handleClose={handleClose}
        handleShow={handleShow}
        getAllCollections={getAllCollections}
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
      />

      <div className="mt-3">
        <table {...getTableProps()} className="table table-bordered">
          <thead className="thead-light">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  No collections found
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
    </>
  );
};

export default Collection;
