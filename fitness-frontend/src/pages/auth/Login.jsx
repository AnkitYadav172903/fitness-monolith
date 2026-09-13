import LoginForm from "../../components/auth/LoginForm";
import AnimatedPage from "../../components/common/AnimatedPage";

function Login() {
    return (
        <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center px-5">
            <AnimatedPage>
                <LoginForm />
            </AnimatedPage>
        </div>
    );
}

export default Login;