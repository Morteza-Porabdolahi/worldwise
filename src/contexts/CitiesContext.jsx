import { createContext, useContext, useEffect, useReducer } from "react"

const CitiesContext = createContext();

const API_URL = 'http://localhost:8000';
const initialState = {
  cities: [],
  currentCity: {},
  isLoading: true,
  error: ""
}

// reducers needs to be pure functions so no data fetching and no another side effects must be done in the reducer
function citiesReducer(state, action) {
  switch (action.type) {
    case 'loading': {
      return {
        ...state,
        isLoading: true,
      }
    }
    case 'cities/loaded': {
      return {
        ...state,
        isLoading: false,
        cities: action.payload
      }
    }
    case 'city/created': {
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload
      }
    }
    case 'city/deleted': {
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(city => city.id !== action.payload)     
      }
    }
    case 'city/loaded': {
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      }
    }
    case 'rejected': {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    }
    default:{
      throw new Error('Unknown action type !');
    }
  }
}

export const CitiesProvider = ({ children }) => {
  const [{ cities, currentCity, isLoading, error }, dispatch]= useReducer(citiesReducer, initialState)

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: 'loading' })
        const res = await fetch(`${API_URL}/cities`);
        const data = await res.json();

        dispatch({ type: 'cities/loaded', payload: data });
      } catch (e) {
        dispatch({ type: 'rejected', payload: 'There was an error fetching city!' });
      } 
    }

    fetchCities();
  }, []);

  async function createCity(city) {
    try {
      dispatch({ type: 'loading' })
      const res = await fetch(`${API_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(city),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();

      dispatch({ type: 'city/created', payload: data })
    } catch (e) {
      dispatch({ type: 'rejected', payload: 'There was an error creating city !' });
    }
  }

  async function removeCity(cityId) {
    try {
      dispatch({ type: 'loading' })
      await fetch(`${API_URL}/cities/${cityId}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payload: cityId })
    } catch (e) {
      dispatch({ type: 'rejected', payload: 'There was an error deleting city !' });
    }
  }

  async function getCity(id) {
    if(+id === currentCity.id) return;
    
    try {
      dispatch({ type: 'loading' })
      const res = await fetch(`${API_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: 'city/loaded', payload: data });
    } catch (e) {
      dispatch({ type: 'rejected', payload: 'There was an error !' });
    }
  }

  return (
    <CitiesContext.Provider value={{
      cities,
      isLoading,
      currentCity,
      getCity,
      createCity,
      removeCity,
      error,
    }}>
      {children}
    </CitiesContext.Provider>
  )
}

export const useCities = () => {
  const citiesValue = useContext(CitiesContext);

  if (!citiesValue) throw new Error('CitiesContext was used outside the CitiesProvider !');

  return citiesValue;
}
