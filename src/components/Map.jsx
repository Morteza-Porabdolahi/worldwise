import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';

export const Map = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate();

  const lat = searchParams.get('lat'),
  lng = searchParams.get('lng');

  return (
    <div className={styles.mapContainer} onClick={() => navigate('/app/form')}>
      <h2>{lat},{lng}</h2>
    </div>
  )
}
