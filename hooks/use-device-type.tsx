import { useState, useEffect } from 'react';

// breakpoints 
const MOBILE_BREAKPOINT = 576;
const TABLET_BREAKPOINT = 768;

// Define an enum for the device types
export enum DeviceType {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop',
}

const useDeviceType = (): DeviceType => {
    const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.Desktop);

    useEffect(() => {
        const setResponsivelyDeviceType = () => {
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                setDeviceType(DeviceType.Mobile);
            } else if (window.innerWidth > MOBILE_BREAKPOINT && window.innerWidth <= TABLET_BREAKPOINT) {
                setDeviceType(DeviceType.Tablet);
            } else {
                setDeviceType(DeviceType.Desktop);
            }
        };

        // Call the function once to get the initial window size
        setResponsivelyDeviceType();
        
        // Add a listener to update the state whenever the window size changes
        window.addEventListener('resize', setResponsivelyDeviceType);
        
        // Remove the listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', setResponsivelyDeviceType);
        };
    }, []);

    return deviceType;
};

export default useDeviceType;