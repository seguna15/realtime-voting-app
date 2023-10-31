import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import { CALL_STATUS } from "../Status";

const SignUp = ({data}) => {
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState(CALL_STATUS.IDLE);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false)
  
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, role: data.role, [e.target.id]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      setStatus(CALL_STATUS.LOADING);
      const res = await axios.post("/auth/signup", formData);
      if(res?.data.activation === 'Next'){
        navigate(`/capture/${res.data.email}`);
      }
    } catch (error) {
      setError(error.response.data.message);
      setStatus(CALL_STATUS.ERROR);
    }
  };

  const statusObj = {
    isLoading: status === CALL_STATUS.LOADING,
    isSuccess: status === CALL_STATUS.SUCCESS,
    isError: status === CALL_STATUS.ERROR,
  };

  return (
    
    <>
    
      <h1 className="text-3xl text-center font-semibold">{data.title}</h1>
      <form className="flex flex-col gap-4" onSubmit={handleRegistration}>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className=" font-bold text-gray-500 capitalize"
          >
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-slate-100 p-3 rounded-lg"
            id="username"
            onChange={handleChange}
          />
        </div>
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
          {statusObj.isLoading ? "Loading..." : "Sign Up"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>
      {statusObj.isError && <p className="text-red-700 mt-5">{error}</p>}
    </>
   
  );
};

export default SignUp;
