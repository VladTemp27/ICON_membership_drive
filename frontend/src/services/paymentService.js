// services/paymentService.js
import axios from "axios";
import { getToken } from "./authService";

const API_URL = "https://apicon.lestat.cloud/api/v2";

export async function getPayments() {
  const token = getToken();
  const res = await axios.get(`${API_URL}/payments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updatePaymentStatus(paymentId, status) {
  const token = getToken();
  const res = await axios.put(
    `${API_URL}/payments/${paymentId}`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}



