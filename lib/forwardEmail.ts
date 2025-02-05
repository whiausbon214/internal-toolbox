const API_BASE_URL = "https://api.forwardemail.net/v1";
const API_KEY = process.env.NEXT_PUBLIC_FORWARD_EMAIL_API_KEY;
const DOMAIN_NAME = "list.aobgagents.com"; // ✅ Hardcoded domain

if (!API_KEY) {
  console.error("❌ ERROR: NEXT_PUBLIC_FORWARD_EMAIL_API_KEY is not set.");
}

// Utility function to encode API key for Basic Authentication
const getAuthHeader = () => {
  return `Basic ${btoa(`${API_KEY}:`)}`;
};

// Fetch all aliases (groups) for `list.aobgagents.com`
export const fetchGroups = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases`, {
      headers: {
        Authorization: getAuthHeader(),
      },
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error("❌ API Error:", response.status, response.statusText, errorData);
      } catch {
        console.error("❌ API Error:", response.status, response.statusText);
      }
      throw new Error(`Failed to fetch aliases: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Fetch Aliases Error:", error);
    return [];
  }
};

// Create a new alias (group) for `list.aobgagents.com`
export const createGroup = async (name: string, emails: string[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        name,
        recipients: emails,
      }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error("❌ API Error:", response.status, response.statusText, errorData);
      } catch {
        console.error("❌ API Error:", response.status, response.statusText);
      }
      throw new Error("Failed to create alias");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating alias:", error);
    return null;
  }
};

// Update an existing alias (group) for `list.aobgagents.com`
export const updateGroup = async (aliasId: string, name: string, emails: string[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases/${aliasId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        name,
        recipients: emails,
      }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error("❌ API Error:", response.status, response.statusText, errorData);
      } catch {
        console.error("❌ API Error:", response.status, response.statusText);
      }
      throw new Error("Failed to update alias");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating alias:", error);
    return null;
  }
};

// Delete an alias (group) for `list.aobgagents.com`
export const deleteGroup = async (aliasId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases/${aliasId}`, {
      method: "DELETE",
      headers: {
        Authorization: getAuthHeader(),
      },
    });

    // ✅ Handle case where API deletes but does not return a response
    if (response.status === 204) {
      console.log(`✅ Alias ${aliasId} deleted successfully (204 No Content).`);
      return true;
    }

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error("❌ API Error:", response.status, response.statusText, errorData);
      } catch {
        console.error("❌ API Error:", response.status, response.statusText);
      }
      throw new Error("Failed to delete alias");
    }

    console.log(`✅ Alias ${aliasId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error("❌ Error deleting alias:", error);
    return false;
  }
};
