// src/app/components/MapPreview.tsx

'use client'

import React, { useEffect, useMemo } from 'react'
import { useFormFields } from '@payloadcms/ui'
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
// --- NUEVO: Imports de React-Icons y ReactDOMServer ---
import ReactDOMServer from 'react-dom/server'
import {
  FaRoad, // pavimento
  FaLightbulb, // alumbrado
  FaWater, // red-de-agua
  FaShower, // red-de-cloacas (ejemplo)
  FaBuilding, // edificio-publico
  FaTree, // parque-jardin
  FaChessQueen, // plaza (ejemplo)
  FaQuestion, // otro
  FaMapMarkerAlt, // default
} from 'react-icons/fa'

// Componente helper para centrar el mapa dinámicamente
const RecalculateBounds = ({ bounds }: { bounds: L.LatLngBounds | null }) => {
  const map = useMap()
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [bounds, map])
  return null
}

// --- NUEVO: Definimos el tipo para WorkType ---
// Esto solucionará el error de TypeScript
type WorkType =
  | 'pavimento'
  | 'alumbrado'
  | 'red-de-agua'
  | 'red-de-cloacas'
  | 'edificio-publico'
  | 'parque-jardin'
  | 'plaza'
  | 'otro'

const MapPreview: React.FC = () => {
  // --- MODIFICADO: Leemos los mismos campos ---
  const { latField, lngField, segmentsList, titleField, workTypeField } = useFormFields(
    ([fields]) => {
      // ... (Lógica de Puntos y Tramos ... )
      const latField = fields['location.latitude']
      const lngField = fields['location.longitude']
      const titleField = fields.title
      const workTypeField = fields.workType
      const segmentsField = fields.segments
      const calculatedSegmentsList = []
      if (segmentsField && Array.isArray(segmentsField.rows)) {
        for (const segmentRow of segmentsField.rows) {
          const segmentPath = segmentRow.lastRenderedPath
          const pointsField = fields[`${segmentPath}.points`]
          const currentPoints = []
          if (pointsField && Array.isArray(pointsField.rows)) {
            for (const pointRow of pointsField.rows) {
              const pointPath = pointRow.lastRenderedPath
              const lat = fields[`${pointPath}.latitude`]
              const lng = fields[`${pointPath}.longitude`]
              if (lat?.value != null && lng?.value != null) {
                currentPoints.push({
                  latitude: lat.value,
                  longitude: lng.value,
                })
              }
            }
          }
          calculatedSegmentsList.push({ points: currentPoints })
        }
      }
      return { latField, lngField, segmentsList: calculatedSegmentsList, titleField, workTypeField }
    },
  )

  // --- EXTRACCIÓN DE VALORES ---
  const lat = latField?.value as number | null
  const lng = lngField?.value as number | null
  const point = lat != null && lng != null ? { latitude: lat, longitude: lng } : null
  const titleValue = titleField?.value as string | null

  // --- MODIFICADO: Usamos nuestro tipo WorkType ---
  const workTypeValue = workTypeField?.value as WorkType | null

  // --- MODIFICADO: Creamos un mapa de íconos con L.DivIcon y react-icons ---
  const { iconMap, defaultIcon } = useMemo(() => {
    // Función helper para crear íconos de Div
    const createDivIcon = (component: React.ReactElement) => {
      return L.divIcon({
        html: ReactDOMServer.renderToString(component),
        className: 'custom-leaflet-icon', // Clase CSS que definimos en admin.css
        iconSize: [30, 30],
        iconAnchor: [15, 15], // Ancla al centro
        popupAnchor: [0, -15], // Popup arriba
      })
    }

    // Ícono por defecto
    const defaultIcon = createDivIcon(<FaMapMarkerAlt />)

    // Mapa de íconos (tipado con Record<WorkType, L.DivIcon>)
    const iconMap: Record<WorkType, L.DivIcon> = {
      pavimento: createDivIcon(<FaRoad />),
      alumbrado: createDivIcon(<FaLightbulb />),
      'red-de-agua': createDivIcon(<FaWater />),
      'red-de-cloacas': createDivIcon(<FaShower />),
      'edificio-publico': createDivIcon(<FaBuilding />),
      'parque-jardin': createDivIcon(<FaTree />),
      plaza: createDivIcon(<FaChessQueen />),
      otro: createDivIcon(<FaQuestion />),
    }

    return { iconMap, defaultIcon }
  }, [])

  // --- CORREGIDO: Lógica para seleccionar el ícono actual ---
  // Ahora TypeScript sabe que workTypeValue SÓLO puede ser una llave válida
  const currentIcon = (workTypeValue ? iconMap[workTypeValue] : undefined) || defaultIcon

  // Calculamos los límites (bounds) del mapa para centrarlo
  const bounds = useMemo(() => {
    const latLngs: L.LatLng[] = []
    if (point && point.latitude && point.longitude) {
      latLngs.push(L.latLng(point.latitude as number, point.longitude as number))
    }
    if (segmentsList && segmentsList.length > 0) {
      segmentsList.forEach((segment) => {
        if (segment.points && segment.points.length > 0) {
          segment.points.forEach((p) => {
            if (p && p.latitude && p.longitude) {
              latLngs.push(L.latLng(p.latitude as number, p.longitude as number))
            }
          })
        }
      })
    }
    if (latLngs.length === 0) return null
    return L.latLngBounds(latLngs)
  }, [point, segmentsList])

  // Un centro por defecto si no hay datos
  const defaultCenter: [number, number] = [-26.83, -65.2] // (Ej: Tucumán)

  return (
    <div style={{ marginBottom: '20px' }}>
      <label className="field-label">Previsualización en Mapa</label>
      <div
        style={{
          height: '400px',
          width: '100%',
          borderRadius: '10px',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Marker principal (sin cambios, ahora usa currentIcon) */}
          {point && point.latitude && point.longitude && (
            <Marker position={[point.latitude, point.longitude]} icon={currentIcon}>
              <Popup>{titleValue || 'Ubicación de la Obra'}</Popup>
            </Marker>
          )}

          {/* Renderizado de tramos (sin cambios, ahora usa currentIcon) */}
          {Array.isArray(segmentsList) &&
            segmentsList.map((segment, idx) => {
              if (!segment || !Array.isArray(segment.points)) {
                return null
              }
              const polylinePoints = segment.points
                ?.map((p) => (p && p.latitude && p.longitude ? [p.latitude, p.longitude] : null))
                .filter(Boolean) as [number, number][]
              if (polylinePoints.length === 0) {
                return null
              }
              const startPoint = polylinePoints[0]
              const endPoint =
                polylinePoints.length > 1 ? polylinePoints[polylinePoints.length - 1] : null
              return (
                <React.Fragment key={idx}>
                  {polylinePoints.length >= 2 && (
                    <Polyline positions={polylinePoints} color="blue" />
                  )}
                  <Marker position={startPoint} icon={currentIcon}>
                    <Popup>
                      {titleValue || 'Obra'} (Inicio Tramo {idx + 1})
                    </Popup>
                  </Marker>
                  {endPoint && (
                    <Marker position={endPoint} icon={currentIcon}>
                      <Popup>
                        {titleValue || 'Obra'} (Fin Tramo {idx + 1})
                      </Popup>
                    </Marker>
                  )}
                </React.Fragment>
              )
            })}

          {/* 6. Usar el helper para centrar el mapa */}
          <RecalculateBounds bounds={bounds} />
        </MapContainer>
      </div>
    </div>
  )
}

export default MapPreview
