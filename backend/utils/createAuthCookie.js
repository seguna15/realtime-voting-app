export const sendAuthCookie = async (
  token,
  statusCode,
  res
) => {
  
  const options = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  };

  res.status(statusCode).cookie("MERNAuthToken", token, options);
};
