import SignUp from "../../components/SignUp";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const data = {
    role: "User",
    title: "Sign Up"
  };
  return (
    <main className="h-[100vh] flex justify-center items-center">
      <section className="p-3 max-w-lg w-full">
        <SignUp data={data} />
      </section>
    </main>
  );
}

export default SignUpPage