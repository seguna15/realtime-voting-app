export const sendToken = async (user, secret, expirationTime) => {
    const token = await user.getJwtAccessToken(secret, expirationTime);

    return token;
}