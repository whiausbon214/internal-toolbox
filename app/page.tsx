import React from "react";
import { Card } from "react-bootstrap";

export default function Home() {
  return (
    <Card className="p-4 shadow">
      <h1 className="text-primary">Welcome to the Dashboard</h1>
      <p className="text-muted mt-2">This is a test page to verify Bootstrap 5 layout.</p>
    </Card>
  );
};