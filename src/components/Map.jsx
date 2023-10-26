import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';

import { useCities } from '../contexts/CitiesContext';

import styles from './Map.module.css';
import { useUrlPosition } from '../hooks/useUrlPosition';

export const Map = () => {
  const [defaultPos, setDefaultPos] = useState([40, 0])
  
  const { cities } = useCities();
  const [lat, lng] = useUrlPosition();

  useEffect(() => {
    if(lat && lng) setDefaultPos([lat, lng]);
  }, [lat, lng])

  return (
    <div className={styles.mapContainer}>
      <MapContainer className={styles.map} center={defaultPos} zoom={6} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map(city => (
          <Marker key={city.id} position={[city.position.lat, city.position.lng]}>
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={defaultPos}/>
        <DetectClick />
      </MapContainer>
    </div>
  )
}

const DetectClick = () => {
  const navigate = useNavigate();
  
  useMapEvents({
    click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  })

  return null;
}

const ChangeCenter = ({ position }) => {
  const map = useMap();
  map.setView(position, 8);

  return null; 
}
