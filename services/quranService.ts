
import { Surah, SurahWithTranslation, Ayah, AyahTranslation } from '../types';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

export async function getSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/surah`);
    if (!response.ok) {
      throw new Error('Failed to fetch Surahs list');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching Surahs:", error);
    throw error;
  }
}

export async function getSurahWithTranslation(surahNumber: number): Promise<SurahWithTranslation> {
  try {
    const [surahResponse, translationResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/surah/${surahNumber}`),
        fetch(`${API_BASE_URL}/surah/${surahNumber}/en.asad`)
    ]);

    if (!surahResponse.ok || !translationResponse.ok) {
        throw new Error(`Failed to fetch details for Surah ${surahNumber}`);
    }

    const surahData = await surahResponse.json();
    const translationData = await translationResponse.json();
    
    const originalAyahs: Ayah[] = surahData.data.ayahs;
    const translatedAyahs: AyahTranslation[] = translationData.data.ayahs;
    
    const combinedAyahs = originalAyahs.map((ayah, index) => ({
      ...ayah,
      translationText: translatedAyahs[index]?.text || 'Translation not available.',
    }));

    return { ...surahData.data, ayahs: combinedAyahs };

  } catch (error) {
    console.error(`Error fetching Surah ${surahNumber}:`, error);
    throw error;
  }
}
