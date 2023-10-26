import { createContext, useContext, useEffect, useState } from "react"

const CitiesContext = createContext();

const API_URL = 'http://localhost:8000';

export const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/cities`);
        const data = await res.json();

        setCities(data);
      } catch (e) {
        alert('There was an error !');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/cities/${id}`);
      const data = await res.json();

      setCurrentCity(data);
    } catch (e) {
      alert('There was an error !');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider value={{
      cities,
      isLoading,
      currentCity,
      getCity,
    }}>
      {children}
    </CitiesContext.Provider>
  )
}

export const useCities = () => {
  const citiesValue = useContext(CitiesContext);

  if(!citiesValue) throw new Error('CitiesContext was used outside the CitiesProvider !');

  return citiesValue;
}
