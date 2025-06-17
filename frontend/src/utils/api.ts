// Utility to get the correct API base URL
export const getApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  // Remove trailing slash if present
  return apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl
}

// Utility for Google OAuth URLs
export const getGoogleAuthUrl = (userType: "buyer" | "artist") => {
  const baseUrl = getApiBaseUrl()
  return `${baseUrl}/auth/google/${userType}`
}
