import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { INDIAN_LANGUAGES } from '../constants/languages';

const LanguageContext = createContext();

const STORAGE_LANG_KEY = '@app_selected_language';
const STORAGE_DICT_PREFIX = '@app_dict_';

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState('en');
  const [dictionary, setDictionary] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStoredLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(STORAGE_LANG_KEY);
        if (savedLang) {
          await changeLanguage(savedLang);
        }
      } catch (err) {
        console.error('Error loading stored language:', err);
      }
    };
    loadStoredLanguage();
  }, []);

  const changeLanguage = async (langCode) => {
    setCurrentLang(langCode);
    await AsyncStorage.setItem(STORAGE_LANG_KEY, langCode);

    if (langCode === 'en') {
      setDictionary({});
      return;
    }

    try {
      const cachedDict = await AsyncStorage.getItem(STORAGE_DICT_PREFIX + langCode);
      if (cachedDict) {
        setDictionary(JSON.parse(cachedDict));
        return;
      }
    } catch (e) {
      console.warn('Local dictionary cache read error', e);
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://lumen-backend-n5li.onrender.com/api/translations?lang=${langCode}`
      );
      if (res.data && res.data.translations) {
        setDictionary(res.data.translations);
        await AsyncStorage.setItem(
          STORAGE_DICT_PREFIX + langCode,
          JSON.stringify(res.data.translations)
        );
      }
    } catch (err) {
      console.warn('Backend translation failed, falling back to English', err);
    } finally {
      setLoading(false);
    }
  };

  const t = (key, fallback) => {
    if (currentLang === 'en') return fallback;
    return dictionary[key] || fallback;
  };

  const getLanguageDetails = (code) => {
    return INDIAN_LANGUAGES.find((item) => item.code === code) || INDIAN_LANGUAGES[0];
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        currentLanguageDetails: getLanguageDetails(currentLang),
        changeLanguage,
        t,
        loading,
        languages: INDIAN_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);