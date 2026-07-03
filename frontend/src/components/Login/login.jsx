import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import authService from "../../appright/auth";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => /^[^@]+@[^@]+\.[^@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleGoogleCredentialResponse = async (response) => {
    try {
      setIsLoading(true);
      const userData = await authService.loginWithGoogle(response.credential);
      if (userData) {
        const isAdmin = userData.prefs?.isAdmin === true || userData.prefs?.isAdmin === "true";
        dispatch(login({ userData, userId: userData.$id, isAdmin }));
        setIsLoading(false);
        toast.success(`Welcome back ${userData.name}!`, {
          position: "top-center",
          className: "bg-blue-600 text-white font-bold rounded-lg shadow-lg",
          bodyClassName: "text-sm",
          progressClassName: "bg-white",
          theme: "light",
        });
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Google authentication failed. Please try again.", {
        position: "top-center",
        className: "bg-red-600 text-white font-bold rounded-lg shadow-lg",
        bodyClassName: "text-sm",
        progressClassName: "bg-white",
        theme: "light",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    /* global google */
    if (typeof google !== "undefined") {
      try {
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "123456789-mockid.apps.googleusercontent.com",
          callback: handleGoogleCredentialResponse,
        });
        google.accounts.id.renderButton(
          document.getElementById("googleSignInButton"),
          { theme: "outline", size: "large", width: "350" }
        );
      } catch (err) {
        console.error("Google button render error:", err);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email) || !validatePassword(formData.password)) {
      setErrors({
        email: !validateEmail(formData.email) ? "Please enter a valid email address" : "",
        password: !validatePassword(formData.password) ? "Password must be at least 8 characters" : "",
      });
      return;
    }
    try {
      setIsLoading(true);
      await authService.login({ email: formData.email, password: formData.password });
      const userData = await authService.getCurrentUser();
      if (userData) {
        const isAdmin = userData.prefs?.isAdmin === true || userData.prefs?.isAdmin === "true";
        dispatch(login({ userData, userId: userData.$id, isAdmin }));
        setIsLoading(false);
        console.log(userData);
        
        if (isAdmin) {
          console.log("Admin user logged in: ",true);
          toast("Admin Login Successful!", { // <-- just toast(), not toast.success()
            position: "top-center",
            className: "bg-blue-600 text-white font-bold rounded-lg shadow-lg",
            bodyClassName: "text-sm",
            progressClassName: "bg-white",
            theme: "light",
          });
          
        }
        else{
          toast.success(`Welcome back ${userData.name}`, {
            position: "top-center",
            className: "bg-blue-600 text-white font-bold rounded-lg shadow-lg",
            bodyClassName: "text-sm",
            progressClassName: "bg-white",
            theme: "light",
          });
        }
          navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      setErrors({ form: "Invalid email or password. Please try again." });
      toast.error("Login unsuccessful! Please try again.", {
          position: "top-center",
          className: "bg-red-600 text-white font-bold rounded-lg shadow-lg",
          bodyClassName: "text-sm",
          progressClassName: "bg-white",
          theme: "light",
        });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
    {/* Full Screen Background */}
    <div
      className="absolute inset-0 z-0 "
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
    </div>
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-white backdrop-blur-sm shadow-xl rounded-2xl p-8 space-y-6"
      > 
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>

        {errors.form && <p className="text-center text-red-600">{errors.form}</p>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                required
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white font-medium transition duration-200 ${
              isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="absolute px-3 bg-white text-xs text-gray-500 font-medium">Or continue with</span>
        </div>

        <div id="googleSignInButton" className="flex justify-center w-full"></div>

        {(!import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID.includes("mockid")) && (
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleGoogleCredentialResponse({ credential: "mock-google-token" })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Demo Google
            </button>
            <p className="text-[11px] text-center text-amber-700 bg-amber-50 py-1.5 px-3 rounded-lg border border-amber-200">
              ⚠️ Google OAuth client ID is configured as a mock placeholder. Click the button above to login with a mock Google account.
            </p>
          </div>
        )}

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/singup" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
    </div>
  );
};

export default LoginPage;
