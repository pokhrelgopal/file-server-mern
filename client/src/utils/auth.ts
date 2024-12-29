export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  } catch (error) {
    console.error("Error in loginUser:", error);
    return null;
  }
}

export async function getMe() {
  try {
    console.log("Making getMe request...");
    const response = await fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Error in getMe:", error);
    return null;
  }
}

export async function logoutUser() {
  try {
    const response = await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    return response.json();
  } catch (error) {
    console.error("Error in logoutUser:", error);
  }
}
