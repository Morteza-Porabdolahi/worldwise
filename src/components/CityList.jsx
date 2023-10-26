import { CityItem } from './CityItem';
import { Spinner } from './Spinner';
import { Message } from './Message';

import styles from './CityList.module.css';
import { useCities } from '../contexts/CitiesContext';

export const CityList = () => {
  const { isLoading, cities, currentCity } = useCities();
  
  if(isLoading) return <Spinner />
  if(cities.length <= 0) return <Message message="Add your first city by clicking on a city on the map"/>
  
  return (
    <ul className={styles.cityList}>
      {cities.map(city => (
        <CityItem key={city.id} city={city} isCurrentCity={city.id === currentCity.id} />
      ))}
    </ul>
  )
}
