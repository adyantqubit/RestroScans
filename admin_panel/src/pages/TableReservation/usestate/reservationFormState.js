import { useState } from 'react';

function todayStamp() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useReservationFormState() {
  const formattedDate1 = todayStamp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [numberOfPerson, setNumberOfPerson] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [date, setDate] = useState(formattedDate1);
  const [dateValidation, setDateValidation] = useState(false);
  const [time, setTime] = useState('12:00');
  const [tableNumber, setTableNumber] = useState("");
  const [reservationStatusSelected, setReservationStatusSelected] = useState('Pending');
  const [reservationDetails, setReservationDetails] = useState({});
  const [id, setId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    contact_number: '',
    numberOfPerson: '',
    date: '',
    time: '',
    table_number: '',
    reservation_status: '',
  });
  const [isLoader, setIsLoader] = useState(false);

  return {
    formattedDate1,
    name,
    setName,
    email,
    setEmail,
    contactNumber,
    setContactNumber,
    numberOfPerson,
    setNumberOfPerson,
    specialInstructions,
    setSpecialInstructions,
    date,
    setDate,
    dateValidation,
    setDateValidation,
    time,
    setTime,
    tableNumber,
    setTableNumber,
    reservationStatusSelected,
    setReservationStatusSelected,
    reservationDetails,
    setReservationDetails,
    id,
    setId,
    validationErrors,
    setValidationErrors,
    isLoader,
    setIsLoader,
  };
}
