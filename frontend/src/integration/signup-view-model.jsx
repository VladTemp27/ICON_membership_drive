import { useState } from "react";
import axios, {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";

export function useSignupViewModel(type) {
  const [form, setForm] = useState({
    name: "",
    idNumber: "",
    email: "",
    course:"",
    year:""
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");


    try {
      if(type === "renewal"){
        console.log("Renewal form submitted:", form.id);
        const renewalForm = form;
        delete renewalForm.idNumber;
        const response = await axios.put(`https://apicon.lestat.cloud/api/v2/members/${form.id}`, renewalForm);
        setResponseMessage("Account created successfully!");
        console.log("API response:", response.data);
        localStorage.setItem("memberData", JSON.stringify(response.data));
        navigate('/payment-option');
      }else{
        const response = await axios.post("https://apicon.lestat.cloud/api/v2/members", form);
        setResponseMessage("Account created successfully!");
        console.log("API response:", response.data);
        localStorage.setItem("memberData", JSON.stringify(response.data));
        navigate('/payment-option');
      }
    } catch (error) {
      console.log(error instanceof AxiosError)
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 409) {
          setResponseMessage("Error: Email already exists");
          return;
        } else {
          setResponseMessage("Error creating account: " + (error.response?.data?.error || error.message));
          return;
        }
      }
      setResponseMessage("Error creating account");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    responseMessage,
    handleChange,
    handleSubmit,
  };
}
