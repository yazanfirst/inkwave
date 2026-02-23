import { Link } from "react-router-dom";
import { Sparkles, Palette } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-secondary/15" />
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card/90 p-8 text-center shadow-xl backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>

        <h1 className="text-2xl font-display font-bold text-foreground">Loading Inkwave Experience</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We are getting everything ready for you. Meanwhile, jump into our custom design studio.
        </p>

        <div className="mx-auto mt-6 h-2 w-52 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>

        <Link
          to="/customize"
          className="mx-auto mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Palette className="h-4 w-4" />
          Open Design Page
        </Link>
      </div>
    </div>
  );
};

export default LoadingPage;
