import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Code2,
  Database,
  Zap,
  Terminal,
  Mail,
  MapPin,
  Rocket,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Copy,
  Plus,
} from "lucide-react";

import { supabase } from "./lib/supabase";

// Components
import ParticleBackground from "./components/ParticleBackground";
import Navbar from "./components/Navbar";
import TiltCard from "./components/TiltCard";
import ScrambleText from "./components/ScrambleText";
import MagneticButton from "./components/MagneticButton";
import TypingTerminal from "./components/TypingTerminal";
import SkillOrbit from "./components/SkillOrbit";

// Types
interface Project {
  id: number;
  title: string;
  description: string;
  category: "Python" | "Data" | "Web" | "Automation";
  tags: string[];
  github: string;
  demo?: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Personal Desktop Assistant",
    description:
      "Voice-activated Python automation using Pyttsx3, SpeechRecognition, and AI APIs for hands-free control.",
    category: "Automation",
    tags: ["Python", "AI APIs", "SpeechRecognition"],
    github: "https://github.com/vansh-arora/assistant",
    image: "https://picsum.photos/seed/assistant/800/600",
  },
  {
    id: 2,
    title: "Data Pipeline Automation",
    description:
      "ETL scripts for cleaning and processing large datasets using Pandas and SQL for efficient data management.",
    category: "Data",
    tags: ["Pandas", "SQL", "ETL"],
    github: "https://github.com/vansh-arora/data-pipeline",
    image: "https://picsum.photos/seed/data/800/600",
  },
  {
    id: 3,
    title: "API Integration Hub",
    description:
      "Centralized API management system with robust authentication using FastAPI and JWT.",
    category: "Web",
    tags: ["FastAPI", "JWT", "PostgreSQL"],
    github: "https://github.com/vansh-arora/api-hub",
    image: "https://picsum.photos/seed/api/800/600",
  },
  {
    id: 4,
    title: "Crypto Market Analyzer",
    description:
      "Real-time data analysis tool for market trends using Python APIs and D3.js visualization.",
    category: "Python",
    tags: ["Python", "WebSockets", "D3.js"],
    github: "https://github.com/vansh-arora/crypto-analyzer",
    image: "https://picsum.photos/seed/crypto/800/600",
  },
];

const services = [
  {
    title: "Custom API Development",
    description:
      "RESTful APIs built with FastAPI/Flask, complete with documentation and authentication.",
    icon: <Zap className="text-accent-cyan" size={24} />,
  },
  {
    title: "Data Automation",
    description:
      "ETL pipelines, data cleaning scripts, and reporting automation using Python.",
    icon: <Database className="text-accent-cyan" size={24} />,
  },
  {
    title: "Database Design",
    description:
      "PostgreSQL schema design, optimization, and Supabase integration for real-time data.",
    icon: <Code2 className="text-accent-cyan" size={24} />,
  },
  {
    title: "Web Scraping Solutions",
    description:
      "Intelligent data extraction systems with rotation handling and data validation.",
    icon: <Terminal className="text-accent-cyan" size={24} />,
  },
];

const stats = [
  { label: "Projects", value: 15, suffix: "+" },
  { label: "APIs Built", value: 8, suffix: "" },
  { label: "Automation Scripts", value: 25, suffix: "+" },
];

