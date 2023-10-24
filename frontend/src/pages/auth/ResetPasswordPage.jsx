import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const {email, token} = useParams()
  const [visible, setVisible] = useState(false);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/auth/reset-password", {email, token, password});
      setLoading(false);
      setError(false);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error.response.data);
    }
  };

   const handleForgotRequest = async (e) => {
     e.preventDefault();
     try {
       setLoading(true);
       const res = await axios.post("/auth/forgot-password", {email});
       setSuccess(res.data);
       setLoading(false);
       setError(false);
     } catch (error) {
       setSuccess(false);
       setLoading(false);
       setError(error.response.data);
     }
   };

  
  return (
    <main className="h-[100vh] flex justify-center items-center">
      <section className="p-3 max-w-lg w-full">
        <h1 className="text-3xl mb-4 text-center font-semibold">
          Reset Password
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className=" font-bold text-gray-500 capitalize"
            >
              password
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                placeholder="password"
                className="w-full bg-slate-100 p-3 rounded-lg"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute top-4 right-2">
                {visible ? (
                  <FaEye onClick={(e) => setVisible(!visible)} />
                ) : (
                  <FaEyeSlash onClick={(e) => setVisible(!visible)} />
                )}
              </div>
            </div>
          </div>

          {error ? (
            <button
              type="submit"
              disabled={loading}
              className="bg-red-700 text-white p-3 uppercase rounded-md hover:opacity-95 disabled:opacity-80"
              onClick={handleForgotRequest}
            >
              {loading ? "Loading..." : "Resend email"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-700 text-white p-3 uppercase rounded-md hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Loading..." : "Verify"}
            </button>
          )}
        </form>
        {success && <p className="text-green-700 mt-5">{success.message}</p>}
        {error && <p className="text-red-700 mt-5">Something went wrong!</p>}
      </section>
    </main>
  );
};

export default ResetPasswordPage;
