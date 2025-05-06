const baseURL = process.env.NEXT_PUBLIC_API_URL

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Gửi cookie (chứa token) tự động
    })

    return response.json()
  },

  async post(endpoint, body) {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    })

    return response.json()
  },
}

export async function fetchUserData() {
  try {
    return await apiClient.get("/user")
  } catch (error) {
    console.error("Error fetching user data:", error)
    throw error
  }
}
