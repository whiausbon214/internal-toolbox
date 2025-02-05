"use client";

import CustomNavbar from "@/components/Navbar";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="d-flex">
          <div className="flex-grow-1" style={{ paddingTop: "100px" }}>
            <CustomNavbar />
            <Container className="mt-4">{children}</Container>
          </div>
        </div>
      </body>
    </html>
  );
}
