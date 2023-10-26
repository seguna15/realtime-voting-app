import SignUp from "../../components/SignUp";

const AdminSignUpPage = () => {
  const data = {
    role: "Admin",
    title: "Admin Sign Up",
  };
  return (
    <main className="h-[100vh] flex justify-center items-center">
      <section className="p-3 max-w-lg w-full">
        <SignUp data={data} />
      </section>
    </main>
  );
};

export default AdminSignUpPage;
