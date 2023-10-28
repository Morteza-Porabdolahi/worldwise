import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";

import { Button } from "./Button";
import { BackButton } from "./BackButton";
import { Message } from "./Message";
import { Spinner } from "./Spinner";

import { useUrlPosition } from "../hooks/useUrlPosition";

import styles from "./Form.module.css";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState('');
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState('');

  const [lat, lng] = useUrlPosition();

  const { createCity, isLoading: contextIsLoading } = useCities();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCityData() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode) throw new Error("That doesn't seem to be a city. Click somewhere else !")

        setCityName(data.city || data.locality || '');
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode))
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (lat && lng) fetchCityData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName && !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng }
    }

    await createCity(newCity);
    navigate('/app/cities')
  }

  if (!lat && !lng) return <Message message="Start by clicking somewhere on the map !" />
  if (isLoading) return <Spinner />;
  if (error) return <Message message={error} />;

  return (
    <form className={`${styles.form} ${contextIsLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={date => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}
