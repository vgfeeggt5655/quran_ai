
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface SurahDetail extends Surah {
    ayahs: Ayah[];
}

export interface SurahTranslationEdition {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
    direction: string;
}

export interface AyahTranslation {
    number: number;
    text: string;
    edition: SurahTranslationEdition;
}

export interface SurahWithTranslation extends Surah {
    ayahs: (Ayah & { translationText: string })[];
}
