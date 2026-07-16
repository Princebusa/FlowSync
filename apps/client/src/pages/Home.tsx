
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Workflow,
  Zap,
  Boxes,
  Shield,
  GitBranch,
  Sparkles,
  Play,
  Check,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Nav />
      <Hero reduce={!!reduce} />
      <LogoStrip />
      <Features />
      <NodeShowcase />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  const { isAuthenticated } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-base font-semibold tracking-tight">FlowSync</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#workflows" className="transition-colors hover:text-foreground">
            Workflows
          </a>
          <a href="#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.02]"
            >
              Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.02]"
              >
                Start free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}

function LogoMark() {
  return (
    <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-brand-foreground">
      <img src="/logo.png" alt="FlowSync" className="h-7 w-7" />
    </div>
  );
}

function Hero({ reduce }: { reduce: boolean }) {
  const { isAuthenticated } = useAuth();
  const primaryTo = isAuthenticated ? "/dashboard" : "/register";

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3 w-3 text-brand" />
            New — AI nodes with model routing
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-6 text-balance font-display text-5xl leading-[1.05] tracking-tight md:text-7xl"
          >
            Automate anything with{" "}
            <span className="italic text-brand">visual workflows</span>.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg"
          >
            FlowSync is a node-based automation platform. Drag, drop and connect — from
            simple triggers to complex AI pipelines, all in one canvas.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to={primaryTo}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02]"
            >
              Start building free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#workflows"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft"
            >
              <Play className="h-3.5 w-3.5" />
              See how it works
            </a>
          </motion.div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-4 text-xs text-muted-foreground"
          >
            No credit card · Self-host or cloud · Open ecosystem
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: reduce ? 0 : 0.3, ease: "easeOut" }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <WorkflowCanvas reduce={reduce} />
        </motion.div>
      </div>
    </section>
  );
}

