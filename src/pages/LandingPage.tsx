import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Recycle, Brain, Route, Wifi, MapPin, TrendingDown,
  BarChart3, ArrowRight, ChevronRight, CheckCircle2,
  Zap, Shield, Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";

const HeroScene = lazy(() => import("@/components/HeroScene"));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const stats = [
  { value: "12+", label: "Cities Covered", icon: Globe },
  { value: "50,000+", label: "Bins Monitored", icon: MapPin },
  { value: "30%", label: "Fuel Savings", icon: TrendingDown },
  { value: "98%", label: "Collection Rate", icon: CheckCircle2 },
];

const features = [
  { icon: Brain, title: "AI Fill Prediction", desc: "ML models predict bin fill levels 6-12 hours ahead using historical data, weather, and event patterns.", tag: "Machine Learning" },
  { icon: Route, title: "Route Optimization", desc: "Dynamic route generation minimizes travel distance and fuel consumption for collection trucks.", tag: "Optimization" },
  { icon: Wifi, title: "Real-Time IoT Tracking", desc: "Ultrasonic sensors in every bin report fill levels in real-time via MQTT/LoRaWAN.", tag: "IoT" },
  { icon: MapPin, title: "Fleet GPS Tracking", desc: "Live truck tracking with route deviation alerts and driver performance analytics.", tag: "Tracking" },
  { icon: TrendingDown, title: "Waste Analytics", desc: "Zone-wise waste generation patterns, peak hours analysis, and Swachh Survekshan scoring.", tag: "Analytics" },
  { icon: BarChart3, title: "Municipal Reports", desc: "Automated reports for ULB compliance, SBM targets, and citizen satisfaction metrics.", tag: "Reporting" },
];

const steps = [
  { num: "01", title: "Monitor", desc: "IoT sensors continuously monitor bin fill levels across all city zones in real-time.", icon: Wifi },
  { num: "02", title: "Predict", desc: "AI models analyze patterns to predict which bins will need collection and when.", icon: Brain },
  { num: "03", title: "Optimize", desc: "Smart algorithms generate optimized routes, saving fuel and ensuring timely collection.", icon: Zap },
];

const trusted = [
  "Ahmedabad Municipal Corporation",
  "Surat Smart City",
  "Pune Municipal Corporation",
  "Indore Nagar Nigam",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
              <Recycle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">SwachBot</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="gap-2 shadow-lg shadow-primary/20">
                Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-success/5" />}>
          <HeroScene />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-[1]" />
        <div className="container relative z-[2]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Powering Smart Cities Across India
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[1.1]"
            >
              Intelligent Waste
              <br />
              Management for{" "}
              <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                Modern Cities
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              AI-powered platform helping Indian municipalities optimize waste collection,
              reduce costs by 30%, and achieve Swachh Bharat Mission targets through
              predictive analytics and smart route optimization.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                  Explore Dashboard <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 h-12 border-border/60 hover:bg-accent/50">
                <Shield className="h-4 w-4" /> Request Demo
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} custom={4} className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> SBM Compliant</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> ISO 27001</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Made in India</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-y border-border/40 bg-muted/30">
        <div className="container">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">Trusted by Leading Municipalities</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {trusted.map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-sm font-medium text-muted-foreground/60"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">The Challenge</span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">India's Urban Waste Crisis</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed text-lg">
              Indian cities generate over <strong className="text-foreground">1,50,000 tonnes</strong> of municipal solid waste daily.
              Inefficient collection routes waste <strong className="text-foreground">40% fuel</strong>, 30% of bins overflow before collection,
              and manual monitoring fails at scale.
            </p>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { val: "40%", label: "Fuel wasted on inefficient routes" },
              { val: "30%", label: "Bins overflow before collection" },
              { val: "₹1,500 Cr", label: "Annual cost of mismanagement" },
            ].map((item, i) => (
              <motion.div
                key={item.val}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center"
              >
                <p className="font-display text-3xl font-bold text-destructive">{item.val}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="text-center"
              >
                <s.icon className="h-6 w-6 text-primary-foreground/60 mx-auto mb-2" />
                <p className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">{s.value}</p>
                <p className="mt-1 text-sm text-primary-foreground/70 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Platform</span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">Everything You Need</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">End-to-end waste management intelligence, from sensor to city hall.</p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="group h-full border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                        <f.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        {f.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-muted/30 border-y border-border/40">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Process</span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">How SwachBot Works</h2>
            <p className="mt-3 text-muted-foreground">Three steps to smarter waste management</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center group"
              >
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/20 mb-6 group-hover:scale-105 transition-transform">
                  <s.icon className="h-8 w-8" />
                </div>
                {i < 2 && (
                  <div className="absolute top-10 left-[calc(50%+50px)] w-[calc(100%-100px)] hidden md:block">
                    <div className="border-t-2 border-dashed border-primary/20 w-full" />
                  </div>
                )}
                <p className="text-xs font-bold text-primary mb-2">STEP {s.num}</p>
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-12 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
                Ready to Transform Your City's Waste Management?
              </h2>
              <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto text-lg">
                Join 12+ Indian cities already using SwachBot to achieve cleaner streets,
                lower costs, and better Swachh Survekshan rankings.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/dashboard">
                  <Button size="lg" variant="secondary" className="gap-2 text-base px-8 h-12 font-semibold shadow-lg">
                    Explore Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" className="gap-2 text-base px-8 h-12 font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg">
                  Contact Sales
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-muted/20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Recycle className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display text-lg font-bold">SwachBot</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered waste management for smart Indian cities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Data Protection</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2026 SwachBot. Smart Waste Management for Indian Municipalities.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with 🇮🇳 for Swachh Bharat Mission
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
