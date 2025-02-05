import { NextResponse } from "next/server";

const DIGITALOCEAN_API_BASE = "https://api.digitalocean.com/v2";
const API_KEY = process.env.DIGITALOCEAN_API_KEY;

export async function GET() {
  try {
    const headers = { Authorization: `Bearer ${API_KEY}` };

    const fetchData = async (endpoint: string) => {
      const response = await fetch(`${DIGITALOCEAN_API_BASE}/${endpoint}`, { headers });
      return response.ok ? await response.json() : {};
    };

    const [
      dropletsData,
      appsData,
      databasesData,
      firewallsData,
      vpcsData,
      networkData,
      cdnData,
      incidentsData
    ] = await Promise.all([
      fetchData("droplets"),
      fetchData("apps"),
      fetchData("databases"),
      fetchData("firewalls"),
      fetchData("vpcs"),
      fetchData("network_interfaces"),
      fetchData("cdn/endpoints"),
      fetchData("https://status.digitalocean.com/api/v2/incidents.json"), // Fetching from external DO status API
    ]);

    return NextResponse.json({
      droplets: dropletsData.droplets || [],
      apps: appsData.apps || [],
      databases: databasesData.databases || [],
      firewalls: firewallsData.firewalls || [],
      vpcs: vpcsData.vpcs || [],
      network_interfaces: networkData.network_interfaces || [],
      cdn_endpoints: cdnData.endpoints || [],
      incidents: incidentsData.incidents || [],
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch DigitalOcean data", details: error }, { status: 500 });
  }
}
