import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";

import { CALL_STATUS } from "../../Status";

const SignInPage = () => {
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState(CALL_STATUS.IDLE);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus(CALL_STATUS.LOADING)
      const res = await axios.post("/auth/login", formData, {withCredentials: true});
      setStatus(CALL_STATUS.SUCCESS)
      
      if(res.data.status ==='activated'){
        return navigate(`/sign-in/${res.data.email}`);
      }

      if(res.data.status === 'pending'){
        return navigate(`/activation/${res.data.email}`);
      }
      
    } catch (error) {
      console.log(error);
      setStatus(CALL_STATUS.ERROR);
      setError(error.response.data.message);
    }
  };

  const statusObj = {
    isLoading: status === CALL_STATUS.LOADING,
    isSuccess: status === CALL_STATUS.SUCCESS,
    isError: status === CALL_STATUS.ERROR,
  };

  const [visible, setVisible] = useState(false);
  return (
    <main className="h-[100vh] flex justify-center items-center">
      <section className="p-3 max-w-lg w-full">
        <h1 className="text-3xl text-center font-semibold">Sign In</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className=" font-bold text-gray-500 capitalize "
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
                onChange={handleChange}
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
          <button
            type="submit"
            disabled={statusObj.isLoading}
            className="bg-slate-700 text-white p-3 uppercase rounded-md hover:opacity-95 disabled:opacity-80"
          >
            {statusObj.isLoading ? "Loading..." : "Sign In"}
          </button>
        </form>
        <div className="flex flex-col md:flex-row  gap-2 justify-between mt-5">
          <div className="flex   gap-2">
            <p>Do not have an account?</p>
            <Link to="/sign-up">
              <span className="text-blue-500 hover:text-blue-400">Sign up</span>
            </Link>
          </div>
          <Link
            to="/forgot-password"
            className="text-blue-500 hover:text-blue-400"
          >
            Forgot password?
          </Link>
        </div>
        <p className="text-red-700 mt-5">
          {statusObj.isError ? error || "Something went wrong!" : ""}
        </p>
      </section>
    </main>
  );
};

export default SignInPage;
