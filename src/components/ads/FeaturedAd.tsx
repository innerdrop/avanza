"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Ad {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
    linkUrl: string | null;
}

export default function FeaturedAd() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchAds();
    }, []);

    // Auto-slide every 6 seconds
    useEffect(() => {
        if (ads.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [ads.length]);

    const fetchAds = async () => {
        try {
            const res = await fetch('/api/advertisements?position=middle');
            if (res.ok) {
                const data = await res.json();
                setAds(data.slice(0, 5)); // Max 5 ads
            }
        } catch (error) {
            console.error('Error fetching featured ads:', error);
        }
    };

    const handleClick = async (adId: number) => {
        try {
            await fetch('/api/advertisements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: adId })
            });
        } catch (e) { }
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, [ads.length]);

    const goPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
    }, [ads.length]);

    if (ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    const renderAdContent = (ad: Ad) => (
        <div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 cursor-pointer group"
            onClick={() => handleClick(ad.id)}
        >
            <div className="flex flex-col md:flex-row items-center gap-6">
                {ad.imageUrl && (
                    <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                        <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}
                <div className="flex-1 text-center md:text-left">
                    <span className="inline-block px-2 py-1 text-[10px] font-bold bg-blue-100 text-blue-600 rounded-full mb-2">
                        Publicidad
                    </span>
                    <h3 className="font-bold text-xl text-gray-800 mb-1">{ad.title}</h3>
                    {ad.description && (
                        <p className="text-gray-600 text-sm">{ad.description}</p>
                    )}
                </div>
                <div className="shrink-0">
                    <span className="px-4 py-2 bg-blue-600 text-white font-medium rounded-full text-sm group-hover:bg-blue-700 transition-colors">
                        Ver más →
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative">
            {/* Main Slide */}
            {currentAd.linkUrl ? (
                <Link href={currentAd.linkUrl} target="_blank" rel="noopener noreferrer">
                    {renderAdContent(currentAd)}
                </Link>
            ) : (
                renderAdContent(currentAd)
            )}

            {/* Navigation Arrows */}
            {ads.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); goPrev(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all z-10"
                    >
                        ‹
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); goNext(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all z-10"
                    >
                        ›
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {ads.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                    {ads.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                ? 'bg-blue-600 w-6'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
