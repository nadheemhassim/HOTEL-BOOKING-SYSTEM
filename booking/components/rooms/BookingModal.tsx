'use client';

import { useState, useEffect } from 'react';
import { DateRange, Range } from 'react-date-range';
import { RangeKeyDict } from 'react-date-range';
import { addDays, format } from 'date-fns';
import { X, Users, Loader2, Check, Clock } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useRouter } from 'next/navigation';
import { socket } from '@/utils/socket';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    _id: string;
    name: string;
    price: number;
    capacity: number;
  };
  bookedDates: Array<{ checkIn: string; checkOut: string }>;
}

const customDatePickerStyles = {
  '.rdrCalendarWrapper': {
    width: '100%',
    background: 'white',
    borderRadius: '0.75rem'
  },
  '.rdrDateDisplayWrapper': {
    background: 'transparent'
  },
  '.rdrMonthAndYearWrapper': {
    paddingTop: '0.5rem'
  },
  '.rdrMonth': {
    width: '100%'
  },
  '.rdrStartEdge, .rdrEndEdge, .rdrInRange': {
    background: '#1B4D3E'
  },
  '.rdrDayHovered': {
    backgroundColor: '#1B4D3E20 !important'
  },
  '.rdrDayToday .rdrDayNumber span:after': {
    background: '#1B4D3E'
  }
};

const StepIndicator = ({ step, currentStep, label }: { 
  step: number; 
  currentStep: number;
  label: string;
}) => {
  const isCompleted = step < currentStep;
  const isActive = step === currentStep;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
            ${isCompleted 
              ? 'border-green-500 bg-green-500 text-white' 
              : isActive
              ? 'border-[#1B4D3E] bg-[#1B4D3E] text-white'
              : 'border-gray-300 bg-white text-gray-400'
            }`}
        >
          {isCompleted ? (
            <Check className="h-5 w-5" />
          ) : (
            <span className="text-sm font-medium">{step}</span>
          )}
        </div>
        
        {step < 3 && (
          <div className="absolute top-1/2 left-full w-full h-[2px] -translate-y-1/2">
            <div className={`h-full transition-all duration-300 ${
              step < currentStep ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          </div>
        )}
      </div>
      <span className={`mt-2 text-sm font-medium transition-colors duration-300 ${
        isActive ? 'text-[#1B4D3E]' : isCompleted ? 'text-green-500' : 'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  );
};

export default function BookingModal({ isOpen, onClose, room, bookedDates: initialBookedDates }: BookingModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: 'selection'
  });
  const [guests, setGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState(initialBookedDates);

  useEffect(() => {

    setBookedDates(initialBookedDates);
  }, [initialBookedDates]);

  useEffect(() => {
    if (!isOpen) return;

    socket.connect();

    socket.on('bookingUpdated', (updatedBooking) => {
      if (updatedBooking.room._id === room._id && 
          updatedBooking.status === 'confirmed') {
        setBookedDates(prev => [...prev, {
          checkIn: updatedBooking.checkIn,
          checkOut: updatedBooking.checkOut
        }]);
      }
    });

    socket.on('bookingCreated', (newBooking) => {
      if (newBooking.room._id === room._id && 
          newBooking.status === 'confirmed') {
        setBookedDates(prev => [...prev, {
          checkIn: newBooking.checkIn,
          checkOut: newBooking.checkOut
        }]);
      }
    });

    return () => {
      socket.off('bookingUpdated');
      socket.off('bookingCreated');
      socket.disconnect();
    };
  }, [isOpen, room._id]);

  const handleDateSelect = (ranges: RangeKeyDict) => {
    if ('selection' in ranges) {
      setDateRange(ranges.selection);
    }
  };

  const checkAvailability = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/check-availability`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: room._id,
          checkIn: dateRange.startDate,
          checkOut: dateRange.endDate
        })
      });

      const data = await response.json();
      if (data.available) {
        setCurrentStep(2);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to check availability');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: room._id,
          checkIn: dateRange.startDate?.toISOString(),
          checkOut: dateRange.endDate?.toISOString(),
          guests,
          totalAmount: calculateTotal()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed');
      }

      setCurrentStep(3);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to complete booking');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!dateRange.startDate || !dateRange.endDate) return 0;
    const days = Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days * room.price;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl max-w-4xl mx-auto mt-20"
          >
            {/* Header */}
            <div className="p-6 border-b bg-white sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Book Your Stay</h2>
                  <p className="text-sm text-gray-500 mt-1">{room.name}</p>
                </div>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-gray-500 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="mb-8">
                <div className="grid grid-cols-3 gap-4 relative">
                  <StepIndicator step={1} currentStep={currentStep} label="Select Dates" />
                  <StepIndicator step={2} currentStep={currentStep} label="Guest Details" />
                  <StepIndicator step={3} currentStep={currentStep} label="Confirmation" />
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0">⚠️</span>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock className="h-4 w-4" />
                      <span>Bookings are held for 30 minutes</span>
                    </div>
                    <style jsx global>
                      {`
                        ${Object.entries(customDatePickerStyles)
                          .map(([selector, styles]) => 
                            `${selector} { ${Object.entries(styles)
                              .map(([prop, value]) => `${prop}: ${value};`)
                              .join(' ')} }`
                          )
                          .join('\n')}
                      `}
                    </style>
                    <DateRange
                      ranges={[dateRange]}
                      onChange={handleDateSelect}
                      minDate={new Date()}
                      disabledDates={bookedDates.flatMap(date => 
                        getDatesInRange(new Date(date.checkIn), new Date(date.checkOut))
                      )}
                      months={2}
                      direction="horizontal"
                      showDateDisplay={false}
                      rangeColors={['#1B4D3E']}
                      className="!w-full"
                    />
                  </div>
                  <button
                    onClick={checkAvailability}
                    disabled={isLoading}
                    className="w-full py-3 bg-[#1B4D3E] text-white rounded-xl hover:bg-[#163D37] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Checking Availability...
                      </span>
                    ) : (
                      'Check Availability'
                    )}
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests
                      </label>
                      <div className="relative">
                        <select
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="w-full p-3 pr-10 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-[#1B4D3E]"
                        >
                          {[...Array(room.capacity)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                        <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dates</span>
                        <span className="font-medium">
                          {dateRange.startDate && format(dateRange.startDate, 'MMM dd')} -{' '}
                          {dateRange.endDate && format(dateRange.endDate, 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price per night</span>
                        <span className="font-medium">${room.price}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-3 border-t">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-lg">${calculateTotal()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={isLoading}
                    className="w-full py-3 bg-[#1B4D3E] text-white rounded-xl hover:bg-[#163D37] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Complete Booking'
                    )}
                  </button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center space-y-6 py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="h-10 w-10 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Your booking has been confirmed. Please check your email for the confirmation details.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      router.push('/bookings');
                    }}
                    className="w-full max-w-xs mx-auto py-3 bg-[#1B4D3E] text-white rounded-xl hover:bg-[#163D37] transition-colors font-medium"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getDatesInRange(start: Date, end: Date) {
  const dates = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}