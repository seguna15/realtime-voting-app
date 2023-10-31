import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CALL_STATUS } from "../../Status";
import { signInFailure, signInStart, signInSuccess } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const LoginTokenPage = () => {
  const [otp, setOtp] = useState("");
  const [reqStatus, setReqStatus] = useState(CALL_STATUS.IDLE);
  const [reqError, setReqError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email } = useParams();
  const {loading, error} = useSelector(state => state.user);

  const handleActivation = async (e) => {
    e.preventDefault();
    try {
        dispatch(signInStart());
        const res = await axios.post("/auth/mfa-login", {
            email,
            otp,
        }, {withCredentials: true});
        const { rest, accessToken } = res.data;
        localStorage.setItem("authToken", accessToken);
        dispatch(signInSuccess(rest));
        navigate("/");
    } catch (error) {
        dispatch(signInFailure(error.response.data));
    }
        
  };

 

  const handleNewOTPRequest = async (e) => {
    e.preventDefault();
    try {
      setReqStatus(CALL_STATUS.LOADING);
      await axios.post("/auth/new-mfa-code", { email });
      setReqStatus(CALL_STATUS.SUCCESS);
      setStatus(CALL_STATUS.IDLE);
    } catch (error) {
      setReqError(error.response.data.message);
      setReqStatus(CALL_STATUS.ERROR);
    }
  };

  const reqStatusObj = {
    isLoading: reqStatus === CALL_STATUS.LOADING,
    isSuccess: reqStatus === CALL_STATUS.SUCCESS,
    isError: reqStatus === CALL_STATUS.ERROR,
  };

  return (
    <main className="h-[100vh] flex justify-center items-center">
      <section className="p-3 max-w-lg w-full">
        <h1 className="text-3xl mb-4 font-semibold">Enter MFA Code</h1>
        {error ? (
          <>
            <form className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={reqStatusObj.isLoading}
                className="bg-blue-700 text-white p-3 uppercase rounded-md hover:opacity-95 disabled:opacity-80"
                onClick={handleNewOTPRequest}
              >
                {reqStatusObj.isLoading
                  ? "Loading..."
                  : "Resend activation email"}
              </button>
            </form>
            {reqStatusObj.isError && (
              <p className="text-red-700 mt-5">{reqError}</p>
            )}
          </>
        ) : (
          <>
            <small className="text-gray-700 text-base">
              Check {email} for MFA code
            </small>
            <form className="flex flex-col gap-4" onSubmit={handleActivation}>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="otp"
                  className=" font-bold text-gray-500 uppercase"
                >
                  MFA Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="MFA Code"
                    className="w-full bg-slate-100 p-3 rounded-lg"
                    id="otp"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-700 text-white p-3 uppercase rounded-md hover:opacity-95 disabled:opacity-80"
                onClick={handleActivation}
              >
                {loading ? "Loading..." : "Activate"}
              </button>
            </form>
            {error && <p className="text-red-700 mt-5">{error}</p>}
          </>
        )}
      </section>
    </main>
  );
};

export default LoginTokenPage;
