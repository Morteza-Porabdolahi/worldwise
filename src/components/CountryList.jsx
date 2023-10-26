import { Spinner } from './Spinner';
import { Message } from './Message';
import { useCities } from '../contexts/CitiesContext';
import { CountryItem } from './CountryItem';

import styles from './CountryList.module.css';

export const CountryList = () => {
  const { isLoading, cities } = useCities();
  
  if (isLoading) return <Spinner />
  if (cities.length <= 0) return <Message message="Add your first country by clicking on a city on the map" />

  const countries = cities.reduce((arr, city) => arr.find(item => item.country === city.country) ? arr : [...arr, { country: city.country, emoji: city.emoji }], []);

  return (
    <ul className={styles.countryList}>
      {countries.map(country => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  )

}
