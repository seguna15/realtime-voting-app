import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {FaEyeSlash, FaEye} from 'react-icons/fa';
import axios from "axios";


const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/auth/forgot-password", formData);
      setSuccess(res.data);
      setLoading(false);
      setError(false);
    } catch (error) {
      setSuccess(false);
      setLoading(false);
      setError(error.response.data);
    }
  };

  const [visible, setVisible] = useState(false);
  return (
    <main className="h-[100vh] flex justify-center items-center">
      <section className="p-3 max-w-lg w-full">
        <h1 className="text-3xl mb-4 text-center font-semibold">Forgot Password</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className=" font-bold text-gray-500 capitalize"
            >
              email
            </label>
            <input
              type="email"
              placeholder="email"
              className="w-full bg-slate-100 p-3 rounded-lg"
              id="email"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-slate-700 text-white p-3 uppercase rounded-md hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </form>
        {success && <p className='text-green-700 mt-5'>{success.message}</p>}
        {error && <p className="text-red-700 mt-5">{error.message}</p>}
      </section>
    </main>
  );
};

export default ForgotPasswordPage