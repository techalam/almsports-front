import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Carousel, Container, Row, Col, Image } from "react-bootstrap";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const ProductDetail = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const [product, setProduct] = useState(null);
  const user = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const getProductDetails = async () => {
    try {
      setLoading(true);
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
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getProductDetails();
  }, [id]);

  // 🟡 Show skeleton if loading
  if (loading) {
    return (
      <Container className="mt-4">
        <Row>
          <Col md={6}>
            <div className="skeleton-box" style={{ height: "400px", width: "100%" }} />
          </Col>
          <Col md={6} className="mt-3">
            <div className="skeleton-line" style={{ width: "70%", height: "30px", marginBottom: "10px" }} />
            <div className="skeleton-line" style={{ width: "100%", height: "80px", marginBottom: "10px" }} />
            <div className="skeleton-line" style={{ width: "30%", height: "25px" }} />
          </Col>
        </Row>
      </Container>
    );
  }

  // If images are stored as a comma-separated string, split it
  const imageList = product?.images
    ? Array.isArray(product?.images)
      ? product?.images
      : product?.images.split(",")
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
                    backgroundColor: "#f9f9f9",
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
                      e.target.onerror = null;
                      e.target.src = "./images/noImg.webp";
                    }}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        <Col md={6}>
          <h2>{product?.name}</h2>
          <p style={{ wordBreak: "break-all" }} className="text-muted">
            {product?.description || "No description available."}
          </p>
          <h4>Rs: {product?.price}</h4>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
