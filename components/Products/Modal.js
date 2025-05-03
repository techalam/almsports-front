import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { MenuItem, Select } from "@mui/material";
import Swal from "sweetalert2";

const ProductModal = ({
  show,
  handleClose,
  selectedProduct,
  saveProduct,
  updateProduct,
  collections,
  user,
}) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [errors, setErrors] = useState({});

  // Load selected product if editing
  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.name || "");
      setProductDescription(selectedProduct.description || "");
      setProductPrice(selectedProduct.price || "");
      setProductCategory(selectedProduct.category || "");
      setProductImages(selectedProduct.images || []);
    } else {
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductCategory("");
      setProductImages([]);
    }
  }, [selectedProduct]);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const uploadPromises = files.map((file) => uploadToCloudinary(file));

    const imageUrls = await Promise.all(uploadPromises);
    const validUrls = imageUrls.filter(Boolean); // Remove failed uploads
    setProductImages((prev) => [...prev, ...validUrls]);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "products"); // <- replace
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/ddmmklctb/image/upload", // <- replace
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleRemoveImage = (url) => {
    setProductImages((prev) => prev.filter((img) => img !== url));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!productName) newErrors.productName = "Product name is required.";
    if (!productDescription) newErrors.productDescription = "Description is required.";
    if (!productPrice || isNaN(productPrice) || productPrice <= 0)
      newErrors.productPrice = "Price must be a positive number.";
    if (!productCategory) newErrors.productCategory = "Category is required.";
    if (productImages.length === 0) newErrors.productImages = "At least one image is required.";

    setErrors(newErrors);

    // If there are any errors, return false (validation failed)
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate all fields before submitting
    if (!validateFields()) {
      return;
    }

    const data = {
      name: productName,
      description: productDescription,
      price: productPrice,
      category: productCategory,
      images: productImages,
    };
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, data);
      } else {
        await saveProduct(data);
      }
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: selectedProduct ? "Product updated successfully" : "Product created successfully",
      });
      handleClose(); // Close modal after successful submission
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while saving the product.",
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedProduct ? "Update Product" : "Create Product"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              isInvalid={!!errors.productName}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.productName}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              isInvalid={!!errors.productDescription}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.productDescription}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              isInvalid={!!errors.productPrice}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.productPrice}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              style={{ width: "100%", height: "40px" }}
              displayEmpty
            >
              <MenuItem value="">Select category</MenuItem>
              {collections.map((col) => (
                <MenuItem key={col.value} value={col.label}>
                  {col.label}
                </MenuItem>
              ))}
            </Select>
            {errors.productCategory && (
              <div className="text-danger mt-1">{errors.productCategory}</div>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleImageUpload}
              isInvalid={!!errors.productImages}
            />
            {errors.productImages && (
              <div className="text-danger mt-1">{errors.productImages}</div>
            )}
            <div className="d-flex flex-wrap mt-2">
              {productImages?.map((url, i) => (
                <div key={i} style={{ position: "relative", marginRight: 10 }}>
                  <img
                    src={url}
                    alt="Product"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveImage(url)}
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      padding: 2,
                      borderRadius: "50%",
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {selectedProduct ? "Update Product" : "Save Product"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
