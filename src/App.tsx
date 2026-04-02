import { motion } from "motion/react";
import { 
  ArrowRight, 
  Bot, 
  Code, 
  Cpu, 
  Globe, 
  Home, 
  LayoutGrid, 
  Mail, 
  MessageSquare, 
  MessageCircle,
  Send, 
  Smartphone, 
  Zap,
  CheckCircle2,
  Briefcase,
  ChevronDown,
  Search,
  Bell,
  Plus,
  Trash2,
  Save,
  Eye,
  Info,
  AlertTriangle,
  X,
  Sparkles,
  Calendar,
  Flame,
  Star,
  Users,
  Lightbulb,
  ArrowUpRight,
  Loader2,
  FileText
} from "lucide-react";
import { useState, FormEvent, useEffect, useRef } from "react";
import { DevDashboard } from "./components/admin/DevDashboard";
import { NotificationDashboard } from "./components/admin/NotificationDashboard";
import { BookingModal } from "./components/BookingModal";

// Types for dynamic content
interface Service {
  id: string;
  icon: string;
  title: string;
  desc: string;
  image?: string;
  link?: string;
  category?: string;
  isPopular?: boolean;
  tags?: string[];
  features?: string[];
  price?: string;
}

interface Contact {
  id: string;
  type: 'whatsapp' | 'email' | 'comeup' | 'other';
  label: string;
  value: string;
  color: string;
}

interface Project {
  id: string;
  tag: string;
  title: string;
  desc: string;
  problem: string;
  solution: string;
  features: string[];
  image: string;
  link?: string;
}

