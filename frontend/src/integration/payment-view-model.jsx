import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function usePaymentViewModel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user: "", // user id? like 2233259?
    amount: "",
    paymentMethod: "",
    transactionId: "",
    remarks: "Membership fee payment",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (paymentData) => {
    setLoading(true);
    setResponseMessage("");

    try {
      const response = await axios.post("https://apicon.lestat.cloud/api/v2/payments", paymentData);
      setResponseMessage("Payment successful!");
      console.log("API response:", response.data);
      localStorage.setItem('transactionId', response.data._id);
      navigate("/check-your-email");
    } catch (error) {
      setResponseMessage("Error payment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    responseMessage,
    handleSubmit,
  };
}
