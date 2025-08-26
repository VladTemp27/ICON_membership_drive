import axios from "axios";

const API_URL = "https://apicon.lestat.cloud/api/v2";

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token); // save token
  }
  return res.data;
}

export async function authorize(){
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await axios.post(`${API_URL}/auth/authorize`, {},{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Authorization response:", res.data);
    return res.data.authorized;
  } catch (error) {
    console.error("Authorization error:", error);
    return false;
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}
