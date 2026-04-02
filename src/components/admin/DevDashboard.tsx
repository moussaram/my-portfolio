import React from 'react';
import { 
  LayoutGrid, 
  Send, 
  Settings, 
  Shield, 
  ChevronRight, 
  Plus, 
  Edit3, 
  Trash2, 
  Cpu, 
  Globe, 
  Zap, 
  Lock, 
  Key, 
  Activity,
  Briefcase,
  User,
  ArrowLeft,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

interface Contact {
  id: string;
  type: 'whatsapp' | 'email' | 'comeup' | 'other';
  label: string;
  value: string;
  color: string;
}

interface DevDashboardProps {
  profile: { name: string; avatar: string; accentColor: string };
  saveProfile: (p: { name: string; avatar: string; accentColor: string }) => void;
  services: Service[];
  saveServices: (s: Service[]) => void;
  projects: Project[];
  saveProjects: (p: Project[]) => void;
  contacts: Contact[];
  saveContacts: (c: Contact[]) => void;
  devSubTab: 'profil' | 'services' | 'projects' | 'contacts' | 'main';
  setDevSubTab: (t: 'profil' | 'services' | 'projects' | 'contacts' | 'main') => void;
  isSaving: boolean;
}

export const DevDashboard: React.FC<DevDashboardProps> = ({
  profile,
  saveProfile,
  services,
  saveServices,
  projects,
  saveProjects,
  contacts,
  saveContacts,
  devSubTab,
  setDevSubTab,
  isSaving
}) => {
  
  const sections = [
    {
      title: "Gestion du Profil",
      items: [
        { id: 'profil', label: "Modifier le profil", sub: "Nom, avatar et identité", icon: <User size={18} /> },
      ]
    },
    {
      title: "Gestion des services",
      items: [
        { id: 'services', label: "Catalogue des services", sub: "Gérer vos offres et expertises", icon: <LayoutGrid size={18} /> },
      ]
    },
    {
      title: "Gestion du Portfolio",
      items: [
        { id: 'projects', label: "Projets & Réalisations", sub: "Mettre en avant vos travaux", icon: <Briefcase size={18} /> },
      ]
    },
    {
      title: "Gestion des contacts",
      items: [
        { id: 'contacts', label: "Canaux de communication", sub: "WhatsApp, Email, ComeUp...", icon: <Send size={18} /> },
      ]
    },
    {
      title: "Configuration",
      items: [
        { id: 'api', label: "Clés API", sub: "Gestion des intégrations externes", icon: <Key size={18} />, disabled: true },
        { id: 'auto', label: "Automatisation", sub: "Workflows et webhooks", icon: <Cpu size={18} />, disabled: true },
      ]
    },
    {
      title: "Sécurité",
      items: [
        { id: 'access', label: "Accès admin", sub: "Mots de passe et sessions", icon: <Lock size={18} />, disabled: true },
        { id: 'logs', label: "Logs d'activité", sub: "Historique des modifications", icon: <Activity size={18} />, disabled: true },
      ]
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderMain = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="space-y-10"
    >
      <div className="mb-12">
        <h2 className="text-3xl font-display font-bold tracking-tight text-white mb-2">Menu Développeur</h2>
        <p className="text-white/40 text-sm font-medium tracking-wide">Gérez l'intégralité de votre plateforme depuis cet espace centralisé.</p>
      </div>

      <div className="space-y-12">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-accent/60 ml-1">{section.title}</h3>
            <div className="border-t border-white/5">
              {section.items.map((item, iIdx) => (
                <button
                  key={iIdx}
                  onClick={() => !item.disabled && setDevSubTab(item.id as any)}
                  className={`w-full flex items-center justify-between py-5 border-b border-white/5 group transition-all ${item.disabled ? 'opacity-30 cursor-not-allowed' : 'hover:px-2'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${item.disabled ? 'bg-white/5 text-white/20' : 'bg-white/5 text-white/40 group-hover:bg-accent/10 group-hover:text-accent'}`}>
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <div className={`text-sm font-bold tracking-tight transition-colors ${item.disabled ? 'text-white/20' : 'text-white/80 group-hover:text-white'}`}>{item.label}</div>
                      <div className="text-[10px] text-white/20 font-medium uppercase tracking-widest mt-0.5">{item.sub}</div>
                    </div>
                  </div>
                  {!item.disabled && (
                    <ChevronRight size={16} className="text-white/10 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderHeader = (title: string, sub: string) => (
    <div className="flex items-center gap-6 mb-12">
      <button 
        onClick={() => setDevSubTab('main')}
        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:bg-accent/10 hover:border-accent/20 transition-all group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      </button>
      <div>
        <h2 className="text-2xl font-display font-bold tracking-tight text-white">{title}</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">{sub}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 sm:px-0">
      <AnimatePresence mode="wait">
        {devSubTab === 'main' ? renderMain() : (
          <motion.div
            key={devSubTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            {devSubTab === 'profil' && (
              <>
                {renderHeader("Modifier le profil", "Identité visuelle et informations de base")}
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Nom d'affichage</label>
                    <input 
                      className="w-full bg-transparent border-b border-white/10 focus:border-accent py-4 text-xl font-display font-bold outline-none transition-colors placeholder:text-white/5" 
                      value={profile.name} 
                      onChange={(e) => saveProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Avatar / Logo</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="relative group">
                        <img src={profile.avatar} className="w-24 h-24 rounded-2xl object-cover border border-white/10" referrerPolicy="no-referrer" />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                          <Plus size={24} className="text-white" />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => saveProfile({ ...profile, avatar: base64 }))}
                          />
                        </label>
                      </div>
                      <div className="flex-1 w-full">
                        <input 
                          className="w-full bg-transparent border-b border-white/10 focus:border-accent py-4 text-sm font-mono outline-none transition-colors" 
                          value={profile.avatar} 
                          onChange={(e) => saveProfile({ ...profile, avatar: e.target.value })}
                          placeholder="Ou entrez une URL d'image..."
                        />
                        <p className="text-[10px] text-white/20 mt-2 uppercase tracking-widest">Cliquez sur l'image pour uploader ou entrez une URL</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Couleur d'accentuation</label>
                    <div className="flex flex-wrap gap-4">
                      {['#818cf8', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#a855f7'].map((color) => (
                        <button
                          key={color}
                          onClick={() => saveProfile({ ...profile, accentColor: color })}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${profile.accentColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <div className="flex items-center gap-3 ml-2">
                        <input 
                          type="color" 
                          value={profile.accentColor}
                          onChange={(e) => saveProfile({ ...profile, accentColor: e.target.value })}
                          className="w-10 h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={profile.accentColor}
                          onChange={(e) => saveProfile({ ...profile, accentColor: e.target.value })}
                          className="bg-transparent border-b border-white/10 focus:border-accent py-1 text-xs font-mono outline-none w-20 uppercase"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">Cette couleur sera appliquée aux boutons, liens et éléments mis en avant.</p>
                  </div>
                </div>
              </>
            )}

            {devSubTab === 'services' && (
              <>
                <div className="flex justify-between items-center mb-12">
                  {renderHeader("Catalogue des services", "Gérez vos offres et expertises")}
                  <button 
                    onClick={() => saveServices([...services, { id: Date.now().toString(), icon: 'Cpu', title: 'Nouveau Service', desc: 'Description...' }])}
                    className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-black transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-12">
                  {services.map((s, idx) => (
                    <div key={s.id} className="glass-card p-8 space-y-8 relative group">
                      <button 
                        onClick={() => saveServices(services.filter(item => item.id !== s.id))}
                        className="absolute top-6 right-6 text-white/10 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Miniature / Icône</label>
                          <div className="relative aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden group/img">
                            {s.image ? (
                              <img src={s.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20">
                                <LayoutGrid size={32} />
                              </div>
                            )}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                              <Plus size={24} className="text-white" />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, (base64) => {
                                  const newServices = [...services];
                                  newServices[idx].image = base64;
                                  saveServices(newServices);
                                })}
                              />
                            </label>
                          </div>
                          <input 
                            className="w-full bg-transparent border-b border-white/10 focus:border-accent py-2 text-[10px] font-mono outline-none transition-colors" 
                            value={s.image || ''} 
                            onChange={(e) => {
                              const newServices = [...services];
                              newServices[idx].image = e.target.value;
                              saveServices(newServices);
                            }}
                            placeholder="URL de l'image..."
                          />
                        </div>

                        <div className="md:col-span-2 space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Titre du service</label>
                              <input 
                                className="w-full bg-transparent border-b border-white/10 focus:border-accent py-2 text-xl font-bold outline-none transition-colors" 
                                value={s.title} 
                                onChange={(e) => {
                                  const newServices = [...services];
                                  newServices[idx].title = e.target.value;
                                  saveServices(newServices);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Catégorie</label>
                              <input 
                                className="w-full bg-transparent border-b border-white/10 focus:border-accent py-2 text-xs text-purple-400 uppercase tracking-widest font-bold outline-none transition-colors" 
                                value={s.category || ''} 
                                onChange={(e) => {
                                  const newServices = [...services];
                                  newServices[idx].category = e.target.value;
                                  saveServices(newServices);
                                }}
                                placeholder="Ex: AUTOMATISATION"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <div 
                                onClick={() => {
                                  const newServices = [...services];
                                  newServices[idx].isPopular = !newServices[idx].isPopular;
                                  saveServices(newServices);
                                }}
                                className={`w-10 h-5 rounded-full transition-colors relative ${s.isPopular ? 'bg-red-500' : 'bg-white/10'}`}
                              >
                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${s.isPopular ? 'left-6' : 'left-1'}`} />
                              </div>
                              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 group-hover:text-white transition-colors flex items-center gap-1.5">
                                <Flame size={12} className={s.isPopular ? 'text-red-400' : ''} />
                                Badge Populaire
                              </span>
                            </label>

                            <div className="flex-1 space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Prix (ou texte)</label>
                              <input 
                                className="w-full bg-transparent border-b border-white/10 focus:border-accent py-1 text-sm font-bold text-accent outline-none transition-colors" 
                                value={s.price || ''} 
                                onChange={(e) => {
                                  const newServices = [...services];
                                  newServices[idx].price = e.target.value;
                                  saveServices(newServices);
                                }}
                                placeholder="Ex: 5000€"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Description</label>
                            <textarea 
                              className="w-full bg-white/5 rounded-xl p-4 text-sm text-white/60 outline-none focus:bg-white/10 transition-all resize-none h-24 leading-relaxed" 
                              value={s.desc}
                              onChange={(e) => {
                                const newServices = [...services];
                                newServices[idx].desc = e.target.value;
                                saveServices(newServices);
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Tags (virgules)</label>
                              <textarea 
                                className="w-full bg-white/5 rounded-xl p-4 text-[10px] text-white/40 outline-none focus:bg-white/10 transition-all resize-none h-20" 
                                value={s.tags?.join(', ') || ''}
                                onChange={(e) => {
                                  const newServices = [...services];
                                  newServices[idx].tags = e.target.value.split(',').map(t => t.trim()).filter(t => t !== '');
                                  saveServices(newServices);
                                }}
                                placeholder="Tag 1, Tag 2..."
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Fonctionnalités (virgules)</label>
                              <textarea 
                                className="w-full bg-white/5 rounded-xl p-4 text-[10px] text-white/40 outline-none focus:bg-white/10 transition-all resize-none h-20" 
                                value={s.features?.join(', ') || ''}
                                onChange={(e) => {
                                  const newServices = [...services];
                                  newServices[idx].features = e.target.value.split(',').map(f => f.trim()).filter(f => f !== '');
                                  saveServices(newServices);
                                }}
                                placeholder="Feature 1, Feature 2..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {devSubTab === 'projects' && (
              <>
                <div className="flex justify-between items-center mb-12">
                  {renderHeader("Gestion du Portfolio", "Mettez en avant vos meilleurs travaux")}
                  <button 
                    onClick={() => saveProjects([...projects, { 
                      id: Date.now().toString(), 
                      tag: 'IA', 
                      title: 'Nouveau Projet', 
                      desc: 'Description...', 
                      problem: '', 
                      solution: '', 
                      features: [], 
                      image: 'https://picsum.photos/seed/project/1200/800' 
                    }])}
                    className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-black transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-12">
                  {projects.map((p, idx) => (
                    <div key={p.id} className="glass-card p-8 space-y-8 relative group">
                      <button 
                        onClick={() => saveProjects(projects.filter(item => item.id !== p.id))}
                        className="absolute top-6 right-6 text-white/10 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Miniature du projet</label>
                          <div className="relative aspect-video rounded-2xl bg-white/5 border border-white/10 overflow-hidden group/img">
                            <img src={p.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                              <Plus size={24} className="text-white" />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, (base64) => {
                                  const newProjects = [...projects];
                                  newProjects[idx].image = base64;
                                  saveProjects(newProjects);
                                })}
                              />
                            </label>
                          </div>
                          <input 
                            className="w-full bg-transparent border-b border-white/10 focus:border-accent py-2 text-[10px] font-mono outline-none transition-colors" 
                            value={p.image} 
                            onChange={(e) => {
                              const newProjects = [...projects];
                              newProjects[idx].image = e.target.value;
                              saveProjects(newProjects);
                            }}
                            placeholder="URL de l'image..."
                          />
                        </div>

                        <div className="md:col-span-2 space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Titre</label>
                              <input 
                                className="w-full bg-transparent border-b border-white/10 focus:border-accent py-2 text-lg font-bold outline-none transition-colors" 
                                value={p.title} 
                                onChange={(e) => {
                                  const newProjects = [...projects];
                                  newProjects[idx].title = e.target.value;
                                  saveProjects(newProjects);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Tag / Catégorie</label>
                              <input 
                                className="w-full bg-transparent border-b border-white/10 focus:border-accent py-2 text-xs text-accent uppercase tracking-widest font-bold outline-none transition-colors" 
                                value={p.tag} 
                                onChange={(e) => {
                                  const newProjects = [...projects];
                                  newProjects[idx].tag = e.target.value;
                                  saveProjects(newProjects);
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Description courte</label>
                            <textarea 
                              className="w-full bg-white/5 rounded-xl p-4 text-sm text-white/60 outline-none focus:bg-white/10 transition-all resize-none h-20" 
                              value={p.desc}
                              onChange={(e) => {
                                const newProjects = [...projects];
                                newProjects[idx].desc = e.target.value;
                                saveProjects(newProjects);
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Problème</label>
                              <textarea 
                                className="w-full bg-white/5 rounded-xl p-4 text-xs text-white/60 outline-none focus:bg-white/10 transition-all resize-none h-20" 
                                value={p.problem}
                                onChange={(e) => {
                                  const newProjects = [...projects];
                                  newProjects[idx].problem = e.target.value;
                                  saveProjects(newProjects);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Solution</label>
                              <textarea 
                                className="w-full bg-white/5 rounded-xl p-4 text-xs text-white/60 outline-none focus:bg-white/10 transition-all resize-none h-20" 
                                value={p.solution}
                                onChange={(e) => {
                                  const newProjects = [...projects];
                                  newProjects[idx].solution = e.target.value;
                                  saveProjects(newProjects);
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Fonctionnalités (séparées par des virgules)</label>
                            <input 
                              className="w-full bg-transparent border-b border-white/10 focus:border-accent py-2 text-xs outline-none transition-colors" 
                              value={p.features.join(', ')} 
                              onChange={(e) => {
                                const newProjects = [...projects];
                                newProjects[idx].features = e.target.value.split(',').map(f => f.trim()).filter(f => f !== '');
                                saveProjects(newProjects);
                              }}
                              placeholder="Feature 1, Feature 2..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {devSubTab === 'contacts' && (
              <>
                <div className="flex justify-between items-center mb-12">
                  {renderHeader("Canaux de contact", "WhatsApp, Email, ComeUp...")}
                  <button 
                    onClick={() => saveContacts([...contacts, { id: Date.now().toString(), type: 'other', label: 'NOUVEAU', value: '#', color: '#818cf8' }])}
                    className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-black transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {contacts.map((c, idx) => (
                    <div key={c.id} className="py-6 border-b border-white/5 flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                        <div>
                          <input 
                            className="bg-transparent text-sm font-bold outline-none focus:text-accent transition-colors block" 
                            value={c.label} 
                            onChange={(e) => {
                              const newContacts = [...contacts];
                              newContacts[idx].label = e.target.value;
                              saveContacts(newContacts);
                            }}
                          />
                          <input 
                            className="bg-transparent text-[10px] text-white/20 font-mono outline-none w-64" 
                            value={c.value} 
                            onChange={(e) => {
                              const newContacts = [...contacts];
                              newContacts[idx].value = e.target.value;
                              saveContacts(newContacts);
                            }}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => saveContacts(contacts.filter(item => item.id !== c.id))}
                        className="text-white/5 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {isSaving && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-accent text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl shadow-accent/20 animate-bounce">
          Synchronisation...
        </div>
      )}
    </div>
  );
};
