import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

export default function SignInWithCode() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [codeSentTo, setCodeSentTo] = useState("");
  const [code, setCode] = useState("");
  const [activation, setActivation] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    fontFamily: "Poppins, sans-serif",
    boxSizing: "border-box",
    outline: "none",
  };

  const handleSendCode = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrors(["Enter a valid enrollment email address."]);
      return;
    }

    setErrors([]);
    setLoading(true);

    try {
      const { data: student, error: studentError } = await supabase
        .from("student")
        .select("id, email, firstName, isAccountSetup")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (studentError) throw new Error(`Student lookup failed: ${studentError.message}`);
      if (!student) {
        setErrors(["No enrollment record was found for that email. Check the address used when enrolling."]);
        return;
      }
      if (student.isAccountSetup) {
        setErrors(["This account is already activated. Enrollment codes are only for first-time setup; sign in with your email and password."]);
        return;
      }

      const { data: activationCodes, error: activationCodeError } = await supabase
        .from("activation_codes")
        .select("code, is_used, expires_at")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (activationCodeError) throw new Error(activationCodeError.message);
      const now = Date.now();
      const activationCode = (activationCodes ?? []).find(
        (candidate) =>
          !candidate.is_used &&
          candidate.expires_at &&
          new Date(candidate.expires_at).getTime() > now,
      );

      if (!activationCode) {
        const unusedCodes = (activationCodes ?? []).filter((candidate) => !candidate.is_used);
        if (unusedCodes.length > 0) {
          setErrors(["Your enrollment code has expired. Contact the admin to issue a new code."]);
        } else if (activationCodes?.length > 0) {
          setErrors(["Your enrollment code has already been used. Sign in with your email and password."]);
        } else {
          setErrors(["No enrollment code has been issued for this account yet. The admin must approve the enrollment first."]);
        }
        return;
      }

      const { data: emailResult, error: emailError } = await supabase.functions.invoke(
        "send-activation-email",
        {
          body: {
            to: student.email,
            studentName: student.firstName || "Student",
            code: activationCode.code,
          },
        },
      );

      if (emailError || emailResult?.success !== true) {
        throw new Error("We couldn't send the code. Please try again or contact the admin.");
      }

      setEmail(normalizedEmail);
      setCodeSentTo(normalizedEmail);
      setCode("");
    } catch (error) {
      setErrors([error.message ?? "Unable to send the code. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    if (email.trim().toLowerCase() !== codeSentTo) {
      setErrors(["Send a code to this email address before continuing."]);
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setErrors(["Enter the 6-digit activation code from your email."]);
      return;
    }

    setErrors([]);
    setLoading(true);

    try {
      const { data: codeData, error: codeError } = await supabase
        .from("activation_codes")
        .select("id, student_id, is_used, expires_at")
        .eq("code", code)
        .maybeSingle();

      if (codeError) throw new Error(codeError.message);
      if (!codeData) {
        setErrors(["Invalid code. Check the code in your email and try again."]);
        return;
      }
      if (codeData.is_used) {
        setErrors(["This code has already been used. Please sign in instead."]);
        return;
      }
      if (!codeData.expires_at || new Date(codeData.expires_at) <= new Date()) {
        setErrors(["This code has expired. Please contact the admin for a new one."]);
        return;
      }

      const { data: student, error: studentError } = await supabase
        .from("student")
        .select("id, email, firstName, isAccountSetup")
        .eq("id", codeData.student_id)
        .maybeSingle();

      if (studentError || !student) {
        setErrors(["The student account for this code could not be found."]);
        return;
      }
      if (student.email.trim().toLowerCase() !== codeSentTo) {
        setErrors(["That code does not match the email address above."]);
        return;
      }
      if (student.isAccountSetup) {
        setErrors(["This account is already activated. Please sign in with your password."]);
        return;
      }

      setActivation({ ...codeData, student });
    } catch (error) {
      setErrors([error.message ?? "Unable to verify the code. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    const passwordErrors = [];
    if (password.length < 8) passwordErrors.push("Password must be at least 8 characters.");
    if (!/[0-9]/.test(password)) passwordErrors.push("Password must contain at least one number.");
    if (!/[a-z]/.test(password)) passwordErrors.push("Password must contain at least one lowercase letter.");
    if (!/[A-Z]/.test(password)) passwordErrors.push("Password must contain at least one uppercase letter.");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
      passwordErrors.push("Password must contain at least one special character.");
    }
    if (password !== confirmPassword) passwordErrors.push("Passwords do not match.");
    if (passwordErrors.length) {
      setErrors(passwordErrors);
      return;
    }

    setErrors([]);
    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: activation.student.email,
        password,
        options: { data: { student_id: String(activation.student.id) } },
      });

      if (signUpError) throw new Error(signUpError.message);
      if (!signUpData.user) throw new Error("Unable to create the account.");

      const { error: studentUpdateError } = await supabase
        .from("student")
        .update({ auth_id: signUpData.user.id, isAccountSetup: true })
        .eq("id", activation.student.id);

      if (studentUpdateError) throw new Error(studentUpdateError.message);

      const { data: usedCode, error: useCodeError } = await supabase
        .from("activation_codes")
        .update({ is_used: true })
        .eq("id", activation.id)
        .eq("is_used", false)
        .select("id")
        .maybeSingle();

      if (useCodeError) throw new Error(useCodeError.message);
      if (!usedCode) throw new Error("This code has already been used.");

      if (signUpData.session) {
        navigate("/dashboard", { replace: true });
      } else {
        setAccountCreated(true);
      }
    } catch (error) {
      setErrors([error.message ?? "Unable to create the account. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 70px)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "48px 16px", boxSizing: "border-box" }}>
        <section style={{ width: "100%", maxWidth: "480px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", padding: "40px", boxSizing: "border-box" }}>
          <button
            type="button"
            onClick={() => {
              if (activation) setActivation(null);
              else if (codeSentTo) {
                setCodeSentTo("");
                setCode("");
              } else navigate("/signin");
            }}
            aria-label={activation ? "Back to code entry" : codeSentTo ? "Change email address" : "Back to sign in"}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: 0, marginBottom: "24px", border: "none", background: "none", color: "#1a1a6e", fontFamily: "inherit", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          >
            <ArrowLeft size={16} /> {activation ? "Back to code" : codeSentTo ? "Change email" : "Back to sign in"}
          </button>

          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ width: "48px", height: "48px", margin: "0 auto 14px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#eef0fb", color: "#1a1a6e" }}>
              <KeyRound size={22} />
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a6e", margin: "0 0 8px" }}>
              {accountCreated ? "Account created" : activation ? "Create your account" : codeSentTo ? "Check your email" : "Sign in with code"}
            </h1>
            <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.5, margin: 0 }}>
              {accountCreated
                ? "Your account is ready. Sign in with your email and new password."
                : activation
                  ? `Activation verified for ${activation.student.email}. Create a password to finish setup.`
                  : codeSentTo
                    ? `We sent a 6-digit activation code to ${codeSentTo}. Enter it below to continue.`
                    : "Enter your enrollment email and we'll send your activation code."}
            </p>
          </div>

          {errors.length > 0 && (
            <div role="alert" style={{ backgroundColor: "#fff5f5", border: "1px solid #e53935", borderRadius: "8px", padding: "12px 16px", marginBottom: "18px" }}>
              {errors.map((error) => <p key={error} style={{ color: "#c0392b", fontSize: "13px", margin: "2px 0" }}>{error}</p>)}
            </div>
          )}

          {accountCreated ? (
            <button
              type="button"
              onClick={() => navigate("/signin", { replace: true })}
              style={{ width: "100%", padding: "14px", backgroundColor: "#1a1a6e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
            >
              Go to sign in
            </button>
          ) : activation ? (
            <form onSubmit={handleCreateAccount}>
              <label htmlFor="new-password" style={{ fontSize: "13px", fontWeight: "600", color: "#222", display: "block", marginBottom: "6px" }}>Create password</label>
              <div style={{ position: "relative", marginBottom: "16px" }}>
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  style={{ ...inputStyle, paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", display: "flex", padding: 0, border: "none", background: "none", color: "#888", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <label htmlFor="confirm-password" style={{ fontSize: "13px", fontWeight: "600", color: "#222", display: "block", marginBottom: "6px" }}>Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                style={{ ...inputStyle, marginBottom: "22px" }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "14px", backgroundColor: "#1a1a6e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          ) : codeSentTo ? (
            <form onSubmit={handleVerifyCode}>
              <div style={{ padding: "12px 14px", marginBottom: "18px", borderRadius: "8px", backgroundColor: "#f5f6fa", color: "#555", fontSize: "13px" }}>
                Code sent to <strong>{codeSentTo}</strong>
              </div>
              <label htmlFor="activation-code" style={{ fontSize: "13px", fontWeight: "600", color: "#222", display: "block", marginBottom: "6px" }}>Enrollment code</label>
              <input
                id="activation-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                style={{ ...inputStyle, textAlign: "center", fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "14px", backgroundColor: "#1a1a6e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Verifying..." : "Verify code"}
              </button>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={loading}
                style={{ width: "100%", padding: "12px", marginTop: "10px", backgroundColor: "#fff", color: "#1a1a6e", border: "1px solid #d7d9e3", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
              >
                {loading ? "Sending..." : "Resend code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendCode}>
              <label htmlFor="enrollment-email" style={{ fontSize: "13px", fontWeight: "600", color: "#222", display: "block", marginBottom: "6px" }}>Email address</label>
              <input
                id="enrollment-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email used for enrollment"
                style={{ ...inputStyle, marginBottom: "20px" }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "14px", backgroundColor: "#1a1a6e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Sending code..." : "Send code"}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}