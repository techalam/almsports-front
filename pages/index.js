import { useRouter } from "next/router";
import React from "react";
import { Card, Row, Col, Container } from "react-bootstrap";

export default function Dashboard() {
  const router = useRouter();

  const cards = [
    {
      title: "Collections",
      path: "/collections",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)", // blue-purple
    },
    {
      title: "Products",
      path: "/Products",
      gradient: "linear-gradient(135deg, #f7971e, #ffd200)", // orange-yellow
    },
    {
      title: "Catalogues",
      path: "/catalogues",
      gradient: "linear-gradient(135deg, #43cea2, #185a9d)", // green-blue
    },
    {
      title: "ALM SPORTS",
      path: "/",
      gradient: "linear-gradient(135deg, #ff6a00, #ee0979)", // pink-orange
    },
  ];

  return (
    <Container>
      <h1 className="text-center my-5">
        Under Development <br />
        <span className="text-muted">Please check back later!</span>
      </h1>
    </Container>
    // <Container className="py-5">
    //   <h2 className="mb-4 text-center fw-bold">
    //     Welcome <b>Parvez</b>
    //   </h2>
    //   <Row className="g-4 justify-content-center">
    //     {cards.map((card, idx) => (
    //       <Col key={idx} xs={6} sm={6} md={3}>
    //         <Card
    //           onClick={() => router.push(card.path)}
    //           className="text-white text-center border-0 shadow hover-card"
    //           style={{
    //             cursor: "pointer",
    //             height: "150px",
    //             borderRadius: "20px",
    //             background: card.gradient,
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "center",
    //             transition: "transform 0.2s",
    //           }}
    //         >
    //           <Card.Body
    //             style={{
    //               display: "flex",
    //               alignItems: "center",
    //               justifyContent: "center",
    //             }}
    //           >
    //             <Card.Title className="fs-5 fw-semibold">
    //               {card.title}
    //             </Card.Title>
    //           </Card.Body>
    //         </Card>
    //       </Col>
    //     ))}
    //   </Row>
    // </Container>
  );
}
