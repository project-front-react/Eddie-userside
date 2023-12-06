import en from "./en";
import sw from './sw';

const translations = {
  en,
  sw,
};
export const getTranslatedText = (key, locale) => {
  // const selectedLanguage = useSelector(
  //   state => state?.homePage?.selectedLanguage,
  // );
  // const state = selectedLanguage.val;
  // locale = ar;
  const currTranslation = translations[locale] ? translations[locale] : sw;
  let translatedText = currTranslation[key]
    ? currTranslation[key]
    : sw[key]
    ? sw[key]
    : key;

  return translatedText;
};
