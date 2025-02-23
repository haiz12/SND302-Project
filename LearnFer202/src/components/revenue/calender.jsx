import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ onDateSelect }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    onDateSelect(selectedDate); // Send the selected date to the parent component
  };

  return (
    <div>
      <Calendar onChange={handleDateChange} value={date} />
    </div>
  );
};

export default CalendarComponent; // Ensure this matches the component name