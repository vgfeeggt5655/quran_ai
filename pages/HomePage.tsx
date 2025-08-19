
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getSurahs, getSurahWithTranslation } from '../services/quranService';
import { Surah, SurahWithTranslation } from '../types';
import Spinner from '../components/Spinner';

const HomePage: React.FC = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<SurahWithTranslation | null>(null);
    const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSurahListOpen, setIsSurahListOpen] = useState(false);

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                setError(null);
                const surahList = await getSurahs();
                setSurahs(surahList);
            } catch (err) {
                setError('Failed to load Surahs. Please try again later.');
            } finally {
                setIsLoadingSurahs(false);
            }
        };

        fetchSurahs();
    }, []);

    const handleSelectSurah = useCallback(async (surahNumber: number) => {
        setIsSurahListOpen(false);
        setIsLoadingContent(true);
        setSelectedSurah(null);
        setError(null);
        try {
            const surahContent = await getSurahWithTranslation(surahNumber);
            setSelectedSurah(surahContent);
            window.scrollTo(0, 0); // Scroll to top
        } catch (err) {
            setError('Failed to load Surah content. Please try again.');
        } finally {
            setIsLoadingContent(false);
        }
    }, []);

    const filteredSurahs = useMemo(() => {
        if (!searchTerm) return surahs;
        return surahs.filter(surah => 
            surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.number.toString().includes(searchTerm)
        );
    }, [surahs, searchTerm]);
    
    const Bismillah = () => (
        <div className="text-center mb-6">
            <p className="text-3xl font-amiri text-gray-800 dark:text-gray-200">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Main Content */}
            <main className="pb-24">
                {isLoadingContent && <div className="pt-20"><Spinner /></div>}
                {error && <div className="pt-20 text-center text-red-500">{error}</div>}
                
                {selectedSurah ? (
                    <div className="max-w-4xl mx-auto p-4 md:p-8 mt-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                            <div className="text-center p-6 border-b-2 border-teal-500 dark:border-teal-400">
                                <h2 className="text-5xl font-amiri mb-2">{selectedSurah.name}</h2>
                                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{selectedSurah.englishName}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{selectedSurah.englishNameTranslation}</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{selectedSurah.revelationType} - {selectedSurah.numberOfAyahs} Ayahs</p>
                            </div>
                            <div className="p-6 md:p-8">
                                {selectedSurah.number !== 1 && selectedSurah.number !== 9 && <Bismillah />}
                                <div className="space-y-10">
                                    {selectedSurah.ayahs.map(ayah => (
                                        <div key={ayah.number}>
                                            <p dir="rtl" className="text-4xl leading-loose text-right font-amiri mb-4">
                                                {ayah.text}
                                                <span className="font-sans text-xl text-teal-600 dark:text-teal-400 select-none">
                                                   ﴿{ayah.numberInSurah.toLocaleString('ar-EG')}﴾
                                                </span>
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-left border-l-4 border-teal-500 pl-4">
                                                {ayah.translationText}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    !isLoadingContent && (
                        <div className="flex flex-col items-center justify-center h-screen text-center">
                            <div className="transform -translate-y-16">
                                <h1 className="text-6xl font-amiri text-gray-700 dark:text-gray-300 mb-4">القرآن الكريم</h1>
                                <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">Select a Surah to begin your reading journey.</p>
                                <button 
                                    onClick={() => setIsSurahListOpen(true)}
                                    className="bg-teal-600 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-700 transition-transform transform hover:scale-105 shadow-lg"
                                >
                                    Choose Surah
                                </button>
                            </div>
                        </div>
                    )
                )}
            </main>

            {/* Surah Selection FAB */}
            {selectedSurah && !isSurahListOpen && (
                 <button
                    onClick={() => setIsSurahListOpen(true)}
                    className="fixed bottom-6 right-6 z-30 bg-teal-600 text-white rounded-full p-4 shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800 transition-transform transform hover:scale-110"
                    aria-label="Select a Surah"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}

            {/* Bottom Sheet for Surah List */}
            {isSurahListOpen && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setIsSurahListOpen(false)}
                  aria-hidden="true"
                ></div>
            )}
            <div 
                className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out ${isSurahListOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ maxHeight: '85vh' }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="surah-list-heading"
            >
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center rounded-t-2xl">
                    <div className="w-8 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto" />
                </div>
                 <div className="p-4 sticky top-12 bg-white dark:bg-gray-800">
                    <h2 id="surah-list-heading" className="text-xl font-bold text-center mb-4">Select a Surah</h2>
                     <input
                        type="search"
                        placeholder="Search by name or number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                </div>
                <div className="overflow-y-auto" style={{ height: 'calc(85vh - 140px)' }}>
                    {isLoadingSurahs ? <Spinner /> : (
                        <ul>
                            {filteredSurahs.map(surah => (
                                <li key={surah.number}>
                                    <button 
                                        onClick={() => handleSelectSurah(surah.number)} 
                                        className="w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-teal-100 dark:focus:bg-teal-900 transition-colors duration-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="flex items-center justify-center h-10 w-10 text-lg font-bold text-teal-600 dark:text-teal-400 bg-gray-100 dark:bg-gray-700 rounded-full">{surah.number}</span>
                                                <div className="ml-4">
                                                    <p className="font-semibold text-lg">{surah.englishName}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{surah.englishNameTranslation}</p>
                                                </div>
                                            </div>
                                            <p className="text-2xl font-amiri">{surah.name}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
