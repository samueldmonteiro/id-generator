import { LoginForm } from "../../components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Crachá Pro",
  description: "Gerador de Crachás Anhanguera",
};

const LoginPage = async () => {
  return (
    <>
      <LoginForm />
    </>
  );
};

export default LoginPage;
