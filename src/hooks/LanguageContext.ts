import React, { createContext } from 'react'

export interface LanguageObject {
  code: string
  language: string
}
interface LanguageState {
  selectedLanguage: LanguageObject
  setSelectedLanguage: (langObject: LanguageObject) => void
  translatedLanguage: LanguageObject
  setTranslatedLanguage: React.Dispatch<React.SetStateAction<LanguageObject>>
}

const defaultLanguageState: LanguageState = {
  selectedLanguage: { code: 'en', language: 'English' },
  setSelectedLanguage: (): void => undefined,
  translatedLanguage: { code: 'en', language: 'English' },
  setTranslatedLanguage: (): void => undefined,
}

export const LanguageContext = createContext(defaultLanguageState as LanguageState)
