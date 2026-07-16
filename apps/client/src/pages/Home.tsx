import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, Workflow, Zap, Layers } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen text-foreground">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          FlowSync
        </Link>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(226,230,235,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(226,230,235,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
          }}
        />

        <p className="mb-4 font-display text-sm font-medium tracking-wide text-primary">
          Workflow automation
        </p>
        <h1 className="font-display max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-6xl">
          FlowSync
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Design node-based automations, run them with live feedback, and keep
          everything simple.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start building
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-card/60 py-16 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
          {[
            {
              icon: Workflow,
              title: "Visual editor",
              body: "Connect triggers and actions on a calm infinite canvas.",
            },
            {
              icon: Zap,
              title: "Live runs",
              body: "Watch each step update in real time as the engine works.",
            },
            {
              icon: Layers,
              title: "Worker scale",
              body: "Queue jobs in Redis and run them on a separate engine.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-lg font-medium tracking-tight">{title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
        FlowSync — build automations without the noise.
      </footer>
    </div>
  );
}
