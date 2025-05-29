"use client";

import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  { code: "en", name: "EN" },
  { code: "es", name: "ES" },
  { code: "fr", name: "FR" },
  { code: "de", name: "DE" },
  { code: "hi", name: "HI" },
  { code: "zh", name: "ZH" },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectLanguage = (language: (typeof languages)[0]) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    // In a real app, this would update the app's language context/state
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{selectedLanguage.name}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-20 bg-white shadow-lg py-1 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => selectLanguage(language)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 ${
                selectedLanguage.code === language.code
                  ? "font-medium text-terracotta-600"
                  : "text-stone-600"
              }`}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
