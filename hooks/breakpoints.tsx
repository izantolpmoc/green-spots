import { useState, useEffect } from 'react';

// breakpoints 

const MOBILE_BREAKPOINT = 576;
const TABLET_BREAKPOINT = 768;

export const useIsMobile = (): boolean => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

        const handleResize = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isMobile;
};

export const useIsTablet = (): boolean => {
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        setIsTablet(window.innerWidth > MOBILE_BREAKPOINT && window.innerWidth <= TABLET_BREAKPOINT);

        const handleResize = () => {
            setIsTablet(window.innerWidth > MOBILE_BREAKPOINT && window.innerWidth <= TABLET_BREAKPOINT);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isTablet;
};

export const useIsDesktop = (): boolean => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        setIsDesktop(window.innerWidth > TABLET_BREAKPOINT);

        const handleResize = () => {
            setIsDesktop(window.innerWidth > TABLET_BREAKPOINT);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isDesktop;
};
