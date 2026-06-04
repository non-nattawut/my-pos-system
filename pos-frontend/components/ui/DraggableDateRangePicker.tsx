'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateRangePickerProps {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  onChange: (start: string, end: string) => void;
  className?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className = '',
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Local temporary state
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  // Month navigation state
  const initialDate = startDate ? new Date(startDate) : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear() || new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth() || new Date().getMonth());

  // Hover state preview when selecting range
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state with props
  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  // Close calendar popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    if (tempStart && tempEnd) {
      onChange(tempStart, tempEnd);
      setIsOpen(false);
    }
  };

  const handleQuickSelect = (daysAgo: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - daysAgo);

    const toYmd = (date: Date) => date.toISOString().split('T')[0];
    const newStart = toYmd(start);
    const newEnd = toYmd(end);
    setTempStart(newStart);
    setTempEnd(newEnd);
    onChange(newStart, newEnd);
    setIsOpen(false);
    
    // Sync current viewed month
    setCurrentYear(start.getFullYear());
    setCurrentMonth(start.getMonth());
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    if (isNaN(dateObj.getTime())) return dateStr;
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calendar Helpers
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const startDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const getDayYmd = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  // Selection Logic
  const handleDayClick = (ymd: string) => {
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(ymd);
      setTempEnd('');
    } else {
      if (ymd < tempStart) {
        setTempStart(ymd);
      } else {
        setTempEnd(ymd);
      }
    }
  };

  // Styling helper: check if date is active or inside selected/hover range
  const getDateStatus = (ymd: string) => {
    const isStart = ymd === tempStart;
    const isEnd = ymd === tempEnd;
    
    let inRange = false;
    if (tempStart && tempEnd) {
      inRange = ymd >= tempStart && ymd <= tempEnd;
    } else if (tempStart && !tempEnd && hoverDate && hoverDate >= tempStart) {
      // Hover preview when click selecting second date
      inRange = ymd >= tempStart && ymd <= hoverDate;
    }
    
    return { isStart, isEnd, inRange };
  };

  // Render Calendar Grid
  const totalDays = daysInMonth(currentMonth, currentYear);
  const startDay = startDayOfMonth(currentMonth, currentYear);
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-theme-bg border border-theme-border text-xs text-zinc-300 hover:text-white cursor-pointer hover:border-theme-accent transition-colors"
      >
        <CalendarIcon size={14} className="text-theme-accent" />
        <span>
          {startDate && endDate 
            ? `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}` 
            : 'Select Custom Range 🔍'}
        </span>
      </button>

      {/* Relative Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] mt-2 left-0 lg:right-0 bg-zinc-950/95 border border-theme-border rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col cursor-default select-none w-80 p-4 gap-4"
          >
            <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-2xl p-3">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-theme-accent transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[10px] font-extrabold font-mono text-zinc-300 tracking-wider">
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-theme-accent transition-colors cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 text-[8px] text-zinc-500 font-black uppercase tracking-wider text-center mb-1.5">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="h-7" />;
                  }
                  
                  const ymd = getDayYmd(day);
                  const { isStart, isEnd, inRange } = getDateStatus(ymd);
                  
                  let bgClass = 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200';
                  if (isStart || isEnd) {
                    bgClass = 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold shadow-md scale-105';
                  } else if (inRange) {
                    bgClass = 'bg-theme-accent/25 text-theme-accent font-bold';
                  }

                  return (
                    <button
                      key={`day-${day}`}
                      type="button"
                      onClick={() => handleDayClick(ymd)}
                      onMouseEnter={() => setHoverDate(ymd)}
                      onMouseLeave={() => setHoverDate(null)}
                      className={`h-7 w-full rounded-lg text-[9px] font-mono flex items-center justify-center transition-all cursor-pointer ${bgClass}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selection Summary */}
            <div className="flex justify-between items-center bg-zinc-950/60 border border-zinc-900 px-3 py-2 rounded-2xl text-[9px] font-mono text-zinc-450">
              <div className="flex flex-col gap-0.5">
                <span className="text-[7px] text-zinc-600 font-bold uppercase">Start</span>
                <span>{tempStart ? formatDateDisplay(tempStart) : 'None'}</span>
              </div>
              <div className="h-6 w-[1px] bg-zinc-900" />
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-[7px] text-zinc-600 font-bold uppercase">End</span>
                <span>{tempEnd ? formatDateDisplay(tempEnd) : 'None'}</span>
              </div>
            </div>

            {/* Quick Selectors & Apply Actions */}
            <div className="flex justify-between items-center gap-2 pt-1 border-t border-zinc-900/60">
              <div className="flex gap-1.5">
                {[
                  { label: 'Yest.', days: 1 },
                  { label: '7D', days: 7 },
                  { label: '30D', days: 30 },
                ].map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleQuickSelect(item.days)}
                    className="py-1 px-2 text-[9px] font-extrabold rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800/80 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="py-1 px-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-450 hover:text-zinc-200 text-[9px] font-extrabold uppercase tracking-wide cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={!tempStart || !tempEnd}
                  className="py-1 px-3 rounded-xl bg-theme-btn-pink hover:bg-theme-btn-pink-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-[9px] font-extrabold uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  Apply ✔
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
