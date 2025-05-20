import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomDatePicker.module.css';
import { format, isAfter, startOfDay, parseISO } from 'date-fns';

const CustomDatePicker = ({ value, onChange, minDate, placeholder, isPastDatePicker = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? parseISO(value) : null);
  const [currentMonth, setCurrentMonth] = useState(value ? parseISO(value) : new Date());
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(parseISO(value));
      setCurrentMonth(parseISO(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const handlePrevMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const isDateDisabled = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isPastDatePicker) {
      return isAfter(startOfDay(date), startOfDay(new Date()));
    }
    return minDate && date < new Date(minDate);
  };

  const isFutureDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isPastDatePicker) {
      return false;
    }
    return isAfter(startOfDay(date), startOfDay(new Date()));
  };

  const isPastDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return !isAfter(startOfDay(date), startOfDay(new Date()));
  };

  const handleCalendarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return format(date, 'dd MMM yyyy');
  };

  return (
    <div className={styles.datePickerContainer} ref={datePickerRef}>
      <div 
        className={styles.dateInput}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedDate ? (
          <span className={styles.selectedDate}>{formatDisplayDate(selectedDate)}</span>
        ) : (
          <span className={styles.placeholder}>{placeholder || 'Select date'}</span>
        )}
        <span className={`${styles.calendarIcon} ${isOpen ? styles.active : ''}`}>
          📅
        </span>
      </div>

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          <div className={styles.calendar} onClick={handleCalendarClick}>
            <div className={styles.calendarHeader}>
              <button type="button" onClick={handlePrevMonth}>&lt;</button>
              <span>{format(currentMonth, 'MMMM yyyy')}</span>
              <button type="button" onClick={handleNextMonth}>&gt;</button>
            </div>

            <div className={styles.weekDays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={styles.weekDay}>{day}</div>
              ))}
            </div>

            <div className={styles.days}>
              {emptySlots.map((_, index) => (
                <div key={`empty-${index}`} className={styles.emptySlot} />
              ))}
              {days.map(day => {
                const isSelected = selectedDate && 
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentMonth.getMonth() &&
                  selectedDate.getFullYear() === currentMonth.getFullYear();
                
                const isDisabled = isDateDisabled(day);
                const isFuture = isFutureDate(day);

                return (
                  <div
                    key={day}
                    className={`${styles.day} 
                      ${isSelected ? styles.selected : ''} 
                      ${isDisabled ? styles.disabled : ''} 
                      ${isFuture ? styles.future : ''}
                      ${isPastDatePicker && isPastDate(day) ? styles.past : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isDisabled) {
                        handleDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
                      }
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomDatePicker; 