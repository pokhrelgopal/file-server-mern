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
  } catch (error) {
    console.error("Error in loginUser:", error);
    return null;
  }
}

export async function getMe() {
  try {
    const response = await fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    });
    const data = await response.json();
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
  } catch (error) {
    console.error("Error in logoutUser:", error);
  }
}
