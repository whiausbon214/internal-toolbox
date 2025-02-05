import React from "react";
import Link from "next/link";
import { Container, Navbar as BootstrapNavbar, Nav } from "react-bootstrap";
import Image from "next/image";
import { HouseDoor, Server, Cloud, EnvelopeAtFill, List, User } from "react-bootstrap-icons"; // Icons for menu items

const CustomNavbar: React.FC = () => {
  return (
    <BootstrapNavbar bg="dark" variant="light" expand="lg" fixed="top">
      <Container>
        {/* Logo on the left */}
        <BootstrapNavbar.Brand as={Link} href="/">
          <Image src="/logo_admin.png" alt="Company Logo" width={100} height={50} />
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        <BootstrapNavbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {/* Menu Links with Icons */}
            <Nav.Link as={Link} href="/" className="text-white">
              <HouseDoor className="me-2" />Home
            </Nav.Link>
            <Nav.Link as={Link} href="/commission-groups" className="text-white">
              <EnvelopeAtFill className="me-2" />Commission Groups
            </Nav.Link>
            <Nav.Link as={Link} href="/mailing-list" className="text-white">
              <List className="me-2" /> ACA Mailing List
            </Nav.Link>
            <Nav.Link as={Link} href="/cloud-status" className="text-white">
              <Cloud className="me-2" />Cloud Status
            </Nav.Link>
          
            {/* Avatar (GIF) on the right */}
            <Nav.Item className="ms-3">
              <Image
                src="/avatar.jpg"
                alt="Meowdy!"
                width={50}
                height={50}
                className="rounded-circle"
              />
            </Nav.Item>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default CustomNavbar;
