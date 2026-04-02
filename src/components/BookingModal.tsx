import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon,
  Video,
  Globe,
  User,
  Mail,
  MessageSquare,
  Plus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingSubmit: (booking: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onBookingSubmit }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [is24h, setIs24h] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    notes: '',
    guests: [] as string[]
  });
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Calendar Helpers
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysCount = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    
    const days = [];
    // Fill empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Fill days of current month
    for (let i = 1; i <= daysCount; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [currentMonth]);

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const dayNames = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelectedDate = (date: Date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  // Time Slots
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const h = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        slots.push(`${h}:${m}`);
      }
    }
    slots.push("18:00");
    return slots;
  }, []);

  const formatTime = (time: string) => {
    if (is24h) return time;
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const getEndTime = (time: string) => {
    const [h, m] = time.split(':');
    let hour = parseInt(h);
    let min = parseInt(m) + 15;
    if (min >= 60) {
      min = 0;
      hour += 1;
    }
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  };

  const formatDateLong = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const booking = {
      id: Date.now().toString(),
      ...formData,
      date: selectedDate?.toISOString(),
      time: selectedTime,
      endTime: selectedTime ? getEndTime(selectedTime) : null,
      timestamp: new Date().toISOString(),
      unread: true
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onBookingSubmit(booking);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const addGuest = () => {
    if (guestEmail && guestEmail.includes('@')) {
      setFormData({ ...formData, guests: [...formData.guests, guestEmail] });
      setGuestEmail('');
    }
  };

  const removeGuest = (email: string) => {
    setFormData({ ...formData, guests: formData.guests.filter(g => g !== email) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/90 backdrop-blur-md p-0 md:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full h-full md:h-auto md:max-w-4xl bg-[#0a0a0a] border border-white/10 md:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
        >
          <X size={24} />
        </button>

        {isSuccess ? (
          <div className="flex-1 flex items-center justify-center p-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                <CheckCircle2 className="text-green-500" size={40} />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">Votre rendez-vous est confirmé !</h2>
              <p className="text-white/60 mb-8">
                Vous recevrez une confirmation par email sous peu. Nous avons hâte de discuter avec vous !
              </p>
              <div className="glass-card p-6 text-left space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <CalendarIcon size={18} className="text-accent" />
                  <div className="text-sm font-medium">{selectedDate && formatDateLong(selectedDate)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <Clock size={18} className="text-accent" />
                  <div className="text-sm font-medium">{selectedTime} - {selectedTime && getEndTime(selectedTime)}</div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="btn-primary w-full py-4"
              >
                FERMER
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Info (Desktop Only) */}
            <div className="hidden md:flex w-80 bg-white/5 border-r border-white/5 p-10 flex-col">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 border border-accent/20">
                <Video className="text-accent" size={24} />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Événement</h3>
                  <p className="text-xl font-display font-bold">Rendez-vous de 15 min</p>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Clock size={16} />
                  <span className="text-sm font-medium">15 min</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Video size={16} />
                  <span className="text-sm font-medium">Cal Video / Video Call</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Globe size={16} />
                  <span className="text-sm font-medium">Africa/Porto-Novo</span>
                </div>
              </div>
              
              {step === 2 && selectedDate && selectedTime && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-12 pt-12 border-t border-white/5 space-y-4"
                >
                  <div className="flex items-center gap-3 text-accent">
                    <CalendarIcon size={16} />
                    <span className="text-sm font-bold">{formatDateLong(selectedDate)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-accent">
                    <Clock size={16} />
                    <span className="text-sm font-bold">{selectedTime} - {getEndTime(selectedTime)}</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Mobile Header Info */}
              <div className="md:hidden p-6 border-b border-white/5 bg-white/5">
                <h3 className="text-lg font-display font-bold">Rendez-vous de 15 min</h3>
                <div className="flex items-center gap-4 mt-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Clock size={12} /> 15 min</span>
                  <span className="flex items-center gap-1"><Video size={12} /> Video</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-12">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-display font-bold">Sélectionnez une date</h2>
                        <button 
                          onClick={() => setIs24h(!is24h)}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                          Format: {is24h ? '24h' : '12h'}
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-12">
                        {/* Calendar */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between px-2">
                            <span className="font-bold text-lg">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"
                              >
                                <ChevronLeft size={20} />
                              </button>
                              <button 
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"
                              >
                                <ChevronRight size={20} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-7 gap-1">
                            {dayNames.map(day => (
                              <div key={day} className="text-center text-[10px] font-black text-white/20 py-2">{day}</div>
                            ))}
                            {calendarDays.map((date, i) => {
                              if (!date) return <div key={`empty-${i}`} />;
                              const past = isPastDate(date);
                              const selected = isSelectedDate(date);
                              return (
                                <button
                                  key={i}
                                  disabled={past}
                                  onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                                  className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all relative ${
                                    past ? 'text-white/5 cursor-not-allowed' : 
                                    selected ? 'bg-accent text-black shadow-lg shadow-accent/20' : 
                                    'hover:bg-accent/10 hover:text-accent text-white/60'
                                  }`}
                                >
                                  {date.getDate()}
                                  {!past && !selected && (
                                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent/40" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          
                          {selectedDate && (
                            <div className="text-center text-sm font-bold text-accent uppercase tracking-widest pt-4">
                              {selectedDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                            </div>
                          )}
                        </div>

                        {/* Time Picker */}
                        <div className="space-y-6">
                          <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Créneaux disponibles</h3>
                          <div className="grid grid-cols-2 gap-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedDate ? timeSlots.map(time => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                                  selectedTime === time 
                                    ? 'bg-accent border-accent text-black shadow-lg shadow-accent/20' 
                                    : 'bg-white/5 border-white/5 text-white/60 hover:border-accent/40 hover:text-accent'
                                }`}
                              >
                                {formatTime(time)}
                              </button>
                            )) : (
                              <div className="col-span-2 flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed border-white/5 rounded-3xl">
                                <CalendarIcon size={32} className="text-white/5 mb-4" />
                                <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Sélectionnez une date pour voir les créneaux</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      <h2 className="text-2xl font-display font-bold">Confirmez vos informations</h2>
                      
                      <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Votre nom</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                              <input 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-accent transition-all" 
                                placeholder="Ex: Jean Dupont"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">E-mail ou Téléphone</label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                              <input 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-accent transition-all" 
                                placeholder="Ex: jean@email.com"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Notes supplémentaires</label>
                          <div className="relative">
                            <MessageSquare className="absolute left-4 top-4 text-white/20" size={18} />
                            <textarea 
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-accent transition-all h-32 resize-none" 
                              placeholder="Merci de renseigner tout ce qui aidera à préparer notre rendez-vous."
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Invités</label>
                            <button 
                              onClick={() => setGuestEmail(' ')}
                              className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
                            >
                              Ajouter des invités
                            </button>
                          </div>
                          
                          {guestEmail !== '' && (
                            <div className="flex gap-2">
                              <input 
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs outline-none focus:border-accent transition-all" 
                                placeholder="Email de l'invité"
                                value={guestEmail.trim()}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addGuest()}
                              />
                              <button 
                                onClick={addGuest}
                                className="px-4 rounded-xl bg-accent text-black font-bold text-xs"
                              >
                                AJOUTER
                              </button>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {formData.guests.map(email => (
                              <div key={email} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold">
                                {email}
                                <button onClick={() => removeGuest(email)} className="text-white/20 hover:text-red-400">
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="p-6 md:p-12 border-t border-white/5 bg-white/5 flex justify-between items-center">
                {step === 1 ? (
                  <>
                    <div className="text-xs font-bold text-white/20 uppercase tracking-widest">Étape 1 sur 2</div>
                    <button 
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setStep(2)}
                      className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${
                        selectedDate && selectedTime 
                          ? 'bg-accent text-black shadow-lg shadow-accent/20 hover:scale-105' 
                          : 'bg-white/5 text-white/10 cursor-not-allowed'
                      }`}
                    >
                      SUIVANT
                      <ArrowRight size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setStep(1)}
                      className="flex items-center gap-3 text-sm font-bold text-white/40 hover:text-white transition-colors"
                    >
                      <ArrowLeft size={18} />
                      RETOUR
                    </button>
                    <button 
                      disabled={!formData.name || !formData.contact || isSubmitting}
                      onClick={handleConfirm}
                      className={`px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${
                        formData.name && formData.contact && !isSubmitting
                          ? 'bg-accent text-black shadow-lg shadow-accent/20 hover:scale-105' 
                          : 'bg-white/5 text-white/10 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          CONFIRMER
                          <CheckCircle2 size={18} />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
