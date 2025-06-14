import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Spinner,
  InputGroup,
  Image,
} from "react-bootstrap";
import { useRouter } from "next/router";
import { endpoint } from "@/utils/factory";

const ViewCatalogue = ({ id }) => {
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsOpen, setRowsOpen] = useState({});
  const router = useRouter();

  const getCatalogueProducts = async (search = "") => {
    try {
      const response = await axios.get(
        `${endpoint?.baseUrl}/api/catalouges/getProductsUnderCatalouge`,
        {
          params: {
            catalogueId: id,
            name: search,
          },
        }
      );
      setGroupedProducts(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error fetching catalogue products",
        text: error?.response?.data?.error || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getCatalogueProducts();
    }
  }, [id]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    getCatalogueProducts(value);
  };

  return (
    <Container className="py-4">
      <Form className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search product by name..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </Form>

      {loading ? (
        <Row
            style={{
              flexWrap: "wrap",
              overflow: "auto",
            }}
            xs={1}
            sm={2}
            md={3}
            lg={4}
            className="mt-2 g-4 d-flex align-items-center justify-content-between"
          >
        {[...Array(6)].map((_, index) => (
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
              ))}
              </Row>
      ) : groupedProducts.length === 0 ? (
        <p>No products found in this catalogue.</p>
      ) : (
        groupedProducts.map((group) => (
          <div key={group.name} className="mb-5">
            <h4 style={{color: '#185a9d'}}>{group.name}</h4>
            <Row
              style={{
                flexWrap: rowsOpen[group?.name] ? "wrap" : "nowrap",
                overflow: "auto",
              }}
              xs={1}
              sm={2}
              md={3}
              lg={4}
              className="mt-2 g-4 d-flex align-items-center justify-content-between"
            >
              {group.products.map((product) => (
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
                      (product.images && product.images[0]) ||
                      "./images/noImg.webp"
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
            <Row className="d-flex justify-content-center align-items-center mt-2">
              <Col xs={12} className="text-center">
                <button
                  className="btn btn-link"
                  onClick={() =>
                    setRowsOpen((prev) => ({
                      ...prev,
                      [group.name]: !prev[group.name],
                    }))
                  }
                >
                  {group?.products?.length > 2 && (rowsOpen[group.name] ? "Show Less" : "Show More")}
                </button>
              </Col>
            </Row>
          </div>
        ))
      )}
    </Container>
  );
};

export default ViewCatalogue;