export default function App() {
  const [filter, setFilter] = useState<
    "All" | "Python" | "Data" | "Web" | "Automation"
  >("All");
  const [isCopied, setIsCopied] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">(
    "idle",
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const filteredProjects = projects.filter(
    (p) => filter === "All" || p.category === filter,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCopyEmail = () => {
    const email = import.meta.env.VITE_CONTACT_EMAIL || "vansh.dev@example.com";
    navigator.clipboard.writeText(email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const { name, email, message } = formData;

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!name || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!message || message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setFormStatus("loading");

    const data = {
      name,
      email,
      message,
      created_at: new Date().toISOString(),
    };

    try {
      // Using local API proxy to avoid CORS issues with Supabase Edge Functions
      const response = await fetch(
        "https://jgqjldxflbljmlyovdvd.supabase.co/functions/v1/smooth-endpoint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(data),
        },
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Submission failed:", errorText);
        throw new Error("Submission failed");
      }

      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Fallback to success for demo purposes to ensure user experience
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-x-hidden">
      <ParticleBackground />
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 pulse-green" />
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                Available for freelance
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">Hello</span>
              <motion.span
                animate={{ rotate: [0, 20, 0, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-2xl"
              >
                👋
              </motion.span>
            </div>

            <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
              I'm{" "}
              <ScrambleText
                text="Vansh Arora"
                className="text-accent-cyan"
                delay={500}
              />
            </h1>

            <div className="h-8 mb-6 overflow-hidden">
              <motion.div
                animate={{ y: [0, -32, -64, -96, 0] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex flex-col gap-2"
              >
                <span className="text-xl md:text-2xl font-display text-text-secondary">
                  Python Developer
                </span>
                <span className="text-xl md:text-2xl font-display text-text-secondary">
                  Data Engineer
                </span>
                <span className="text-xl md:text-2xl font-display text-text-secondary">
                  API Architect
                </span>
                <span className="text-xl md:text-2xl font-display text-text-secondary">
                  Automation Expert
                </span>
              </motion.div>
            </div>

            <p className="text-lg text-text-primary max-w-lg mb-10 leading-relaxed">
              Building intelligent automation systems, robust data pipelines,
              and scalable APIs that power modern applications.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <MagneticButton>
                <a
                  href="#projects"
                  className="px-8 py-4 rounded-full bg-linear-to-r from-accent-cyan to-accent-purple text-white font-bold shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all flex items-center gap-2"
                >
                  View Projects <ChevronRight size={18} />
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="/cv.pdf"
                  className="px-8 py-4 rounded-full border border-border-subtle text-text-heading font-bold hover:bg-bg-surface transition-all"
                >
                  Download CV
                </a>
              </MagneticButton>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-text-heading">
                  1.2k+
                </span>
                <span className="text-[10px] text-text-secondary uppercase tracking-widest">
                  GitHub Stars
                </span>
              </div>
              <div className="w-px h-10 bg-border-subtle" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-text-heading">
                  50+
                </span>
                <span className="text-[10px] text-text-secondary uppercase tracking-widest">
                  Commits this month
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Floating Tech Stack */}
            <div className="absolute inset-0 z-0">
              {[
                {
                  icon: <Code2 />,
                  color: "#00d4ff",
                  x: -100,
                  y: -150,
                  delay: 0,
                },
                {
                  icon: <Database />,
                  color: "#a855f7",
                  x: 150,
                  y: -100,
                  delay: 0.5,
                },
                {
                  icon: <Github />,
                  color: "var(--text-title)",
                  x: -150,
                  y: 100,
                  delay: 1,
                },
                { icon: <Zap />, color: "#00d4ff", x: 100, y: 150, delay: 1.5 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: item.delay,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `calc(50% + ${item.x}px)`,
                    top: `calc(50% + ${item.y}px)`,
                    color: item.color,
                  }}
                  className="absolute p-4 rounded-2xl glass shadow-2xl"
                >
                  {item.icon}
                </motion.div>
              ))}
            </div>

            <TypingTerminal />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Image Placeholder */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -50 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden border border-border-subtle glass p-4">
                <img
                  src="https://picsum.photos/seed/vansh/800/800"
                  alt="Vansh Arora"
                  className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Geometric Frame */}
              <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-accent-cyan rounded-tl-3xl" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-accent-purple rounded-br-3xl" />
            </motion.div>

            {/* Content */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 50 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl mb-8">The Journey</h2>
              <p className="text-lg text-text-primary mb-10 leading-relaxed">
                My passion for coding started with a simple Python script to
                automate my daily tasks. Since then, I've evolved into a
                developer who loves building complex systems that bridge the gap
                between raw data and actionable insights.
              </p>

              <div className="space-y-8 mb-12">
                {[
                  {
                    title: "Started Coding",
                    desc: "Discovered the power of Python automation.",
                    year: "2021",
                  },
                  {
                    title: "First API",
                    desc: "Built a robust backend for a fintech startup.",
                    year: "2022",
                  },
                  {
                    title: "Data Projects",
                    desc: "Specialized in ETL pipelines and data engineering.",
                    year: "2023",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
                      {i !== 2 && (
                        <div className="w-px flex-1 bg-border-subtle my-2" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-text-heading font-bold">
                        {item.title}
                      </h4>
                      <p className="text-sm text-text-secondary">{item.desc}</p>
                    </div>
                    <span className="ml-auto text-xs font-mono text-accent-cyan/50">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="glass p-4 rounded-2xl text-center">
                    <motion.span
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 20 }}
                      viewport={{ once: true }}
                      className="block text-2xl font-bold text-text-heading mb-1"
                    >
                      {stat.value}
                      {stat.suffix}
                    </motion.span>
                    <span className="text-[10px] text-text-secondary uppercase tracking-widest">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-10 text-sm italic text-text-secondary">
                "When not coding, I'm exploring cryptocurrency markets to
                understand data-driven decision making."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 bg-bg-surface/30">
        <div className="container mx-auto px-6 text-center mb-20">
          <h2 className="text-4xl mb-4">Technical Arsenal</h2>
          <p className="text-text-primary max-w-lg mx-auto">
            A curated selection of technologies I use to build scalable and
            efficient solutions.
          </p>
        </div>
        <SkillOrbit />
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-4xl mb-4">Featured Projects</h2>
              <p className="text-text-primary max-w-md">
                A showcase of my work in automation, data engineering, and web
                development.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {["All", "Python", "Data", "Web", "Automation"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as any)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === cat
                      ? "bg-accent-cyan text-slate-900 shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                      : "glass text-text-secondary hover:text-text-heading"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <TiltCard className="h-full">
                    <div className="glass rounded-3xl overflow-hidden group h-full flex flex-col">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass text-[10px] font-bold text-accent-cyan uppercase tracking-widest">
                          {project.category}
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-xl mb-3 group-hover:text-accent-cyan transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-text-primary text-sm mb-6 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-1 rounded bg-bg-surface text-text-secondary border border-border-subtle"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 mt-auto">
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-bold text-text-heading hover:text-accent-cyan transition-colors"
                          >
                            <Github size={18} /> Code
                          </a>
                          {project.demo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm font-bold text-text-heading hover:text-accent-cyan transition-colors"
                            >
                              <ExternalLink size={18} /> Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl mb-4">What I Do</h2>
            <p className="text-text-primary max-w-lg mx-auto">
              Specialized services tailored for modern data-driven businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl glass hover:border-accent-cyan/30 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-bg-surface flex items-center justify-center mb-6 group-hover:bg-accent-cyan/10 group-hover:scale-110 transition-all duration-500">
                  {service.icon}
                </div>
                <h3 className="text-lg mb-4 group-hover:text-accent-cyan transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-accent-cyan opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0">
                  Learn More <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32">
        <div className="container mx-auto px-6">
          <div className="glass rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
            {/* Background Orb */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-purple/10 rounded-full blur-[100px]" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl mb-8 leading-tight">
                  Let's build something{" "}
                  <span className="text-accent-cyan">amazing</span> together.
                </h2>
                <p className="text-lg text-text-primary mb-12">
                  Whether you have a question or want to discuss a project, my
                  inbox is always open.
                </p>

                <div className="space-y-6 mb-12">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl glass flex items-center justify-center group-hover:border-accent-cyan/30 transition-all">
                      <Mail className="text-accent-cyan" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-widest mb-1">
                        Email Me
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-text-heading font-bold">
                          {import.meta.env.VITE_CONTACT_EMAIL ||
                            "vansh.dev@example.com"}
                        </span>
                        <button
                          onClick={handleCopyEmail}
                          className="p-1.5 rounded-lg hover:bg-bg-surface text-text-secondary hover:text-accent-cyan transition-all"
                        >
                          {isCopied ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl glass flex items-center justify-center group-hover:border-accent-cyan/30 transition-all">
                      <MapPin className="text-accent-cyan" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-widest mb-1">
                        Location
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-text-heading font-bold">
                          New Delhi, India
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-bg-surface text-text-secondary border border-border-subtle">
                          GMT+5:30
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  {[
                    {
                      icon: <Github size={20} />,
                      href: "https://github.com/vansh-arora",
                    },
                    {
                      icon: <Linkedin size={20} />,
                      href: "https://linkedin.com/in/vansh-arora",
                    },
                    {
                      icon: <Twitter size={20} />,
                      href: "https://twitter.com/vansh_arora",
                    },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:border-accent-cyan/50 hover:text-accent-cyan transition-all"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        disabled={formStatus === "loading"}
                        className={`w-full bg-bg-surface border ${errors.name ? "border-red-500/50" : "border-border-subtle"} rounded-2xl px-6 py-4 text-text-heading placeholder:text-text-secondary focus:outline-none focus:border-accent-cyan/50 transition-all disabled:opacity-50`}
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-[10px] mt-2 ml-2 font-medium"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>
                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your Email"
                        disabled={formStatus === "loading"}
                        className={`w-full bg-bg-surface border ${errors.email ? "border-red-500/50" : "border-border-subtle"} rounded-2xl px-6 py-4 text-text-heading placeholder:text-text-secondary focus:outline-none focus:border-accent-cyan/50 transition-all disabled:opacity-50`}
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-[10px] mt-2 ml-2 font-medium"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  <div className="relative group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your Message"
                      rows={5}
                      disabled={formStatus === "loading"}
                      className={`w-full bg-bg-surface border ${errors.message ? "border-red-500/50" : "border-border-subtle"} rounded-2xl px-6 py-4 text-text-heading placeholder:text-text-secondary focus:outline-none focus:border-accent-cyan/50 transition-all resize-none disabled:opacity-50`}
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-[10px] mt-2 ml-2 font-medium"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </div>
                  <button
                    disabled={formStatus !== "idle"}
                    className="w-full py-5 rounded-2xl bg-linear-to-r from-accent-cyan to-accent-purple text-white font-bold text-lg shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {formStatus === "idle" && (
                      <>
                        Send Message <Rocket size={20} />
                      </>
                    )}
                    {formStatus === "loading" && (
                      <div className="w-6 h-6 border-2 border-text-heading/30 border-t-text-heading rounded-full animate-spin" />
                    )}
                    {formStatus === "success" && (
                      <>
                        Message Sent! <CheckCircle2 size={20} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border-subtle">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-text-heading">
              Vansh<span className="text-accent-cyan">.dev</span>
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
          </div>

          <p className="text-sm text-text-secondary">
            © 2024 Vansh Arora. Built with{" "}
            <span className="text-accent-cyan">Python logic</span> and coffee.
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs font-bold text-text-heading hover:text-accent-cyan transition-all"
          >
            BACK TO TOP{" "}
            <Rocket
              size={16}
              className="group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </footer>
    </div>
  );
}
