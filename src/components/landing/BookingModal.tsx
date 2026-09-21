import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  CaretRight, 
  CaretLeft 
} from '@phosphor-icons/react';
import { StorageService } from '../../data/seedData';
import type { PetSpecies, Appointment } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  onAppointmentCreated?: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService = '',
  onAppointmentCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Form State
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('Canino');
  const [breed, setBreed] = useState('');
  const [reason, setReason] = useState(preselectedService || 'Consulta Clínica General');
  const [selectedDate, setSelectedDate] = useState('2026-09-22');
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [urgencyLevel, setUrgencyLevel] = useState<'Normal' | 'Prioritario' | 'Urgencia'>('Normal');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const timeSlots = [
    '09:00', '09:45', '10:30', '11:15', '12:00',
    '15:00', '15:45', '16:30', '17:15', '18:00'
  ];

  const specialtyOptions = [
    'Consulta Clínica General',
    'Medicina y Comportamiento Felino',
    'Vacunación y Cartilla Digital',
    'Cardiología y Doppler Color',
    'Cirugía y Traumatología',
    'Odontología y Profilaxis Ultrasónica',
    'Urgencia / Signos de Alerta'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAppointment: Appointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      petId: `pet-guest-${Date.now().toString().slice(-4)}`,
      petName: petName || 'Mascota',
      species,
      ownerId: `owner-guest-${Date.now().toString().slice(-4)}`,
      ownerName: ownerName || 'Tutor Particular',
      ownerPhone: ownerPhone || '+54 11 5555-0000',
      date: selectedDate,
      time: selectedTime,
      reason,
      veterinarianName: species === 'Felino' ? 'Dra. Valentina Rossi' : 'Dr. Tomás Morales',
      status: 'Confirmado',
      notes: notes || undefined,
      urgencyLevel,
    };

    StorageService.addAppointment(newAppointment);
    setCreatedAppointment(newAppointment);
    setIsSuccess(true);

    if (onAppointmentCreated) {
      onAppointmentCreated(newAppointment);
    }
  };

  const handleReset = () => {
    setStep(1);
    setIsSuccess(false);
    setCreatedAppointment(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-forest/10 text-forest">
                Vetify Booking
              </span>
              {!isSuccess && (
                <span className="text-xs text-slate-400 font-medium">Paso {step} de 3</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isSuccess ? 'Turno Confirmado con Éxito' : 'Reserva de Turno Clínico'}
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSuccess && createdAppointment ? (
            <div className="text-center py-4 space-y-5 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle size={32} weight="fill" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Turno Registrado en Vetify OS
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Hemos confirmado la cita médica para <strong>{createdAppointment.petName}</strong>.
                </p>
              </div>

              {/* Receipt */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Identificador:</span>
                  <span className="font-mono font-bold text-slate-900">{createdAppointment.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Paciente:</span>
                  <span className="font-semibold text-slate-900">{createdAppointment.petName} ({createdAppointment.species})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Fecha y Hora:</span>
                  <span className="font-semibold text-forest">{createdAppointment.date} a las {createdAppointment.time} hs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Especialidad:</span>
                  <span className="font-medium text-slate-900">{createdAppointment.reason}</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Cerrar y Volver
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nombre del Tutor *
                      </label>
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Ej. Camila Benítez"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-forest outline-none text-xs text-slate-900 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Teléfono Móvil *
                      </label>
                      <input
                        type="tel"
                        required
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder="+54 11 5555-1234"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-forest outline-none text-xs text-slate-900 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="tutor@correo.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-forest outline-none text-xs text-slate-900 bg-slate-50/50"
                      />
                    </div>
                  </div>


                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nombre Mascota *
                      </label>
                      <input
                        type="text"
                        required
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        placeholder="Ej. Milo"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-forest outline-none text-xs text-slate-900 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Especie *
                      </label>
                      <select
                        value={species}
                        onChange={(e) => setSpecies(e.target.value as PetSpecies)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-forest outline-none text-xs text-slate-900 bg-slate-50/50"
                      >
                        <option value="Canino">Canino (Perro)</option>
                        <option value="Felino">Felino (Gato)</option>
                        <option value="Exótico">Exótico</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Raza
                      </label>
                      <input
                        type="text"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        placeholder="Ej. Mestizo"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-forest outline-none text-xs text-slate-900 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!ownerName || !ownerPhone || !petName}
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                    >
                      <span>Siguiente: Especialidad</span>
                      <CaretRight size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Selecciona la Especialidad Médica *
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-forest outline-none text-xs text-slate-900 bg-slate-50/50"
                    >
                      {specialtyOptions.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nivel de Prioridad
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Normal', 'Prioritario', 'Urgencia'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setUrgencyLevel(lvl)}
                          className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                            urgencyLevel === lvl
                              ? lvl === 'Urgencia'
                                ? 'bg-rose-50 border-rose-400 text-rose-800'
                                : 'bg-forest/10 border-forest text-forest font-semibold'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Notas o síntomas para el equipo médico
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Indica si presenta decaimiento, tos, cambios de apetito..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-forest outline-none text-xs text-slate-900 bg-slate-50/50"
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <CaretLeft size={14} weight="bold" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover transition-all active:scale-[0.98]"
                    >
                      <span>Siguiente: Horario</span>
                      <CaretRight size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fecha deseada *
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-forest outline-none text-xs text-slate-900 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Horarios Disponibles
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                            selectedTime === slot
                              ? 'bg-forest text-white border-forest shadow-xs font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <CaretLeft size={14} weight="bold" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover transition-all active:scale-[0.98] shadow-sm"
                    >
                      <CheckCircle size={15} weight="bold" />
                      <span>Confirmar Turno</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
