import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Carousel, Container, Row, Col, Image } from "react-bootstrap";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const ProductDetail = () => {
  const router = useRouter();
  const id = router?.query?.id; // expects route like /product/:id
  const [product, setProduct] = useState(null);
  const user = useSelector((state) => state.auth);

  const getProductDetails = async () => {
    try {
      const response = await axios.get(
        `https://almsports-node-techalams-projects.vercel.app/api/products/productsById?id=${id}`
      );
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.error || "Failed to load product.",
      });
    }
  };

  useEffect(() => {
    if (!id) return;
    getProductDetails();
  }, [id]);

  if (!product) {
    return <div className="text-center mt-5">Loading product...</div>;
  }

  // If images are stored as a comma-separated string, split it
  const imageList = product.images
    ? Array.isArray(product.images)
      ? product.images
      : product.images.split(",")
    : ["https://via.placeholder.com/600x400"];

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Carousel interval={null} indicators={true} controls={true}>
            {imageList.map((img, index) => (
              <Carousel.Item key={index}>
                <div
                  style={{
                    height: "400px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9", // Optional: nice fallback background
                  }}
                >
                  <Image
                    className="d-block"
                    src={img.trim() || "./images/noImg.webp"}
                    alt={`Slide ${index + 1}`}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop if fallback fails
                      e.target.src = "./images/noImg.webp"; // Fallback image
                    }}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        <Col md={6}>
          <h2>{product.name}</h2>
          <p style={{ wordBreak: "break-all" }} className="text-muted">
            {product.description || "No description available."}
          </p>
          <h4>Rs: {product.price}</h4>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