export default function App() {
  // Default Data
  const defaultProjects: Project[] = [
    {
      id: 'p1',
      tag: "GENERATION CLIENTS",
      title: "Système de génération de clients",
      desc: "Un système qui travaille pour vous 24h/24 pour trouver et contacter vos futurs clients.",
      problem: "La prospection manuelle est lente, répétitive et inefficace.",
      solution: "Mise en place d'un système autonome qui identifie des prospects ciblés, structure les données automatiquement, lance des prises de contact intelligentes.",
      features: ["ACQUISITION CONTINUE", "GAIN DE TEMPS"],
      image: "https://picsum.photos/seed/kinetic-proj1/1200/600"
    },
    {
      id: 'p2',
      tag: "CHATBOT IA",
      title: "Chatbot intelligent",
      desc: "Ne perdez plus aucun client par manque de réactivité.",
      problem: "Les prospects quittent souvent un site sans réponse.",
      solution: "Un chatbot intelligent qui : répond en temps réel, guide les utilisateurs, redirige vers WhatsApp ou email.",
      features: ["RÉACTIVITÉ INSTANTANÉE", "MEILLEURE CONVERSION"],
      image: "https://picsum.photos/seed/kinetic-proj2/1200/600"
    }
  ];

  const defaultServices: Service[] = [
    { 
      id: '1', 
      icon: 'Cpu', 
      title: "Automatisation Prospection 360°", 
      desc: "Système complet d'automatisation de prospection end-to-end",
      category: "AUTOMATISATION",
      isPopular: true,
      tags: ["Automation", "CRM", "AI", "Multi-channel"],
      features: ["Génération de leads", "Qualification intelligente", "Messages personnalisés dynamiques", "Relances multicanales"],
      price: "5000€"
    },
    { 
      id: '2', 
      icon: 'Bot', 
      title: "Social Media Automation Suite", 
      desc: "Automatisation complète de tous vos canaux sociaux",
      category: "MARKETING DIGITAL",
      isPopular: true,
      tags: ["Social Media API", "Automation", "AI Content", "Chatbot"],
      features: ["Multi-plateformes (FB, IG, X, LinkedIn, YouTube)", "Publication automatique posts/stories", "Chatbot inbox intelligent", "Gestion automatique des commentaires"],
      price: "3500€"
    },
    { 
      id: '3', 
      icon: 'Globe', 
      title: "Développement web", 
      desc: "Création de sites et d'applications web modernes, rapides et performants.",
      category: "DÉVELOPPEMENT",
      tags: ["React", "Next.js", "Tailwind", "Full-stack"],
      features: ["Performance optimisée", "Design moderne", "SEO friendly", "Responsive design"],
      price: "2500€"
    }
  ];

  const defaultContacts: Contact[] = [
    { id: 'c1', type: 'email', label: 'Email', value: 'mailto:contact@moussa-ram.com', color: '#a855f7' },
    { id: 'c2', type: 'whatsapp', label: 'WhatsApp', value: 'https://wa.me/yournumber', color: '#22c55e' },
    { id: 'c3', type: 'comeup', label: 'ComeUp', value: 'https://comeup.com/profil/yourprofile', color: '#eab308' },
    { id: 'c4', type: 'other', label: 'Upwork', value: 'https://upwork.com/yourprofile', color: '#0ea5e9' }
  ];

  // State
  const [services, setServices] = useState<Service[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState({ 
    name: "Moussa RAM", 
    avatar: "https://picsum.photos/seed/moussa-avatar/100/100",
    accentColor: "#818cf8"
  });
  const [isDevMode, setIsDevMode] = useState(false);
  const [devPassword, setDevPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [adminTab, setAdminTab] = useState<'dev' | 'notification'>('dev');
  const [devSubTab, setDevSubTab] = useState<'main' | 'profil' | 'services' | 'projects' | 'contacts'>('main');
  const [isSaving, setIsSaving] = useState(false);
  const [siteNotification, setSiteNotification] = useState({ enabled: false, message: "", type: 'info' as 'info' | 'warning' | 'success' });
  const [bookings, setBookings] = useState<any[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedServices = localStorage.getItem('moussa_services');
    const savedContacts = localStorage.getItem('moussa_contacts');
    const savedProjects = localStorage.getItem('moussa_projects');
    const savedBookings = localStorage.getItem('moussa_bookings');
    
    setServices(savedServices ? JSON.parse(savedServices) : defaultServices);
    setContacts(savedContacts ? JSON.parse(savedContacts) : defaultContacts);
    setProjects(savedProjects ? JSON.parse(savedProjects) : defaultProjects);
    setBookings(savedBookings ? JSON.parse(savedBookings) : []);
    
    const savedProfile = localStorage.getItem('moussa_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({
        ...parsed,
        accentColor: parsed.accentColor || "#818cf8"
      });
    }

    const savedNotification = localStorage.getItem('moussa_notification');
    if (savedNotification) setSiteNotification(JSON.parse(savedNotification));
  }, []);

  // Save to localStorage
  const saveProfile = (newProfile: { name: string, avatar: string, accentColor: string }) => {
    setIsSaving(true);
    setProfile(newProfile);
    localStorage.setItem('moussa_profile', JSON.stringify(newProfile));
    setTimeout(() => setIsSaving(false), 800);
  };

  const saveNotification = (newNotif: typeof siteNotification) => {
    setIsSaving(true);
    setSiteNotification(newNotif);
    localStorage.setItem('moussa_notification', JSON.stringify(newNotif));
    setTimeout(() => setIsSaving(false), 800);
  };
  const saveServices = (newServices: Service[]) => {
    setIsSaving(true);
    setServices(newServices);
    localStorage.setItem('moussa_services', JSON.stringify(newServices));
    setTimeout(() => setIsSaving(false), 800);
  };

  const saveContacts = (newContacts: Contact[]) => {
    setIsSaving(true);
    setContacts(newContacts);
    localStorage.setItem('moussa_contacts', JSON.stringify(newContacts));
    setTimeout(() => setIsSaving(false), 800);
  };

  const saveBookings = (newBookings: any[]) => {
    setIsSaving(true);
    setBookings(newBookings);
    localStorage.setItem('moussa_bookings', JSON.stringify(newBookings));
    setTimeout(() => setIsSaving(false), 800);
  };

  const saveProjects = (newProjects: Project[]) => {
    setIsSaving(true);
    setProjects(newProjects);
    localStorage.setItem('moussa_projects', JSON.stringify(newProjects));
    setTimeout(() => setIsSaving(false), 800);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState<'home' | 'services' | 'reviews' | 'partners' | 'blog'>('home');
  const [projectSearch, setProjectSearch] = useState("");

  const scrollToSection = (id: string) => {
    if (view !== 'home') {
      setView('home');
      // Wait for the view to switch and elements to render
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-bg text-white selection:bg-accent selection:text-black scroll-smooth" style={{ "--color-accent": profile.accentColor } as any}>
      {/* Site Notification Banner */}
      {siteNotification.enabled && siteNotification.message && (
        <div className={`fixed top-0 left-0 w-full z-[60] py-2 px-6 text-center text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 ${
          siteNotification.type === 'warning' ? 'bg-yellow-500 text-black' : 
          siteNotification.type === 'success' ? 'bg-green-500 text-black' : 
          'bg-accent text-black'
        }`}>
          <Bell size={14} />
          {siteNotification.message}
          <button onClick={() => setSiteNotification({ ...siteNotification, enabled: false })} className="ml-4 opacity-50 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-bg/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xl font-display font-bold tracking-tight uppercase">{profile.name}</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors md:hidden z-50"
        >
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-0' : ''}`} />
        </button>
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:bg-accent/10 hover:border-accent/20 transition-all group relative overflow-hidden"
            title="Réserver un appel"
          >
            <div className="absolute inset-0 animate-shine opacity-0 group-hover:opacity-100 transition-opacity" />
            <Calendar size={18} className="relative z-10" />
          </button>
          <button 
            onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`text-sm font-medium transition-colors ${view === 'home' ? 'text-accent' : 'text-white/60 hover:text-accent'}`}
          >
            ACCUEIL
          </button>
          <button 
            onClick={() => { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`text-sm font-medium transition-colors ${view === 'services' ? 'text-accent' : 'text-white/60 hover:text-accent'}`}
          >
            SERVICES
          </button>
          
          <button 
            onClick={() => { setView('reviews'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`text-sm font-medium transition-colors ${view === 'reviews' ? 'text-accent' : 'text-white/60 hover:text-accent'}`}
          >
            AVIS
          </button>

          <button 
            onClick={() => { setView('partners'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`text-sm font-medium transition-colors ${view === 'partners' ? 'text-accent' : 'text-white/60 hover:text-accent'}`}
          >
            PARTENAIRES
          </button>

          <button 
            onClick={() => { setView('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`text-sm font-medium transition-colors ${view === 'blog' ? 'text-accent' : 'text-white/60 hover:text-accent'}`}
          >
            BLOG
          </button>

          <button 
            onClick={() => scrollToSection('portfolio')}
            className="text-sm font-medium text-white/60 hover:text-accent transition-colors"
          >
            PORTFOLIO
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="px-5 py-2 rounded-full bg-accent text-black text-sm font-bold hover:scale-105 transition-transform relative overflow-hidden group"
          >
            <div className="absolute inset-0 animate-shine opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">ME CONTACTER</span>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <motion.div 
        initial={false}
        animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-40 bg-bg flex flex-col p-8 pt-24 md:hidden"
      >
        <div className="flex flex-col gap-6">
          {[
            { name: 'Accueil', id: 'home', action: () => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); } },
            { name: 'Services', id: 'services', action: () => { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); } },
            { name: 'Avis Clients', id: 'reviews', action: () => { setView('reviews'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); } },
            { name: 'Partenariats', id: 'partners', action: () => { setView('partners'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); } },
            { name: 'Blog', id: 'blog', action: () => { setView('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); } },
            { name: 'Projets', id: 'portfolio', action: () => { setView('home'); setTimeout(() => scrollToSection('portfolio'), 100); setIsMenuOpen(false); } },
            { name: 'Contact', id: 'contact', action: () => { setView('home'); setTimeout(() => scrollToSection('contact'), 100); setIsMenuOpen(false); } }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={item.action}
              className={`text-lg font-display font-medium text-left px-5 py-3 rounded-2xl transition-all ${
                view === item.id
                  ? 'bg-accent/10 text-accent border border-accent/20' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="mt-auto">
          <button 
            onClick={() => { setIsBookingModalOpen(true); setIsMenuOpen(false); }}
            className="w-full py-5 rounded-2xl bg-accent text-black font-bold text-lg shadow-lg hover:brightness-110 transition-all relative overflow-hidden group"
          >
            <div className="absolute inset-0 animate-shine" />
            <span className="relative z-10">Réserver un appel</span>
          </button>
        </div>
      </motion.div>

      {view === 'home' ? (
        <>
          {/* Hero Section */}
          <section id="home" className="pt-32 pb-20 px-6 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 relative overflow-hidden group"
            >
              <div className="absolute inset-0 animate-shine opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse relative z-10" />
              <span className="text-[10px] uppercase tracking-widest font-semibold text-white/60 relative z-10">DISPONIBLE POUR DE NOUVEAUX PROJETS</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-display font-bold leading-[1.1] mb-6 max-w-4xl"
            >
              Automatisez votre croissance. <span className="text-accent italic relative inline-block">
                Générez plus de clients sans effort.
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 h-1 bg-accent/30 rounded-full"
                />
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg md:text-xl mb-10 max-w-3xl leading-relaxed"
            >
              De l'IA aux SaaS, de la prospection au scraping : des systèmes complets qui fonctionnent 24/7 pendant que vous vous concentrez sur l'essentiel.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4 w-full max-w-xs"
            >
              <button 
                onClick={() => setIsBookingModalOpen(true)} 
                className="btn-primary py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 animate-shine" />
                <Sparkles size={20} className="text-white relative z-10" />
                <span className="relative z-10">Réserver un appel</span>
              </button>
              <button 
                onClick={() => { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="btn-outline py-4 px-8 rounded-2xl flex items-center justify-center gap-3 border-accent text-white hover:bg-accent/10"
              >
                Voir mes services
                <ArrowRight size={20} className="text-accent" />
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 animate-bounce text-white/20"
            >
              <ChevronDown size={32} />
            </motion.div>
          </section>

          {/* About Section */}
          <section id="about" className="py-20 px-6 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10">
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-full h-full object-cover grayscale brightness-75"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#111] border border-white/10 p-6 rounded-2xl shadow-2xl">
                  <div className="text-3xl font-bold text-accent">50+</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">Projets livrés</div>
                </div>
              </div>

              <div>
                <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">À propos</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Une expertise hybride pour des résultats concrets.</h2>
                <p className="text-white/60 mb-8 leading-relaxed">
                  Je suis spécialisé dans la création de systèmes digitaux qui simplifient, automatisent et accélèrent le développement des entreprises. Mon approche est simple : analyser, automatiser, optimiser.
                </p>
                <p className="text-white/60 mb-10 leading-relaxed">
                  Chaque solution que je développe est pensée pour générer un impact réel : plus de clients, plus de temps, plus de performance.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border-l-2 border-accent">
                    <div className="text-sm font-bold mb-1">VITESSE</div>
                    <div className="text-[10px] text-white/40 uppercase">Déploiement agile & rapide</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border-l-2 border-purple-500">
                    <div className="text-sm font-bold mb-1">INTELLIGENCE</div>
                    <div className="text-[10px] text-white/40 uppercase">LLMs & Intégrations IA</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <section className="py-20 px-6 max-w-6xl mx-auto">
            <div className="glass-card p-10 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Cpu className="text-accent" size={40} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-display font-bold mb-6">Vision</h2>
                <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
                  Automatisation réellement end-to-end, pas outil par outil. Architecture système pensée pour la scalabilité.
                </p>
              </div>
              {/* Decorative element */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-20 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">Mes services</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold">Solutions Next-Gen</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {services.slice(0, 4).map((service, i) => {
                const IconComponent = { Cpu, Bot, Globe, Smartphone }[service.icon] || Cpu;
                return (
                  <div key={service.id} className="glass-card flex flex-col gap-4 relative overflow-hidden group">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                      <IconComponent className="text-accent" />
                    </div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{service.desc}</p>
                    {service.link && <a href="#" className="text-accent text-xs font-bold mt-2 uppercase tracking-widest">{service.link}</a>}
                    <div className="absolute -bottom-4 -right-4 text-white/5 font-display text-8xl font-bold group-hover:text-accent/5 transition-colors">
                      {i + 1}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 text-center">
              <button 
                onClick={() => { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="btn-secondary px-8 py-3"
              >
                VOIR TOUS LES SERVICES
              </button>
            </div>
          </section>

          {/* Portfolio Section */}
          <section id="portfolio" className="py-20 px-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="flex-1 w-full">
                <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">Portfolio</span>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Projets récents</h2>
                
                {/* Search Bar */}
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="text"
                    placeholder="Rechercher un projet..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-accent/50 focus:outline-none transition-colors"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={() => { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-xs uppercase tracking-widest font-bold border-b border-accent pb-1 whitespace-nowrap"
              >
                Voir les services
              </button>
            </div>

            <div className="space-y-12">
              {projects.filter(p => 
                p.title.toLowerCase().includes(projectSearch.toLowerCase()) || 
                p.desc.toLowerCase().includes(projectSearch.toLowerCase())
              ).length > 0 ? (
                projects.filter(p => 
                  p.title.toLowerCase().includes(projectSearch.toLowerCase()) || 
                  p.desc.toLowerCase().includes(projectSearch.toLowerCase())
                ).map((project, i) => (
                  <motion.div 
                    key={project.id} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-0 overflow-hidden"
                  >
                    <div className="aspect-[2/1] bg-white/5 relative">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-60"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 left-6 px-3 py-1 rounded bg-accent/20 border border-accent/30 text-[10px] font-bold text-accent">
                        {project.tag}
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                      <p className="text-white/60 mb-6">{project.desc}</p>
                      
                      <div className="space-y-4 mb-8">
                        <div className="text-xs">
                          <span className="font-bold text-white/40 uppercase mr-2">Problème:</span>
                          <span className="text-white/80">{project.problem}</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-white/40 uppercase mr-2">Solution:</span>
                          <span className="text-white/80">{project.solution}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-8">
                        {project.features.map((f, j) => (
                          <div key={j} className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase">
                            <CheckCircle2 size={14} />
                            {f}
                          </div>
                        ))}
                      </div>

                      <a 
                        href={project.link || "https://picsum.photos/seed/demo/1200/800"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-secondary py-3 px-6 text-sm inline-block text-center"
                      >
                        VOIR LA DÉMO
                      </a>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center glass-card">
                  <Search className="mx-auto text-white/10 mb-4" size={48} />
                  <p className="text-white/40">Aucun projet ne correspond à votre recherche.</p>
                  <button 
                    onClick={() => setProjectSearch("")}
                    className="mt-4 text-accent text-sm font-bold uppercase tracking-widest"
                  >
                    Effacer la recherche
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ComeUp Profile Section */}
          <section className="py-20 px-6 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">Passez à l’action dès maintenant</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Mon profil <span className="text-accent italic font-normal">ComeUp</span>
              </h2>
              <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                Ils me font déjà confiance. Découvrez mes services et avis clients directement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card p-0 overflow-hidden mb-10 border-white/10"
            >
              <div className="w-full h-[600px] bg-white/5 relative">
                <iframe
                  src="https://comeup.com/fr/@moussaram"
                  title="Profil ComeUp"
                  className="w-full h-full border-none"
                  allowFullScreen
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <a
                href="https://comeup.com/fr/@moussaram"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-4 px-10 rounded-2xl inline-flex items-center gap-3 shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
              >
                Voir mon profil complet
                <ArrowUpRight size={20} />
              </a>
            </motion.div>
          </section>

          {/* Features Icons Section */}
          <section className="py-20 px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { icon: <Zap size={32} />, title: "Approche orientée résultats", desc: "Chaque projet est conçu pour générer un impact mesurable sur votre business." },
              { icon: <LayoutGrid size={32} />, title: "Solutions sur mesure", desc: "Des systèmes adaptés à vos besoins réels pour une intégration parfaite dans votre flux de travail." },
              { icon: <Globe size={32} />, title: "Gain de temps et efficacité", desc: "Automatisation des tâches clés pour vous permettre de vous concentrer sur l'essentiel." },
              { icon: <CheckCircle2 size={32} />, title: "Exécution rapide et fiable", desc: "Des solutions livrées avec rigueur et performance, respectant vos délais les plus courts." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </section>

          {/* CTA Section */}
          <section id="contact" className="py-20 px-6 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Transformons votre business <span className="text-accent italic font-normal">dès maintenant</span>
            </h2>
            <p className="text-white/60 mb-12 max-w-xl mx-auto">
              Vous souhaitez automatiser vos processus ou générer plus de clients ? Discutons de votre projet.
            </p>

            <div className="flex flex-col gap-4 mb-16 max-w-xs mx-auto">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsBookingModalOpen(true)}
                className="btn-primary py-4 px-8 rounded-2xl flex items-center justify-center gap-3 mb-4 shadow-lg shadow-accent/20"
              >
                <Calendar size={20} className="text-white" />
                Réserver un appel
              </motion.button>
              
              {contacts.map((contact) => (
                <motion.a 
                  key={contact.id}
                  href={contact.value} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  whileHover={{ x: 5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between gap-4 p-2 pl-6 rounded-2xl transition-all shadow-lg"
                  style={{ backgroundColor: contact.color }}
                >
                  <span className="text-sm font-black text-white tracking-wide">
                    {contact.label}
                  </span>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-inner p-2.5">
                    {contact.type === 'whatsapp' && (
                      <img 
                        src="https://img.freepik.com/vecteurs-premium/logo-moderne-whatsapp-vert-blanc-est-parfait-pour-medias-sociaux_874723-459.jpg?semt=ais_hybrid&w=740&q=80" 
                        alt="WhatsApp" 
                        className="w-full h-full object-contain rounded-full" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {contact.type === 'email' && (
                      <img 
                        src="https://i.ytimg.com/vi/XgvBtNwrgY0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBOIqxoQ9mhAbW3XejSqLFJdCvD4w" 
                        alt="Email" 
                        className="w-full h-full object-contain rounded-full" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {contact.type === 'comeup' && (
                      <img 
                        src="https://yt3.googleusercontent.com/XqAkyLsOBvu_qjxLdnUmwP1N-d-HHW6ulR4beUb3A8KndOxraUzoExzZPj_4-g6-b09oVREqWw=s900-c-k-c0x00ffffff-no-rj" 
                        alt="ComeUp" 
                        className="w-full h-full object-contain rounded-full" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {contact.type === 'other' && (
                      <svg viewBox="0 0 24 24" fill="#0ea5e9" className="w-full h-full">
                        <path d="M18.561 3.312c-2.203 0-3.956 1.728-3.956 3.958v5.258c0 .125-.093.231-.222.231h-2.193c-.125 0-.222-.106-.222-.231V7.27c0-2.23-1.753-3.958-3.956-3.958s-3.956 1.728-3.956 3.958v7.464c0 .125-.093.231-.222.231H1.641c-.125 0-.222-.106-.222-.231V7.27c0-3.471 2.715-6.288 6.066-6.288s6.066 2.817 6.066 6.288v5.258c0 .125.093.231.222.231h2.193c.125 0 .222-.106.222-.231V7.27c0-3.471 2.715-6.288 6.066-6.288s6.066 2.817 6.066 6.288v7.464c0 3.471-2.715 6.288-6.066 6.288s-6.066-2.817-6.066-6.288v-5.258c0-.125.093-.231.222-.231h2.193c.125 0 .222.106.222.231V14.734c0 2.23 1.753 3.958 3.956 3.958s3.956-1.728 3.956-3.958V7.27c0-2.23-1.753-3.958-3.956-3.958z" />
                      </svg>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Form */}
            <div className="glass-card text-left max-w-xl mx-auto">
              {isSubmitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-accent" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message envoyé !</h3>
                  <p className="text-white/60">Je vous recontacterai dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">Nom complet</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Jean Dupont" 
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">Email professionnel</label>
                    <input 
                      type="email" 
                      required
                      placeholder="jean@entreprise.com" 
                      className="input-field"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">Message</label>
                    <textarea 
                      rows={4} 
                      required
                      placeholder="Décrivez votre projet..." 
                      className="input-field resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                    ENVOYER LA DEMANDE
                    <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </section>
        </>
      ) : view === 'services' ? (
        <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">Catalogue Complet</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Mes Services</h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Découvrez l'ensemble des solutions que je propose pour propulser votre activité grâce à l'automatisation et l'IA.
            </p>
          </motion.div>

          <div className="flex flex-col gap-12">
            {services.map((service, i) => {
              const IconComponent = { Cpu, Bot, Globe, Smartphone }[service.icon] || Cpu;
              return (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card flex flex-col p-0 overflow-hidden group border-white/5 hover:border-accent/20 transition-all duration-500"
                >
                  {/* Miniature Section */}
                  <div className="aspect-[21/9] w-full bg-[#0a0f1a] relative flex items-center justify-center overflow-hidden">
                    {service.image ? (
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center">
                        <IconComponent className="text-accent/40 w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] to-transparent opacity-60" />
                  </div>

                  {/* Content Section */}
                  <div className="p-8 md:p-10">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-white">{service.title}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      {service.category && (
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-black text-purple-400 tracking-widest uppercase">
                          {service.category}
                        </span>
                      )}
                      {service.isPopular && (
                        <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] font-black text-red-400 tracking-widest uppercase flex items-center gap-1.5">
                          <Flame size={12} />
                          POPULAIRE
                        </span>
                      )}
                    </div>

                    <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-3xl">
                      {service.desc}
                    </p>

                    {service.tags && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {service.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-white/40">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {service.features && (
                      <div className="grid sm:grid-cols-2 gap-4 mb-10">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm text-white/70">
                            <CheckCircle2 size={16} className="text-accent shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 pt-8 border-t border-white/5">
                      <div className="space-y-2">
                        <div className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20">À partir de</div>
                        <div className="text-4xl font-display font-bold text-accent">{service.price || 'Sur devis'}</div>
                      </div>

                      <button 
                        onClick={() => setIsBookingModalOpen(true)}
                        className="btn-primary py-4 px-8 rounded-2xl flex items-center justify-center gap-3 group/btn"
                      >
                        En savoir plus
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl font-display font-bold mb-8">Besoin d'une solution personnalisée ?</h2>
            <button 
              onClick={() => scrollToSection('contact')}
              className="btn-primary px-10"
            >
              DISCUTONS DE VOTRE PROJET
            </button>
          </div>
        </main>
      ) : view === 'reviews' ? (
        <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">● TÉMOIGNAGES VÉRIFIÉS</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Ce que disent <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent italic">nos clients</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Découvrez les retours authentiques de nos clients sur leurs projets d'automatisation et d'IA.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { label: "NOTE MOYENNE", value: "--", icon: <Star className="text-yellow-500 fill-yellow-500" size={16} /> },
              { label: "AVIS CLIENTS", value: "--", icon: null },
              { label: "SATISFACTION", value: "--%", icon: null }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-8 text-center border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">{stat.label}</div>
                <div className="text-3xl font-display font-bold text-white flex items-center justify-center gap-2">
                  {stat.value}
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['Tous', '5 étoiles', '4 étoiles', '▶ Avec vidéo'].map((filter, i) => (
              <button 
                key={i}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  i === 0 ? 'bg-accent text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Empty State */}
          <div className="py-20 text-center glass-card border-dashed border-white/10">
            <MessageSquare className="mx-auto text-white/10 mb-6" size={48} />
            <p className="text-white/40 font-medium">Aucun avis pour ce filtre</p>
          </div>

          {/* CTA Section */}
          <section className="mt-32 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-accent/20">
              <Plus className="text-accent" size={32} />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Partagez votre <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent italic">expérience</span>
            </h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Vous avez travaillé avec nous ? Votre retour nous aide à nous améliorer et inspire de futurs clients.
            </p>
            <button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-blue-500/20">
              ✏️ Laisser un avis
            </button>
          </section>
        </main>
      ) : view === 'partners' ? (
        <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">● PROGRAMME PARTENAIRE</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Devenez <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent italic">Partenaire</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Rejoignez notre réseau de partenaires et développons ensemble des solutions d'automatisation et d'IA innovantes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-accent to-purple-600 text-black font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                👑 Voir les tiers
              </button>
              <button className="px-8 py-4 rounded-2xl border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all">
                ➤ Postuler maintenant
              </button>
            </div>
          </motion.div>

          <div className="space-y-32">
            <section>
              <h2 className="text-2xl font-display font-bold mb-2 text-center">Niveaux de Partenariat</h2>
              <p className="text-white/40 text-center mb-12">Choisissez le tier qui correspond le mieux à votre ambition.</p>
              <div className="flex flex-col items-center justify-center py-20 glass-card border-white/5">
                <Loader2 className="animate-spin text-accent mb-4" size={32} />
                <p className="text-white/40 text-sm font-medium">Chargement des tiers...</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-2 text-center">Nos Partenaires</h2>
              <p className="text-white/40 text-center mb-12">Ils nous font confiance et participent à notre ecosystème.</p>
              <div className="flex flex-col items-center justify-center py-20 glass-card border-white/5">
                <Loader2 className="animate-spin text-accent mb-4" size={32} />
                <p className="text-white/40 text-sm font-medium">Chargement des partenaires...</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-display font-bold mb-16 text-center">Pourquoi devenir partenaire ?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: <Eye className="text-accent" />, title: "Visibilité", desc: "Votre marque mise en avant sur notre site, nos réseaux et nos présentations clients." },
                  { icon: <Users className="text-purple-500" />, title: "Réseau", desc: "Accès à un réseau d'experts en automatisation, IA et développement SaaS." },
                  { icon: <Lightbulb className="text-yellow-500" />, title: "Innovation", desc: "Collaborez sur des projets innovants et restez à la pointe de la technologie." }
                ].map((card, i) => (
                  <div key={i} className="glass-card p-8 border-white/5 group hover:border-accent/20 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold mb-4">Postuler au programme</h2>
                <p className="text-white/40">Remplissez ce formulaire et nous vous recontacterons dans les 48h.</p>
              </div>
              <div className="glass-card p-8 border-white/5">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">Nom de l'entreprise *</label>
                      <input type="text" required className="input-field" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">Nom du contact *</label>
                      <input type="text" required className="input-field" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">Email *</label>
                      <input type="email" required className="input-field" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">Téléphone</label>
                      <input type="tel" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">Site web</label>
                    <input type="url" className="input-field" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">Tier souhaité</label>
                    <select className="input-field appearance-none bg-[#0a0a0a]">
                      <option>-- Choisir --</option>
                      <option>Bronze</option>
                      <option>Silver</option>
                      <option>Gold</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">Message</label>
                    <textarea rows={4} className="input-field resize-none" />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-accent to-purple-600 text-black font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all">
                    ➤ Envoyer ma candidature
                  </button>
                </form>
              </div>
            </section>
          </div>
        </main>
      ) : view === 'blog' ? (
        <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">● ARTICLES & TUTORIELS</span>
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Articles, tutoriels et actualités sur l'automatisation, l'IA et le développement.
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12">
            <button className="px-6 py-2 rounded-full bg-accent text-black text-xs font-bold uppercase tracking-widest">
              Tous (0)
            </button>
          </div>

          {/* Empty State */}
          <div className="py-32 text-center glass-card border-dashed border-white/10">
            <FileText className="mx-auto text-white/5 mb-6" size={64} />
            <p className="text-white/20 text-xl font-display font-bold">Aucun article pour cette catégorie</p>
          </div>
        </main>
      ) : null}

      {/* Footer */}
      <footer className="py-20 px-6 text-center border-t border-white/5 relative">
        <div 
          className="text-accent font-display font-bold tracking-widest mb-6 uppercase cursor-pointer select-none"
          onDoubleClick={() => setIsDevMode(true)}
        >
          {profile.name}
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/20">
          © 2026 — TOUS DROITS RÉSERVÉS. AUTOMATISATION • DÉVELOPPEMENT WEB • SOLUTIONS INTELLIGENTES
        </div>
      </footer>

      {/* Developer Menu Overlay */}
      {isDevMode && (
        <div className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10">
          <div className="glass-card w-full max-w-6xl h-[90vh] flex flex-col md:flex-row overflow-hidden relative p-0 border-white/10">
            <button 
              onClick={() => { setIsDevMode(false); setIsAuth(false); }}
              className="absolute top-4 right-4 z-50 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Zap className="rotate-45 text-accent" size={20} />
            </button>

            {!isAuth ? (
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="w-full max-w-sm text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-accent/20">
                    <Code className="text-accent" size={32} />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-2 tracking-tight">Espace Admin</h2>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-8">Accès restreint</p>
                  
                  <div className="space-y-4">
                    <input 
                      type="password" 
                      placeholder="Mot de passe" 
                      className="input-field text-center tracking-[0.5em]"
                      value={devPassword}
                      onChange={(e) => setDevPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (devPassword === "admin" ? setIsAuth(true) : alert("Accès refusé"))}
                    />
                    <button 
                      onClick={() => { if(devPassword === "admin") setIsAuth(true); else alert("Accès refusé"); }}
                      className="btn-primary w-full py-4"
                    >
                      DÉVERROUILLER
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation Tabs */}
                <div className="px-8 pt-8 flex items-center justify-between border-b border-white/5">
                  <div className="flex gap-10">
                    <button 
                      onClick={() => setAdminTab('dev')}
                      className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative flex items-center gap-3 ${
                        adminTab === 'dev' ? 'text-accent' : 'text-white/30 hover:text-white'
                      }`}
                    >
                      <LayoutGrid size={16} className={adminTab === 'dev' ? 'text-accent' : 'text-white/20'} />
                      Menu Dev
                      {adminTab === 'dev' && (
                        <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(242,125,38,0.5)]" />
                      )}
                    </button>
                    <button 
                      onClick={() => setAdminTab('notification')}
                      className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative flex items-center gap-3 ${
                        adminTab === 'notification' ? 'text-accent' : 'text-white/30 hover:text-white'
                      }`}
                    >
                      <Bell size={16} className={adminTab === 'notification' ? 'text-accent' : 'text-white/20'} />
                      Notification
                      {adminTab === 'notification' && (
                        <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(242,125,38,0.5)]" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 pb-4">
                    <button 
                      onClick={() => setIsDevMode(false)}
                      className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-white/60 hover:text-white group"
                    >
                      <Eye size={14} className="group-hover:scale-110 transition-transform" />
                      Aperçu
                    </button>
                    <button 
                      onClick={() => { setIsDevMode(false); setIsAuth(false); }}
                      className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all text-red-400 group"
                    >
                      <X size={14} className="group-hover:rotate-90 transition-transform" />
                      Quitter
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar scroll-smooth">
                  {adminTab === 'dev' ? (
                    <DevDashboard 
                      profile={profile}
                      saveProfile={saveProfile}
                      services={services}
                      saveServices={saveServices}
                      projects={projects}
                      saveProjects={saveProjects}
                      contacts={contacts}
                      saveContacts={saveContacts}
                      devSubTab={devSubTab}
                      setDevSubTab={setDevSubTab}
                      isSaving={isSaving}
                    />
                  ) : (
                    <NotificationDashboard 
                      siteNotification={siteNotification}
                      saveNotification={saveNotification}
                      isSaving={isSaving}
                      bookings={bookings}
                      saveBookings={saveBookings}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Socials */}
      <div className="fixed right-6 bottom-32 z-40 flex flex-col gap-3 md:bottom-10">
        {contacts.map((contact) => (
          <a 
            key={contact.id}
            href={contact.value} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
            style={{ backgroundColor: contact.color }}
          >
            {contact.type === 'whatsapp' && (
              <img 
                src="https://img.freepik.com/vecteurs-premium/logo-moderne-whatsapp-vert-blanc-est-parfait-pour-medias-sociaux_874723-459.jpg?semt=ais_hybrid&w=740&q=80" 
                alt="WhatsApp" 
                className="w-5 h-5 object-contain rounded-full" 
                referrerPolicy="no-referrer"
              />
            )}
            {contact.type === 'email' && (
              <img 
                src="https://i.ytimg.com/vi/XgvBtNwrgY0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBOIqxoQ9mhAbW3XejSqLFJdCvD4w" 
                alt="Email" 
                className="w-5 h-5 object-contain rounded-full" 
                referrerPolicy="no-referrer"
              />
            )}
            {contact.type === 'comeup' && (
              <img 
                src="https://yt3.googleusercontent.com/XqAkyLsOBvu_qjxLdnUmwP1N-d-HHW6ulR4beUb3A8KndOxraUzoExzZPj_4-g6-b09oVREqWw=s900-c-k-c0x00ffffff-no-rj" 
                alt="ComeUp" 
                className="w-5 h-5 object-contain rounded-full" 
                referrerPolicy="no-referrer"
              />
            )}
            {contact.type === 'other' && (
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M18.561 3.312c-2.203 0-3.956 1.728-3.956 3.958v5.258c0 .125-.093.231-.222.231h-2.193c-.125 0-.222-.106-.222-.231V7.27c0-2.23-1.753-3.958-3.956-3.958s-3.956 1.728-3.956 3.958v7.464c0 .125-.093.231-.222.231H1.641c-.125 0-.222-.106-.222-.231V7.27c0-3.471 2.715-6.288 6.066-6.288s6.066 2.817 6.066 6.288v5.258c0 .125.093.231.222.231h2.193c.125 0 .222-.106.222-.231V7.27c0-3.471 2.715-6.288 6.066-6.288s6.066 2.817 6.066 6.288v7.464c0 3.471-2.715 6.288-6.066 6.288s-6.066-2.817-6.066-6.288v-5.258c0-.125.093-.231.222-.231h2.193c.125 0 .222.106.222.231V14.734c0 2.23 1.753 3.958 3.956 3.958s3.956-1.728 3.956-3.958V7.27c0-2.23-1.753-3.958-3.956-3.958z" />
              </svg>
            )}
          </a>
        ))}
      </div>

      {/* Floating Calendar */}
      <button 
        onClick={() => scrollToSection('contact')}
        className="fixed left-6 bottom-32 z-40 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-lg hover:bg-white/10 transition-colors md:bottom-10"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      </button>

      {/* Bottom Nav */}
      <nav className="nav-bottom">
        <button 
          onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
          className={view === 'home' ? "text-accent" : "text-white/40"}
        >
          <Home size={20} />
        </button>
        <button 
          onClick={() => { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
          className={view === 'services' ? "text-accent" : "text-white/40"}
        >
          <LayoutGrid size={20} />
        </button>
        <button 
          onClick={() => scrollToSection('portfolio')} 
          className="text-white/40 hover:text-white transition-colors"
        >
          <Briefcase size={20} />
        </button>
        <button 
          onClick={() => scrollToSection('contact')} 
          className="text-white/40 hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        </button>
      </nav>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSubmit={(booking) => {
          saveBookings([booking, ...bookings]);
        }}
      />
    </div>
  );
}
