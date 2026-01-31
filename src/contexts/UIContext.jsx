import { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
    const [isHeaderOpen, setIsHeaderOpen] = useState(false);
    const [headerMode, setHeaderMode] = useState('nav');
    const [headerVisible, setHeaderVisible] = useState(false);

    const openHeader = (mode = 'nav') => {
        setHeaderMode(mode);
        setIsHeaderOpen(true);
    };

    const closeHeader = () => {
        setIsHeaderOpen(false);
        setTimeout(() => setHeaderMode('nav'), 300);
    };

    const toggleHeader = () => {
        if (isHeaderOpen) {
            closeHeader();
        } else {
            openHeader('nav');
        }
    };

    const showHeader = () => setHeaderVisible(true);
    const hideHeader = () => setHeaderVisible(false);

    const value = {
        isHeaderOpen,
        headerMode,
        setHeaderMode,
        openHeader,
        closeHeader,
        toggleHeader,
        headerVisible,
        showHeader,
        hideHeader
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
