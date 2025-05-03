import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FiEye } from "react-icons/fi";
import { useRouter } from "next/router";

function AddProductsToCatalouge({ selectedCollection }) {
  const user = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://almsports-node-techalams-projects.vercel.app/api/products/products?category=`,
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
      setTotalProducts(response.headers["x-total-count"]);
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

  useEffect(() => {
    getAllProducts();
  }, [selectedCollection, currentPage, searchTerm]);

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSaveSelectedProducts = async () => {
    if (!selectedProducts.length) {
      Swal.fire("Validation", "Please select at least one product.", "warning");
      return;
    }

    try {
      const response = await axios.post(
        "https://almsports-node-techalams-projects.vercel.app/api/catalouges/addProductToCatalouge",
        {
          id: selectedCollection,
          productIds: selectedProducts,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire(
          "Success",
          "Products added to catalouge successfully!",
          "success"
        );
        setSelectedProducts([]);
        getAllProducts();
      }
    } catch (error) {
      console.error("Error saving products:", error);
      Swal.fire({
        icon: "error",
        title: "Error saving products",
        text:
          error?.response?.data?.error ||
          "Could not save products to catalouge.",
      });
    }
  };

  return (
    <div className="container">
      <Button
        size="sm"
        className="mb-2"
        style={{ background: "linear-gradient(135deg, #43cea2, #185a9d)" }}
        onClick={() =>
          router.push(`/viewCatalogue?id=${router?.query?.selectedCollection}`)
        }
      >
        <FiEye /> View Catalogue
      </Button>
      <h3>Add Products to Catalouge</h3>
      <Form.Control
        type="text"
        placeholder="Search products by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="my-3"
      />

      {loading ? (
        <div className="mt-3">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                {Array.from({ length: 4 }).map((_, i) => (
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
                  {Array.from({ length: 4 }).map((_, colIndex) => (
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
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Select</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              {/* Add more columns if needed */}
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No products found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <div className="d-flex justify-content-between align-items-center">
        <Button
          variant="primary"
          onClick={handleSaveSelectedProducts}
          disabled={selectedProducts.length === 0}
          style={{ background: "linear-gradient(135deg, #43cea2, #185a9d)" }}
        >
          Save Selected Products
        </Button>

        {/* Simple pagination */}
        <div>
          Page:{" "}
          <Button
            variant="light"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            &lt;
          </Button>{" "}
          {currentPage}{" "}
          <Button
            variant="light"
            disabled={currentPage * productsPerPage >= totalProducts}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddProductsToCatalouge;
