import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  ChevronDown,
  Facebook,
  Flame,
  FlaskConical,
  Heart,
  Instagram,
  Leaf,
  Loader2,
  Mail,
  Menu,
  Phone,
  Shield,
  Sprout,
  Twitter,
  Wind,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProductKey = "g100" | "g250" | "g500";

interface Product {
  key: ProductKey;
  name: string;
  weight: string;
  price: string;
  priceNum: number;
  description: string;
  popular?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    key: "g100",
    name: "Starter Pack",
    weight: "100g",
    price: "₹199",
    priceNum: 199,
    description:
      "Perfect for first-timers. A month's supply of pure moringa goodness to kickstart your wellness journey.",
  },
  {
    key: "g250",
    name: "Wellness Pack",
    weight: "250g",
    price: "₹399",
    priceNum: 399,
    description:
      "Our bestseller. Three months of daily vitality — the ideal balance of value and freshness.",
    popular: true,
  },
  {
    key: "g500",
    name: "Family Pack",
    weight: "500g",
    price: "₹699",
    priceNum: 699,
    description:
      "Share the goodness with your family. Maximum savings and a six-month supply of nature's finest.",
  },
];

const BENEFITS = [
  {
    icon: Shield,
    title: "Boost Immunity",
    description:
      "Rich in Vitamin C and antioxidants, moringa fortifies your body's natural defences against infections and seasonal illness.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Zap,
    title: "High in Vitamins & Iron",
    description:
      "Contains 25× more iron than spinach and 17× more calcium than milk. A nutritional powerhouse in every spoonful.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Flame,
    title: "Energy & Metabolism",
    description:
      "Natural B-vitamins and amino acids sustain all-day energy without the crash — no stimulants, just pure nourishment.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Wind,
    title: "Natural Detox",
    description:
      "Chlorophyll-rich moringa gently cleanses the liver and supports healthy digestion for a lighter, cleaner feeling.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

const WHY_FEATURES = [
  {
    icon: Sprout,
    title: "Farm Fresh",
    description:
      "Sourced from certified organic farms in Karnataka. Harvested at peak potency, dried within 24 hours of picking.",
  },
  {
    icon: Leaf,
    title: "Nutrient-Rich",
    description:
      "Cold-processed at low temperatures to preserve all 92 nutrients, 46 antioxidants, and 18 amino acids intact.",
  },
  {
    icon: FlaskConical,
    title: "Lab Tested",
    description:
      "Every batch tested by FSSAI-certified labs for heavy metals, microbes, and pesticide residue. Certificate available on request.",
  },
];

// ─── Smooth scroll helper ─────────────────────────────────────────────────────

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ─── Order Modal ──────────────────────────────────────────────────────────────

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  defaultProduct: ProductKey;
  actor: ReturnType<typeof useActor>["actor"];
}

function OrderModal({ open, onClose, defaultProduct, actor }: OrderModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState<ProductKey>(defaultProduct);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Sync default product when modal opens with new selection
  useEffect(() => {
    if (open) {
      setProduct(defaultProduct);
      setStatus("idle");
    }
  }, [open, defaultProduct]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setStatus("loading");
    try {
      await actor.submitInquiry(name, email, phone, product, message || null);
      setStatus("success");
      toast.success("Order inquiry submitted! We'll contact you shortly.", {
        description: "Check your email for confirmation.",
      });
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setTimeout(() => onClose(), 1800);
    } catch {
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  }

  const selectedProduct = PRODUCTS.find((p) => p.key === product);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg w-full rounded-3xl border-border/60 shadow-green-lg p-0 overflow-hidden"
        data-ocid="order.dialog"
      >
        {/* Header */}
        <div className="bg-forest px-8 pt-8 pb-6">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-primary-foreground tracking-tight">
              Order Inquiry
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/70 text-sm mt-1">
              Fill in your details and we'll reach out to confirm your order.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {/* Feedback states */}
          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm"
                data-ocid="order.success_state"
              >
                <Heart className="w-4 h-4 text-green-600 shrink-0" />
                Inquiry submitted! Redirecting…
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm"
                data-ocid="order.error_state"
              >
                Failed to submit. Please try again.
              </motion.div>
            )}
          </AnimatePresence>

          {status === "loading" && (
            <div
              className="flex items-center justify-center gap-2 text-muted-foreground text-sm py-1"
              data-ocid="order.loading_state"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting your inquiry…
            </div>
          )}

          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="order-name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="order-name"
                placeholder="Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl h-11 border-border/80"
                data-ocid="order.name.input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="order-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="order-email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl h-11 border-border/80"
                  data-ocid="order.email.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="order-phone" className="text-sm font-medium">
                  Phone
                </Label>
                <Input
                  id="order-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="rounded-xl h-11 border-border/80"
                  data-ocid="order.phone.input"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Product</Label>
              <Select
                value={product}
                onValueChange={(v) => setProduct(v as ProductKey)}
              >
                <SelectTrigger
                  className="rounded-xl h-11 border-border/80"
                  data-ocid="order.product.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {PRODUCTS.map((p) => (
                    <SelectItem
                      key={p.key}
                      value={p.key}
                      className="rounded-lg"
                    >
                      {p.weight} Moringa Powder — {p.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && (
              <div className="rounded-xl bg-secondary/60 px-4 py-3 text-sm text-secondary-foreground border border-border/50">
                <span className="font-semibold">{selectedProduct.name}</span> —{" "}
                {selectedProduct.description}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="order-message" className="text-sm font-medium">
                Message{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="order-message"
                placeholder="Any special requirements or questions…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="rounded-xl border-border/80 resize-none"
                data-ocid="order.message.textarea"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl h-11 border-border/70"
              onClick={onClose}
              data-ocid="order.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl h-11 bg-forest text-primary-foreground hover:opacity-90 font-semibold shadow-green"
              disabled={status === "loading" || status === "success"}
              data-ocid="order.submit_button"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Placing Order…
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const { actor, isFetching } = useActor();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductKey>("g250");
  const hasIncrementedRef = useRef(false);

  // Track scroll for sticky header
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Increment visit counter once on load
  useEffect(() => {
    if (actor && !isFetching && !hasIncrementedRef.current) {
      hasIncrementedRef.current = true;
      actor.incrementVisitCounter().catch(() => {});
    }
  }, [actor, isFetching]);

  function openOrderModal(product: ProductKey) {
    setSelectedProduct(product);
    setOrderOpen(true);
  }

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Benefits", id: "benefits" },
    { label: "Products", id: "products" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Toaster position="top-right" richColors />

      {/* ── Sticky Header ────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-card/95 backdrop-blur-md shadow-[0_2px_24px_oklch(0.35_0.1_145/0.12)] border-b border-border/60"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2.5 group"
            aria-label="MoriPure home"
          >
            <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center shadow-green">
              <Leaf className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-forest tracking-tight">
              MoriPure
            </span>
          </button>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="nav-link text-sm font-semibold text-foreground/75 hover:text-forest transition-colors duration-200"
                data-ocid={`nav.${link.id}.link`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="hidden md:flex rounded-xl bg-forest text-primary-foreground hover:opacity-90 font-semibold shadow-green px-5"
              onClick={() => openOrderModal("g250")}
            >
              Order Now
            </Button>
            <button
              type="button"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="md:hidden overflow-hidden bg-card/98 backdrop-blur-md border-t border-border/60"
            >
              <nav className="flex flex-col px-6 py-4 gap-1">
                {navLinks.map((link) => (
                  <button
                    type="button"
                    key={link.id}
                    onClick={() => {
                      scrollTo(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-3 px-4 rounded-xl text-sm font-semibold text-foreground/80 hover:text-forest hover:bg-secondary transition-colors"
                    data-ocid={`nav.${link.id}.link`}
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  className="mt-2 rounded-xl bg-forest text-primary-foreground font-semibold shadow-green"
                  onClick={() => {
                    openOrderModal("g250");
                    setMobileMenuOpen(false);
                  }}
                >
                  Order Now
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden hero-gradient"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/hero-moringa.dim_1200x600.jpg"
            alt="Fresh moringa powder in a ceramic bowl surrounded by moringa leaves"
            className="w-full h-full object-cover opacity-20 mix-blend-multiply"
            loading="eager"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>

        {/* Floating leaf decorations */}
        <div
          className="absolute top-28 right-[15%] opacity-20 float-animation pointer-events-none"
          aria-hidden
        >
          <Leaf className="w-20 h-20 text-forest rotate-12" />
        </div>
        <div
          className="absolute bottom-32 right-[30%] opacity-15 pointer-events-none"
          style={{ animation: "float-leaf 6s ease-in-out infinite 1.5s" }}
          aria-hidden
        >
          <Sprout className="w-14 h-14 text-forest -rotate-20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-secondary border border-border/70 px-4 py-1.5 text-xs font-semibold text-forest uppercase tracking-widest mb-6"
            >
              <Leaf className="w-3.5 h-3.5" />
              100% Organic & Natural
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-forest leading-[1.1] tracking-tight mb-6"
            >
              100% Natural
              <br />
              <span className="text-leaf">Moringa</span>
              <br />
              Powder
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-foreground/70 max-w-md mb-10 leading-relaxed"
            >
              Boost your health with nature's most potent superfood. Farm-fresh,
              cold-processed, and lab-certified for maximum potency.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="rounded-2xl bg-forest text-primary-foreground hover:opacity-90 font-semibold shadow-green-lg text-base px-8 h-13"
                onClick={() => openOrderModal("g250")}
                data-ocid="hero.primary_button"
              >
                Order Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl border-2 border-forest text-forest hover:bg-secondary font-semibold text-base px-8 h-13"
                onClick={() => scrollTo("benefits")}
                data-ocid="hero.secondary_button"
              >
                Learn More
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-12 text-sm text-muted-foreground"
            >
              {[
                "FSSAI Certified",
                "No Additives",
                "Vegan Friendly",
                "Free Shipping ₹500+",
              ].map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-leaf" />
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Hero image card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-4xl overflow-hidden shadow-green-lg border border-border/40">
              <img
                src="/assets/generated/hero-moringa.dim_1200x600.jpg"
                alt="Premium MoriPure moringa powder"
                className="w-full h-[480px] object-cover"
              />
              {/* Floating stat card */}
              <div className="absolute bottom-6 left-6 bg-card/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-green border border-border/60">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Daily Visitors Love
                </p>
                <p className="font-display text-2xl font-bold text-forest">
                  92 Nutrients
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  in every serving
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-xs font-medium text-foreground tracking-wider uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </section>

      {/* ── Why MoriPure Section ──────────────────────────────────────── */}
      <section id="about" className="py-24 section-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-leaf">
              Our Promise
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-forest mt-3 mb-4 tracking-tight">
              Why MoriPure?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              Our moringa powder is made from fresh leaves, naturally dried to
              lock in every nutrient. No fillers. No preservatives. Just pure,
              potent moringa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {WHY_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="card-hover"
              >
                <div className="bg-card rounded-3xl p-8 shadow-card h-full border border-border/50 relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-secondary/60 blur-2xl" />

                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 shadow-xs border border-border/60">
                      <feature.icon className="w-7 h-7 text-forest" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Health Benefits Section ───────────────────────────────────── */}
      <section id="benefits" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-leaf">
              Science-Backed
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-forest mt-3 mb-4 tracking-tight">
              Health Benefits
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              Moringa has been used in Ayurveda for 4,000 years. Modern science
              confirms what ancient wisdom always knew.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="card-hover"
              >
                <div className="bg-card rounded-3xl p-7 shadow-card border border-border/50 h-full">
                  <div
                    className={`w-12 h-12 rounded-2xl ${benefit.bg} flex items-center justify-center mb-5`}
                  >
                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2.5">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products Section ─────────────────────────────────────────── */}
      <section id="products" className="py-24 section-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-leaf">
              Shop
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-forest mt-3 mb-4 tracking-tight">
              Our Products
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              Choose the pack that fits your lifestyle. All products ship within
              2–3 business days.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {PRODUCTS.map((product, i) => (
              <motion.div
                key={product.key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className={`card-hover relative ${product.popular ? "md:-mt-4 md:mb-0 z-10" : ""}`}
                data-ocid={`products.item.${i + 1}`}
              >
                {product.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-forest text-primary-foreground text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-green">
                      Most Popular
                    </span>
                  </div>
                )}
                <div
                  className={`bg-card rounded-3xl p-8 shadow-card border h-full flex flex-col ${
                    product.popular
                      ? "border-forest/30 ring-1 ring-forest/20 shadow-green"
                      : "border-border/50"
                  }`}
                >
                  {/* Product visual */}
                  <div className="relative rounded-2xl overflow-hidden mb-6 bg-secondary/60 aspect-[4/3]">
                    <img
                      src="/assets/generated/hero-moringa.dim_1200x600.jpg"
                      alt={`MoriPure ${product.weight} Moringa Powder`}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-border/60">
                      <span className="font-heading text-sm font-bold text-forest">
                        {product.weight}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-foreground mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-border/50">
                    <div>
                      <span className="font-display text-3xl font-bold text-forest">
                        {product.price}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        / {product.weight}
                      </span>
                    </div>
                    <Button
                      className={`rounded-xl font-semibold shadow-green px-6 ${
                        product.popular
                          ? "bg-forest text-primary-foreground hover:opacity-90"
                          : "bg-secondary text-secondary-foreground hover:bg-forest hover:text-primary-foreground border border-border/70"
                      }`}
                      onClick={() => openOrderModal(product.key)}
                      data-ocid={`products.buy_button.${i + 1}`}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Section ───────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-leaf">
              Get in Touch
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-forest mt-3 mb-4 tracking-tight">
              Contact Us
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              Questions about your order or our products? We'd love to hear from
              you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
              className="space-y-6"
            >
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border/50">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                  Reach Out Directly
                </h3>
                <div className="space-y-5">
                  <a
                    href="mailto:support@moripure.com"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-secondary border border-border/60 flex items-center justify-center shrink-0 group-hover:bg-forest group-hover:border-forest transition-colors">
                      <Mail className="w-5 h-5 text-forest group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
                        Email
                      </p>
                      <p className="font-semibold text-foreground group-hover:text-forest transition-colors">
                        support@moripure.com
                      </p>
                    </div>
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-secondary border border-border/60 flex items-center justify-center shrink-0 group-hover:bg-forest group-hover:border-forest transition-colors">
                      <Phone className="w-5 h-5 text-forest group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
                        Phone
                      </p>
                      <p className="font-semibold text-foreground group-hover:text-forest transition-colors">
                        +91 98765 43210
                      </p>
                    </div>
                  </a>
                </div>

                <div className="mt-8 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-4 font-medium">
                    Business Hours
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Mon – Sat</span>
                      <span className="font-semibold text-foreground">
                        9:00 AM – 6:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Sunday</span>
                      <span className="font-medium text-muted-foreground">
                        Closed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-forest-deep text-primary-foreground">
        {/* Top divider */}
        <div className="h-1 bg-gradient-to-r from-transparent via-leaf/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary-foreground/15 border border-primary-foreground/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display text-2xl font-bold tracking-tight">
                  MoriPure
                </span>
              </div>
              <p className="text-primary-foreground/65 text-sm leading-relaxed max-w-xs">
                Pure Moringa. Pure Health. Bringing nature's most powerful
                superfood to your daily wellness routine since 2022.
              </p>
              {/* Social icons */}
              <div className="flex gap-3 mt-5">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Facebook, label: "Facebook" },
                  { icon: Youtube, label: "YouTube" },
                  { icon: Twitter, label: "X / Twitter" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    type="button"
                    key={label}
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 border border-primary-foreground/15 flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4 text-primary-foreground/75" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-primary-foreground/50 mb-4">
                Navigate
              </h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(link.id)}
                      className="text-sm text-primary-foreground/65 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-primary-foreground/50 mb-4">
                Products
              </h4>
              <ul className="space-y-2.5">
                {PRODUCTS.map((p) => (
                  <li key={p.key}>
                    <button
                      type="button"
                      onClick={() => openOrderModal(p.key)}
                      className="text-sm text-primary-foreground/65 hover:text-primary-foreground transition-colors text-left"
                    >
                      {p.weight} Moringa Powder — {p.price}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-primary-foreground/50 text-sm">
              © {new Date().getFullYear()} MoriPure. All Rights Reserved.
            </p>
            <p className="text-primary-foreground/40 text-xs">
              Built with{" "}
              <Heart className="inline w-3 h-3 mx-0.5 text-red-400/70" /> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-primary-foreground/60 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ── Order Modal ───────────────────────────────────────────────── */}
      <OrderModal
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        defaultProduct={selectedProduct}
        actor={actor}
      />
    </div>
  );
}

// ─── Contact Form (separate component) ───────────────────────────────────────

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Simulate a brief delay
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message sent! We'll get back to you within 24 hours.", {
      description: `Hi ${name}, thanks for reaching out!`,
    });
    setName("");
    setEmail("");
    setMessage("");
    setSubmitting(false);
  }

  return (
    <div className="bg-card rounded-3xl p-8 shadow-card border border-border/50">
      <h3 className="font-heading text-xl font-bold text-foreground mb-6">
        Send a Message
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name" className="text-sm font-medium">
            Your Name
          </Label>
          <Input
            id="contact-name"
            placeholder="Rahul Mehta"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl h-11 border-border/80"
            data-ocid="contact.form.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl h-11 border-border/80"
            data-ocid="contact.form.email.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-message" className="text-sm font-medium">
            Message
          </Label>
          <Textarea
            id="contact-message"
            placeholder="How can we help you today?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="rounded-xl border-border/80 resize-none"
            data-ocid="contact.form.textarea"
          />
        </div>
        <Button
          type="submit"
          className="w-full rounded-xl h-11 bg-forest text-primary-foreground hover:opacity-90 font-semibold shadow-green"
          disabled={submitting}
          data-ocid="contact.form.submit_button"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending…
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  );
}
