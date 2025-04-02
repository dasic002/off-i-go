import { createContext, useContext, useEffect, useState } from "react";

export const DeviceSizeContext = createContext();

export const useDeviceSize = () => useContext(DeviceSizeContext);

export const DeviceSizeProvider = ({ children }) => {
  const [deviceSize, setDeviceSize] = useState("mobile");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        setDeviceSize("mobile");
      } else {
        setDeviceSize("desktop");
      }
    };

    handleResize(); // Set initial device size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <DeviceSizeContext.Provider value={deviceSize}>
      {children}
    </DeviceSizeContext.Provider>
  );
};
