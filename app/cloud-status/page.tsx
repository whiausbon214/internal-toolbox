"use client";

import React, { useEffect, useState } from "react";
import { Container, Table, Badge, Spinner } from "react-bootstrap";

const API_ROUTE = "/api/digitalocean/status";

const CloudStatusPage = () => {
    const [data, setData] = useState({
        droplets: [],
        apps: [],
        databases: [],
        firewalls: [],
        vpcs: [],
        network_interfaces: [],
        cdn_endpoints: [],
        incidents: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_ROUTE);
                const result = await response.json();
                setData({
                    droplets: result.droplets || [],
                    apps: result.apps || [],
                    databases: result.databases || [],
                    firewalls: result.firewalls || [],
                    vpcs: result.vpcs || [],
                    network_interfaces: result.network_interfaces || [],
                    cdn_endpoints: result.cdn_endpoints || [],
                    incidents: result.incidents || [],
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cloud status:", error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Auto-refresh every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <Container fluid className="mt-4">
            <h1 className="text-center">Cloud Status</h1>
            <p className="text-center text-muted">Real-time status of DigitalOcean infrastructure.</p>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    {/* Droplets */}
                    <h3 className="mt-4">Droplets</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Region</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.droplets.length > 0 ? (
                                data.droplets.map((droplet: any) => (
                                    <tr key={droplet.id}>
                                        <td>{droplet.name}</td>
                                        <td>
                                            <Badge bg={droplet.status === "active" ? "success" : "danger"}>
                                                {droplet.status}
                                            </Badge>
                                        </td>
                                        <td>{droplet.region.slug.toUpperCase()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="text-center">No Data Available</td></tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Apps */}
                    <h3 className="mt-4">Apps</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.apps.length > 0 ? (
                                data.apps.map((app: any) => (
                                    <tr key={app.id}>
                                        <td>{app.spec.name}</td>
                                        <td>
                                            <Badge bg={app.status === "running" ? "success" : "success"}>running</Badge>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="2" className="text-center">No Data Available</td></tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Incident History */}
                    <h3 className="mt-4">Incident History</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.incidents.length > 0 ? (
                                data.incidents.map((incident: any) => (
                                    <tr key={incident.id}>
                                        <td>{incident.name}</td>
                                        <td>
                                            <Badge bg={incident.status === "resolved" ? "success" : "warning"}>{incident.status}</Badge>
                                        </td>
                                        <td>{new Date(incident.updated_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="text-center">No Incidents Reported</td></tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Databases */}
                    <h3 className="mt-4">Databases</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Engine</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.databases.map((db: any) => (
                                <tr key={db.id}>
                                    <td>{db.name}</td>
                                    <td>{db.engine}</td>
                                    <td><Badge bg={db.status === "online" ? "success" : "warning"}>{db.status}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Firewalls */}
                    <h3 className="mt-4">Firewalls</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Inbound Rules</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.firewalls.map((fw: any) => (
                                <tr key={fw.id}>
                                    <td>{fw.name}</td>
                                    <td>{fw.inbound_rules.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* VPCs */}
                    <h3 className="mt-4">VPCs</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Region</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.vpcs.map((vpc: any) => (
                                <tr key={vpc.id}>
                                    <td>{vpc.name}</td>
                                    <td>{vpc.region}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </Container>
    );
};

export default CloudStatusPage;
