import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Product } from './pages/Product';
import { Pricing } from './pages/Pricing';
import { Homepage } from './pages/Homepage';
import { PageNotFound } from './pages/PageNotFound';
import { AppLayout } from './pages/AppLayout';
import { Login } from './pages/Login';
import { CityList } from './components/CityList';
import { useEffect, useState } from 'react';
import { CountryList } from './components/CountryList';
import { City } from './components/City';
import { Form } from './components/Form';

const API_URL = 'http://localhost:8000';

export const App = () => {
  const [cities, setCities] = useState([]);
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/product" element={<Product />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate replace to="cities"/>} />
          <Route path='cities' element={<CityList isLoading={isLoading} cities={cities}/>} />
          <Route path='cities/:id' element={<City />} />
          <Route path='countries' element={<CountryList cities={cities} isLoading={isLoading} />} />
          <Route path='form' element={<Form />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}