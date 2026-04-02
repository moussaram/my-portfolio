import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Trash2, 
  MoreVertical, 
  Filter,
  Eye,
  EyeOff,
  Zap,
  Clock,
  Calendar as CalendarIcon,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SiteNotification {
  enabled: boolean;
  message: string;
  type: 'info' | 'warning' | 'success';
}

interface Booking {
  id: string;
  name: string;
  contact: string;
  notes: string;
  guests: string[];
  date: string;
  time: string;
  endTime: string;
  timestamp: string;
  unread: boolean;
}

interface NotificationDashboardProps {
  siteNotification: SiteNotification;
  saveNotification: (n: SiteNotification) => void;
  isSaving: boolean;
  bookings: Booking[];
  saveBookings: (b: Booking[]) => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'info' | 'warning' | 'success';
  unread: boolean;
  important: boolean;
}

export const NotificationDashboard: React.FC<NotificationDashboardProps> = ({
  siteNotification,
  saveNotification,
  isSaving,
  bookings,
  saveBookings
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'important' | 'bookings'>('all');
  
  // Mock notifications for the UI demonstration
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { 
      id: '1', 
      title: "Nouveau message reçu", 
      desc: "Un client potentiel vous a contacté via le formulaire.", 
      time: "Il y a 2 min", 
      type: 'info', 
      unread: true, 
      important: true 
    },
    { 
      id: '2', 
      title: "Projet mis à jour", 
      desc: "Le projet 'Trading IA' a été synchronisé avec succès.", 
      time: "Il y a 15 min", 
      type: 'success', 
      unread: false, 
      important: false 
    }
  ]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    if (filter === 'important') return n.important;
    if (filter === 'bookings') return false;
    return true;
  });

  const filteredBookings = bookings.filter(b => {
    if (filter === 'unread') return b.unread;
    if (filter === 'bookings' || filter === 'all') return true;
    return false;
  });

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const deleteBooking = (id: string) => {
    saveBookings(bookings.filter(b => b.id !== id));
  };

  const markBookingAsRead = (id: string) => {
    saveBookings(bookings.map(b => b.id === id ? { ...b, unread: false } : b));
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 sm:px-0 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-display font-bold tracking-tight text-white">Notifications</h2>
            {isSaving && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Synchronisation...</span>
              </motion.div>
            )}
          </div>
          <p className="text-white/40 text-sm font-medium tracking-wide">Gérez vos alertes et vos rendez-vous.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Tout' },
            { id: 'unread', label: 'Non lues' },
            { id: 'bookings', label: 'Rendez-vous' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f.id ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-white/40 hover:text-white'}`}
            >
              {f.label}
              {f.id === 'bookings' && bookings.filter(b => b.unread).length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-md bg-black/20 text-[8px]">{bookings.filter(b => b.unread).length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Site Banner Configuration (Special Section) */}
      <div className="space-y-6">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-accent/60 ml-1">Bannière du site</h3>
        <div className="border-t border-white/5">
          <div className="py-8 flex items-start justify-between group">
            <div className="flex items-start gap-6 flex-1">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${siteNotification.enabled ? 'bg-accent/10 text-accent' : 'bg-white/5 text-white/20'}`}>
                {siteNotification.enabled ? <Eye size={24} /> : <EyeOff size={24} />}
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-bold tracking-tight text-white/80">Statut de la bannière</div>
                  <button 
                    onClick={() => saveNotification({ ...siteNotification, enabled: !siteNotification.enabled })}
                    className={`w-12 h-6 rounded-full transition-all relative p-1 ${siteNotification.enabled ? 'bg-accent' : 'bg-white/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-black transition-all ${siteNotification.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
                <textarea 
                  className="w-full bg-transparent border-b border-white/10 focus:border-accent py-2 text-sm outline-none transition-colors resize-none h-20 leading-relaxed placeholder:text-white/5" 
                  placeholder="Message de la bannière..."
                  value={siteNotification.message}
                  onChange={(e) => saveNotification({ ...siteNotification, message: e.target.value })}
                />
                <div className="flex gap-4">
                  {['info', 'warning', 'success'].map((type) => (
                    <button
                      key={type}
                      onClick={() => saveNotification({ ...siteNotification, type: type as any })}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${siteNotification.type === type ? 'bg-white/10 border-accent text-accent' : 'bg-white/5 border-transparent text-white/30 hover:bg-white/10'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity List & Bookings */}
      <div className="space-y-6">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-accent/60 ml-1">
          {filter === 'bookings' ? 'Rendez-vous' : 'Flux d\'activité'}
        </h3>
        <div className="border-t border-white/5">
          <AnimatePresence mode="popLayout">
            {/* Notifications */}
            {filteredNotifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => markAsRead(n.id)}
                className="w-full flex items-center justify-between py-6 border-b border-white/5 group hover:px-2 transition-all cursor-pointer relative"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative ${
                    n.type === 'success' ? 'bg-green-500/10 text-green-400' :
                    n.type === 'warning' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-accent/10 text-accent'
                  }`}>
                    {n.type === 'success' && <CheckCircle2 size={18} />}
                    {n.type === 'warning' && <AlertTriangle size={18} />}
                    {n.type === 'info' && <Info size={18} />}
                    {n.unread && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-[#050505] shadow-[0_0_10px_rgba(242,125,38,0.5)]" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3">
                      <div className={`text-sm font-bold tracking-tight transition-colors ${n.unread ? 'text-white' : 'text-white/60'}`}>{n.title}</div>
                      {n.important && (
                        <div className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[8px] font-black uppercase tracking-widest">Urgent</div>
                      )}
                    </div>
                    <div className="text-[11px] text-white/30 font-medium mt-0.5 line-clamp-1">{n.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-[10px] text-white/10 font-bold uppercase tracking-widest whitespace-nowrap">{n.time}</div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white/5 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Bookings */}
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => markBookingAsRead(booking.id)}
                className="w-full py-6 border-b border-white/5 group hover:px-2 transition-all cursor-pointer relative"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative ${
                        booking.unread ? 'bg-accent/10 text-accent' : 'bg-white/5 text-white/20'
                      }`}>
                        <CalendarIcon size={18} />
                        {booking.unread && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-[#050505] shadow-[0_0_10px_rgba(242,125,38,0.5)]" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-3">
                          <div className={`text-sm font-bold tracking-tight transition-colors ${booking.unread ? 'text-white' : 'text-white/60'}`}>
                            Rendez-vous : {booking.name}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/30 font-medium mt-1">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon size={12} className="text-accent/60" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-accent/60" />
                            <span>{booking.time} - {booking.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail size={12} className="text-accent/60" />
                            <span>{booking.contact}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-[10px] text-white/10 font-bold uppercase tracking-widest whitespace-nowrap">
                        {new Date(booking.timestamp).toLocaleDateString('fr-FR')}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteBooking(booking.id); }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white/5 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="ml-16 p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[11px] text-white/40 italic leading-relaxed">"{booking.notes}"</p>
                    </div>
                  )}

                  {booking.guests.length > 0 && (
                    <div className="ml-16 flex flex-wrap gap-2">
                      {booking.guests.map((guest, i) => (
                        <span key={i} className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] text-white/30">
                          {guest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {filteredNotifications.length === 0 && filteredBookings.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/10">
                  <Bell size={32} />
                </div>
                <p className="text-sm font-bold text-white/20 uppercase tracking-widest">Aucun résultat</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tip Card */}
      <div className="p-10 bg-gradient-to-r from-accent/10 to-transparent border border-accent/10 rounded-[2.5rem] flex gap-8 items-start shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0 shadow-lg relative z-10">
          <Zap size={24} className="text-accent animate-pulse" />
        </div>
        <div className="relative z-10">
          <h4 className="text-sm font-bold uppercase tracking-widest text-accent mb-2">Conseil d'expert</h4>
          <p className="text-[12px] text-white/50 leading-relaxed font-medium">
            Répondez rapidement aux notifications de contact pour maximiser vos chances de conversion. 
            Un délai de réponse inférieur à <span className="text-white/80 font-bold">1 heure</span> multiplie par 7 vos chances de conclure un contrat.
          </p>
        </div>
      </div>
      
      <div className="h-20" />
    </div>
  );
};