function WorkflowCanvas({ reduce }: { reduce: boolean }) {
  const nodes = [
    { x: 6, y: 42, label: "Webhook", icon: Zap, tag: "Trigger" },
    { x: 34, y: 18, label: "Filter", icon: GitBranch, tag: "Logic" },
    { x: 34, y: 66, label: "AI Router", icon: Sparkles, tag: "AI" },
    { x: 66, y: 42, label: "Transform", icon: Boxes, tag: "Data" },
    { x: 88, y: 42, label: "Send", icon: ArrowRight, tag: "Action" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-4 shadow-[var(--shadow-elegant)] md:p-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-muted" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted" />
        </div>
        <span className="text-xs text-muted-foreground">flow · lead-enrichment.flow</span>
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-medium text-brand">Live</span>
      </div>

      <div
        className="relative mt-4 h-[360px] w-full overflow-hidden rounded-2xl"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(0.85 0.02 183 / 0.5) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* Connections */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[
            ["M10,42 C22,42 22,18 34,18", 0],
            ["M10,42 C22,42 22,66 34,66", 0.1],
            ["M46,18 C56,18 56,42 66,42", 0.2],
            ["M46,66 C56,66 56,42 66,42", 0.25],
            ["M74,42 C80,42 80,42 88,42", 0.35],
          ].map(([d, delay], i) => (
            <motion.path
              key={i}
              d={d as string}
              fill="none"
              stroke="var(--brand)"
              strokeWidth={0.4}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{
                duration: reduce ? 0 : 1.2,
                delay: reduce ? 0 : 0.5 + (delay as number),
                ease: "easeInOut",
              }}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* Animated pulse traveling on wire */}
        {!reduce && (
          <motion.div
            className="absolute h-2 w-2 rounded-full bg-brand shadow-[0_0_16px_var(--brand)]"
            initial={{ left: "6%", top: "42%" }}
            animate={{
              left: ["6%", "34%", "66%", "88%"],
              top: ["42%", "18%", "42%", "42%"],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        )}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <motion.div
            key={n.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.6 + i * 0.12, ease: "easeOut" }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <div className="group flex min-w-[140px] items-center gap-2.5 rounded-xl border border-border bg-background/95 px-3 py-2.5 shadow-[var(--shadow-soft)] backdrop-blur transition-shadow hover:shadow-[var(--shadow-elegant)]">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand">
                <n.icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{n.tag}</span>
                <span className="text-sm font-medium leading-none">{n.label}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LogoStrip() {
  const items = ["Slack", "Notion", "Stripe", "GitHub", "OpenAI", "Postgres", "HubSpot"];
  return (
    <section className="border-y border-border/60 bg-brand-soft/40 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Connect 400+ apps and services
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {items.map((label) => (
            <motion.span
              key={label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-sm font-medium tracking-tight text-muted-foreground"
            >
              {label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Workflow,
      title: "Visual node editor",
      desc: "A canvas that scales from a 3-node script to a 300-node business process — with branches, loops and sub-flows.",
    },
    {
      icon: Sparkles,
      title: "AI-native nodes",
      desc: "Route between models, add memory and retrieval, and chain reasoning steps without leaving the flow.",
    },
    {
      icon: Boxes,
      title: "400+ integrations",
      desc: "Ready-made nodes for the tools you use. Or ship your own with the SDK in TypeScript and Python.",
    },
    {
      icon: GitBranch,
      title: "Versioned & observable",
      desc: "Every run is captured. Diff versions, inspect payloads, replay any step — the way modern teams debug.",
    },
    {
      icon: Shield,
      title: "Self-host or cloud",
      desc: "Run FlowSync on your infrastructure with SSO, audit logs and RBAC — or start on our managed cloud.",
    },
    {
      icon: Zap,
      title: "Triggered by anything",
      desc: "Webhooks, schedules, database changes, emails, events. If it emits, FlowSync can start from it.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-brand">Platform</p>
        <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl">
          Everything you need to ship a workflow.
        </h2>
        <p className="mt-4 text-muted-foreground">
          A focused set of primitives — designed to feel simple at 3 nodes and reliable at 300.
        </p>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
            className="group relative bg-background p-8 transition-colors hover:bg-brand-soft/40"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand transition-transform group-hover:scale-105">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-medium tracking-tight">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function NodeShowcase() {
  const steps = [
    { n: "01", t: "Drag a trigger", d: "Start from a webhook, schedule, form or database event." },
    { n: "02", t: "Add logic & AI", d: "Compose filters, loops and AI nodes into a graph that thinks." },
    { n: "03", t: "Run & observe", d: "Ship to production. Watch every execution with full traces." },
  ];
  return (
    <section id="workflows" className="border-t border-border/60 bg-brand-soft/30 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brand">How it works</p>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl">
              From idea to running flow in minutes.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              No YAML. No deploy scripts. Just a canvas, nodes and a Run button.
            </p>
            <ol className="mt-10 space-y-6">
              {steps.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex gap-5 border-l border-border pl-5"
                >
                  <span className="font-display text-2xl text-brand">{s.n}</span>
                  <div>
                    <h4 className="text-base font-medium">{s.t}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-elegant)]"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs text-muted-foreground">
              <span>run · 12:04:22</span>
              <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-2 py-0.5 font-medium text-brand">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                Executing
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {[
                { l: "Webhook received", s: "132ms", d: true },
                { l: "Filter: is_qualified", s: "8ms", d: true },
                { l: "AI Router → gpt-class model", s: "1.2s", d: true },
                { l: "Enrich contact (HubSpot)", s: "540ms", d: false },
                { l: "Notify #sales on Slack", s: "queued", d: false },
              ].map((row, i) => (
                <motion.div
                  key={row.l}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.1 }}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-card px-3 py-2.5 text-sm"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full ${row.d ? "bg-brand text-brand-foreground" : "border border-border text-muted-foreground"}`}
                    >
                      {row.d ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    </span>
                    {row.l}
                  </span>
                  <span className="text-xs text-muted-foreground">{row.s}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const { isAuthenticated } = useAuth();
  const startTo = isAuthenticated ? "/dashboard" : "/register";

  const plans = [
    {
      name: "Starter",
      price: "$0",
      per: "forever",
      desc: "For makers and first workflows.",
      features: ["3 active workflows", "1,000 runs / month", "Community support"],
      cta: "Start free",
      to: startTo,
      featured: false,
    },
    {
      name: "Team",
      price: "$29",
      per: "/ user / month",
      desc: "For growing teams shipping automations.",
      features: ["Unlimited workflows", "100k runs / month", "Version history", "Priority support"],
      cta: "Start 14-day trial",
      to: startTo,
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      per: "self-host or cloud",
      desc: "For regulated and large orgs.",
      features: ["SSO & SCIM", "Audit logs & RBAC", "Dedicated support", "On-prem deploy"],
      cta: "Talk to sales",
      to: "/register",
      featured: false,
    },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-brand">Pricing</p>
        <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl">
          Simple pricing, room to grow.
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`relative flex flex-col rounded-2xl border p-8 ${
              p.featured
                ? "border-brand bg-brand text-brand-foreground shadow-[var(--shadow-elegant)]"
                : "border-border bg-background"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-2.5 left-8 rounded-full bg-brand-foreground px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand">
                Most popular
              </span>
            )}
            <h3 className="text-sm font-medium">{p.name}</h3>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="font-display text-5xl tracking-tight">{p.price}</span>
              <span
                className={`text-sm ${p.featured ? "text-brand-foreground/70" : "text-muted-foreground"}`}
              >
                {p.per}
              </span>
            </div>
            <p
              className={`mt-2 text-sm ${p.featured ? "text-brand-foreground/80" : "text-muted-foreground"}`}
            >
              {p.desc}
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check
                    className={`h-4 w-4 ${p.featured ? "text-brand-foreground" : "text-brand"}`}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={p.to}
              className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-transform hover:scale-[1.02] ${
                p.featured
                  ? "bg-brand-foreground text-brand"
                  : "border border-border bg-background text-foreground hover:bg-brand-soft"
              }`}
            >
              {p.cta}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  const { isAuthenticated } = useAuth();
  const to = isAuthenticated ? "/dashboard" : "/register";

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-border p-12 text-center md:p-20"
        style={{ background: "var(--gradient-brand)" }}
      >
        <div className="relative z-10 mx-auto max-w-xl text-brand-foreground">
          <h3 className="font-display text-4xl leading-tight tracking-tight md:text-5xl">
            Your next automation starts with a single node.
          </h3>
          <p className="mt-4 text-brand-foreground/80">
            Try FlowSync free. Ship your first workflow in the next 10 minutes.
          </p>
          <Link
            to={to}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-foreground px-5 py-2.5 text-sm font-medium text-brand transition-transform hover:scale-[1.02]"
          >
            Start building — it's free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-sm font-medium">FlowSync</span>
          <span className="text-xs text-muted-foreground">© {new Date().getFullYear()}</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#pricing" className="hover:text-foreground">
            Pricing
          </a>
          <Link to="/register" className="hover:text-foreground">
            Get started
          </Link>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            className="hover:text-foreground"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
