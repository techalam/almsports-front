import React, { useEffect, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { FiDelete, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import ProductModal from "./Modal";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import { Backdrop, CircularProgress, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/router";
import { endpoint } from "@/utils/factory";

const ProductsComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productsPerPage] = useState(10); // You can adjust this value
  const user = useSelector((state) => state.auth);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const router = useRouter();
  console.log("user is", user);

  // Open the modal for adding a new product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    console.log("Editing product:", product);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handle product save
  const saveProduct = async (productData) => {
    try {
      const response = await axios.post(
        `${endpoint?.baseUrl}/api/products/createProduct`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      console.log("Product created:", response.data);
      Swal.fire({
        icon: "success",
        title: "Product Created",
        text: `Product "${response.data.name}" was successfully created.`,
      });

      getAllProducts(); // Refresh product list
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.error("Error creating product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.error || "Failed to create product.",
      });
    }
  };

  // Handle product update
  const updateProduct = async (prodId, productData) => {
    try {
      const response = await axios.post(
        `${endpoint?.baseUrl}/api/products/updateProduct`,
        {...productData, id: prodId},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      console.log("Product updated:", response.data);
      Swal.fire({
        icon: "success",
        title: "Product updated",
        text: `Product "${response.data.name}" was successfully updated.`,
      });

      getAllProducts(); // Refresh product list
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.error("Error creating product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.error || "Failed to create product.",
      });
    }
  };

   // delete product
    const handleDelete = async (prodId) => {
      if (!prodId) return;
  
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
          setOpen(true);
          await axios.post(`${endpoint.baseUrl}/api/products/deleteProduct`,
            { id: prodId },
            {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          });
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
          getAllProducts();
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error", "Failed to delete product.", "error");
        }
        finally {
          setOpen(false);
        }
      }
    };

  // Fetch all products with pagination and search
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${endpoint?.baseUrl}/api/products/products?category=${
          selectedCollection || ""
        }`,
        {
          params: {
            limit: productsPerPage,
            offset: (currentPage - 1) * productsPerPage,
            name: searchTerm,
          },
        }
      );
      setProducts(response.data);
      setTotalProducts(response.headers["x-total-count"]); // Assuming you send the total count in the header
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({
        icon: "error",
        title: "Error fetching products",
        text: error?.response?.data?.error || "Error fetching products!",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAllCollections = async () => {
    try {
      const response = await axios.get(
        `${endpoint?.baseUrl}/api/products/collections`
      );
      console.log("All collections:", response.data);
      const collectionData = response?.data?.map((collection) => ({
        value: collection.name,
        label: collection.name,
      }));
      setCollections(collectionData);
      return response.data;
    } catch (error) {
      console.error("Error fetching collections:", error);
      Swal.fire({
        icon: "error",
        title: "Error fetching collections",
        text: error?.response?.data?.error || "Error fetching collections!",
      });
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  // Handle pagination button click
  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch products whenever the component is mounted or search/query/page changes
  useEffect(() => {
    getAllProducts();
  }, [searchTerm, currentPage, selectedCollection]);

  useEffect(() => {
    getAllCollections();
  }, []);

  return (
    <>
      <Row className="d-flex justify-content-between align-items-center px-3">
        <h5 style={{ width: "auto", margin: 0, padding: 0 }}>Products</h5>
        {user?.user && (
          <Button
            size="sm"
            variant="primary"
            className="mt-2"
            style={{
              width: "35%",
              background: "linear-gradient(135deg, #43cea2, #185a9d)",
              border: "none",
            }}
            onClick={handleAddProduct}
          >
            <FiPlus /> &nbsp;Add New
          </Button>
        )}
      </Row>

      {/* Search Input */}
      <Form.Control
        className="mt-3 p-2"
        type="text"
        placeholder="Search Product Name"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <Row className="d-flex justify-content-end align-items-center mt-2 px-3">
        <Select
          value={selectedCollection}
          onChange={(e) => {
            setSelectedCollection(e.target.value);
            setCurrentPage(1); // Reset to page 1 on collection change
          }}
          style={{ width: "50%", height: "30px" }}
          className="m-0 p-0"
          displayEmpty // Optional: to show "All" when no selection
        >
          <MenuItem value="">All</MenuItem>
          {collections.map((collection) => (
            <MenuItem key={collection.value} value={collection.value}>
              {collection.label}
            </MenuItem>
          ))}
        </Select>
      </Row>

      {/* Products List */}
      <Row
        style={{
          flexWrap: "wrap",
          overflow: "auto",
        }}
        className="mt-2 g-4 d-flex wrap align-items-center justify-content-center"
        xs={1}
        sm={2}
        md={3}
        lg={4}
      >
        {loading
          ? [...Array(6)].map((_, index) => (
              <Col
                xs={5}
                sm={5}
                md={5}
                lg={5}
                key={index}
                style={{ height: "200px" }}
                className="shadow-sm rounded-3 m-2 border-0"
              >
                <div
                  className="skeleton-img mb-2"
                  style={{
                    height: "120px",
                    width: "90%",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    margin: "0 auto",
                  }}
                ></div>
                <div
                  className="skeleton-text mb-1"
                  style={{
                    height: "20px",
                    width: "80%",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    margin: "0 auto",
                  }}
                ></div>
                <div
                  className="skeleton-text"
                  style={{
                    height: "20px",
                    width: "40%",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    margin: "0 auto",
                  }}
                ></div>
              </Col>
            ))
          : products.map((product) => (
              <Col
                xs={5}
                sm={5}
                md={5}
                lg={5}
                key={product.id}
                style={{
                  height: "200px",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => {
                  router.push(`/productDetails?id=${product.id}`);
                }}
                className="shadow-sm rounded-3 m-2 border-0"
              >
                {user?.user && (
                  <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "transparent",
                      width: "100%",
                      display: "flex",
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      zIndex: 10,
                    }}>
                  <Button
                  size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProduct(product);
                    }}
                    style={{
                      backgroundColor: "transparent",
                      color: "black",
                      border: "none",
                    }}
                    className="flex justify-center align-middle"
                  >
                    <FiEdit />
                  </Button>
                  <Button
                  size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product?.id);
                    }}
                    style={{
                      backgroundColor: "transparent",
                      color: "red",
                      border: "none",
                    }}
                    className="flex justify-center align-middle"
                  >
                    <FiTrash />
                  </Button>
                  </div>
                  
                )}
                <Image
                  style={{
                    height: "120px",
                    width: "90%",
                    objectFit: "contain",
                  }}
                  src={
                    (product.images && product.images[0]) ||
                    "./images/noImg.webp"
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "./images/noImg.webp";
                  }}
                />
                <h6
                  style={{
                    fontWeight: "lighter",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.name}
                </h6>
                <h6>Rs: {product.price}</h6>
              </Col>
            ))}
      </Row>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-3">
        <Button
          variant="outline-primary"
          onClick={() => handlePagination(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="mx-2">{currentPage}</span>
        <Button
          variant="outline-primary"
          onClick={() => handlePagination(currentPage + 1)}
          disabled={currentPage * productsPerPage >= totalProducts}
        >
          Next
        </Button>
      </div>

      {/* Product Modal */}
      <ProductModal
        show={showModal}
        handleClose={handleCloseModal}
        selectedProduct={selectedProduct}
        saveProduct={saveProduct}
        updateProduct={updateProduct}
        collections={collections}
        getAllProducts={getAllProducts}
      />
      <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
    </>
  );
};

export default ProductsComponent;
