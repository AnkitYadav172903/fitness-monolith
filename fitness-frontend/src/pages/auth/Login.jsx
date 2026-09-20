import LoginForm from "../../components/auth/LoginForm";
import AuthLayout from "./AuthLayout";

function Login() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}

export default Login;