import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import i18n from '@/i18n';

interface LanguageContextType {
    language: string;
    changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
    language: 'fr',
    changeLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState(i18n.language);
    const [, forceUpdate] = useReducer((x) => x + 1, 0); // ✅ Force re-render

    useEffect(() => {
        const handleLanguageChanged = (lng: string) => {
            console.log('🌍 LanguageContext - Langue changée:', lng);
            setLanguage(lng);
            forceUpdate(); // ✅ Force un re-render
        };

        i18n.on('languageChanged', handleLanguageChanged);

        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, []);

    const changeLanguage = (lang: string) => {
        console.log('🔄 LanguageContext - Changement vers:', lang);
        i18n.changeLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
