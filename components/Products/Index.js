import React, { useEffect, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import ProductModal from "./Modal";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import { MenuItem, Select } from "@mui/material";
import { useRouter } from "next/router";

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
  const router = useRouter();
  // Open the modal for adding a new product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handle product save
  const saveProduct = async (productData) => {
    try {
      const response = await axios.post(
        "https://almsports-node-techalams-projects.vercel.app/api/products/createProduct", // Adjust if your endpoint differs
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
  const updateProduct = (productId, productData) => {
    console.log("Product updated:", productId, productData);
    handleCloseModal();
  };

  // Fetch all products with pagination and search
  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `https://almsports-node-techalams-projects.vercel.app/api/products/products?category=${
          selectedCollection || ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
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
    }
  };

  const getAllCollections = async () => {
    try {
      const response = await axios.get(
        "https://almsports-node-techalams-projects.vercel.app/api/products/collections",
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
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
        <Button
          size="sm"
          variant="primary"
          className="mt-2"
          style={{ width: "35%", background: 'linear-gradient(135deg, #43cea2, #185a9d)', border: 'none' }}
          onClick={handleAddProduct}
        >
          <FiPlus /> &nbsp;Add New
        </Button>
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
          onChange={(e) => setSelectedCollection(e.target.value)}
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
      <Row style={{
                flexWrap: "wrap",
                overflow: "auto",
              }} className="mt-2 g-4 d-flex wrap align-items-center justify-content-center" xs={1}
              sm={2}
              md={3}
              lg={4}>
        {products.map((product) => (
          <Col
            xs={5}
            sm={5}
            md={5}
            lg={5}
            key={product.id}
            style={{ height: "200px", cursor: "pointer" }}
            onClick={() => {
              router.push(`/productDetails?id=${product.id}`);
            }}
            className="shadow-sm rounded-3 m-2 border-0"
          >
            <Image
             style={{
              height: "120px",
              width: "90%",
              objectFit: "contain",
            }}
              src={
                (product.images && product.images[0]) || "./images/noImg.webp"
              }
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop if fallback fails
                e.target.src = "./images/noImg.webp"; // Fallback image
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
    </>
  );
};

export default ProductsComponent;
