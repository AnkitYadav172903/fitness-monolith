import RegisterForm from "../../components/auth/RegisterForm";
import AnimatedPage from "../../components/common/AnimatedPage";

function Register() {
    return (
        <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center px-5">
            <AnimatedPage>
                <RegisterForm />
            </AnimatedPage>
        </div>
    );
}

export default Register;