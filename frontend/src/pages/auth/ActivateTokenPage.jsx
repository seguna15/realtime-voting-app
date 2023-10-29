import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CALL_STATUS } from "../../Status";

const ActivateTokenPage = () => {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(CALL_STATUS.IDLE);
  const [error, setError] = useState(null);
  const [reqStatus, setReqStatus] = useState(CALL_STATUS.IDLE);
  const [reqError, setReqError] = useState(null);
  const navigate = useNavigate();
  const { email } = useParams();


  const handleActivation = async (e) => {
    e.preventDefault();
    try {
      setStatus(CALL_STATUS.IDLE);
      await axios.post("/auth/activate", {
        email,
        otp,
      });
      setStatus(CALL_STATUS.SUCCESS);
    } catch (error) {
      setError(error.response.data.message);
      setStatus(CALL_STATUS.ERROR)
    }
  };

  const statusObj = {
    isLoading: status === CALL_STATUS.LOADING,
    isSuccess: status === CALL_STATUS.SUCCESS,
    isError: status === CALL_STATUS.ERROR,
  };

  if (statusObj.isSuccess) {
    navigate("/sign-in");
  }

  const handleNewOTPRequest = async (e) => {
    e.preventDefault();
    try {
      setReqStatus(CALL_STATUS.LOADING);
      await axios.post("/auth/new-activation-code", { email });
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
        <h1 className="text-3xl mb-4 font-semibold">
          Activate account
        </h1>
        {statusObj.isError ? (
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
          <small className="text-gray-700 text-base ">Check {email} for activation code</small>
            <form className="flex flex-col gap-4" onSubmit={handleActivation}>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="otp"
                  className=" font-bold text-gray-500 uppercase"
                >
                  otp
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="OTP"
                    className="w-full bg-slate-100 p-3 rounded-lg"
                    id="otp"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={statusObj.isLoading}
                className="bg-green-700 text-white p-3 uppercase rounded-md hover:opacity-95 disabled:opacity-80"
                onClick={handleActivation}
              >
                {statusObj.isLoading ? "Loading..." : "Activate"}
              </button>
            </form>
            {statusObj.isError && <p className="text-red-700 mt-5">{error}</p>}
          </>
        )}
      </section>
    </main>
  );
};

export default ActivateTokenPage;
