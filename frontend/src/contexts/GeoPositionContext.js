import React, { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "./CurrentUserContext";

export const GeoPositionContext = createContext();
export const SetGeoPositionContext = createContext();

export const useGeoPosition = () => useContext(GeoPositionContext);
export const useSetGeoPosition = () => useContext(SetGeoPositionContext);

export const GeoPositionProvider = ({ children }) => {
  const currentUser = useCurrentUser();
  const [geoPosition, setGeoPosition] = useState({
    home: {
      // Set default home location to current user's registered location
      // else to Royal Greenwich Observatory as a default value
      latitude: currentUser?.latitude || 51.4768547,
      longitude: currentUser?.longitude || -0.0017877,
    },
    current: {
      latitude: 0,
      longitude: 0,
    },
    radius: 30, // Default radius in km
    reach: {
      latNorth: 0,
      latSouth: 0,
      lonEast: 0,
      lonWest: 0,
    },
    isHome: false,
  });

  const handleGeoPosUpdate = async (latitude, longitude, radius) => {
    try {
      setGeoPosition((prevState) => ({
        ...prevState,
        current: {
          latitude,
          longitude,
        },
        radius: radius, // Default radius in km
        reach: {
          latNorth: latitude + radius / 111,
          latSouth: latitude - radius / 111,
          lonEast: longitude + radius / (111 * Math.cos(latitude)),
          lonWest: longitude - radius / (111 * Math.cos(latitude)),
        },
        isHome: false,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeoPosReset = async (radius) => {
    try {
      setGeoPosition((prevState) => ({
        ...prevState,
        current: {
          latitude: prevState.home.latitude,
          longitude: prevState.home.longitude,
        },
        radius: radius, // Default radius in km
        reach: {
          latNorth: prevState.home.latitude + 30 / 111,
          latSouth: prevState.home.latitude - 30 / 111,
          lonEast:
            prevState.home.longitude +
            30 / (111 * Math.cos(prevState.home.latitude)),
          lonWest:
            prevState.home.longitude -
            30 / (111 * Math.cos(prevState.home.latitude)),
        },
        isHome: true,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRadiusUpdate = async (radius) => {
    try {
      setGeoPosition((prevState) => ({
        ...prevState,
        radius: radius, // Default radius in km
        reach: {
          latNorth: prevState.current.latitude + radius / 111,
          latSouth: prevState.current.latitude - radius / 111,
          lonEast:
            prevState.current.longitude +
            radius / (111 * Math.cos(prevState.current.latitude)),
          lonWest:
            prevState.current.longitude -
            radius / (111 * Math.cos(prevState.current.latitude)),
        },
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleMount = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          handleGeoPosUpdate(
            position.coords.latitude,
            position.coords.longitude,
            geoPosition.radius
          );
          setGeoPosition((prevState) => ({
            ...prevState,
            isHome: false,
          }));
        });
      } else {
        handleGeoPosUpdate(
          geoPosition.home.latitude,
          geoPosition.home.longitude,
          geoPosition.radius
        );
        setGeoPosition((prevState) => ({
          ...prevState,
          isHome: true,
        }));
        // Fallback to default location if geolocation is not supported
        console.error("Geolocation is not supported by this browser.");
      }
    };

    handleMount();
  }, []);

  return (
    <GeoPositionContext.Provider value={geoPosition}>
      <SetGeoPositionContext.Provider
        value={{
          setGeoPosition,
          handleGeoPosUpdate,
          handleGeoPosReset,
          handleRadiusUpdate,
          geoPosition,
        }}
      >
        {children}
      </SetGeoPositionContext.Provider>
    </GeoPositionContext.Provider>
  );
};
