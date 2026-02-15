import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isForgot) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/admin-login",
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset link sent to your email!");
        setIsForgot(false);
      }
      setSubmitting(false);
      return;
    }

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! You can now sign in.");
        setIsSignUp(false);
      }
      setSubmitting(false);
    } else {
      const error = await signIn(email, password);
      if (error) {
        toast.error(error.message);
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {isForgot ? "Reset Password" : "Admin Login"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isForgot ? "Enter your email to receive a reset link" : "Sign in to access the admin panel"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            />
          </div>
          {!isForgot && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                minLength={6}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Please wait..." : isForgot ? "Send Reset Link" : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        {!isForgot && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        )}
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <button onClick={() => { setIsForgot(!isForgot); setIsSignUp(false); }} className="text-primary hover:underline">
            {isForgot ? "Back to Sign In" : "Forgot password?"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
