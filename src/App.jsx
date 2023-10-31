import { Suspense } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazily } from 'react-lazily';

import { CityList } from './components/CityList';
import { CountryList } from './components/CountryList';
import { City } from './components/City';
import { Form } from './components/Form';

import { CitiesProvider } from './contexts/CitiesContext';
import { UserProvider } from './contexts/UserContext';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { SpinnerFullPage } from './components/SpinnerFullPage';

const { Pricing } = lazily(() => import('./pages/Pricing')),
  { Login } = lazily(() => import('./pages/Login')),
  { Product } = lazily(() => import('./pages/Product')),
  { AppLayout } = lazily(() => import('./pages/AppLayout')),
  { PageNotFound } = lazily(() => import('./pages/PageNotFound')),
  { Homepage } = lazily(() => import('./pages/Homepage'));

export const App = () => {
  return (
    <UserProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/product" element={<Product />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                <Route index element={<Navigate replace to="cities" />} />
                <Route path='cities' element={<CityList />} />
                <Route path='countries' element={<CountryList />} />
                <Route path='cities/:id' element={<City />} />
                <Route path='form' element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </UserProvider>
  )
}
