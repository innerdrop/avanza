"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Ad {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
    linkUrl: string | null;
    level: number;
}

export default function PremiumBanner() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchAds();
    }, []);

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (ads.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [ads.length]);

    const fetchAds = async () => {
        try {
            const res = await fetch('/api/advertisements?position=hero');
            if (res.ok) {
                const data = await res.json();
                setAds(data.slice(0, 5)); // Max 5 ads
            }
        } catch (error) {
            console.error('Error fetching premium ads:', error);
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
            className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 p-1 shadow-xl cursor-pointer group"
            onClick={() => handleClick(ad.id)}
        >
            <div className="bg-white rounded-xl overflow-hidden">
                {ad.imageUrl ? (
                    <div className="relative h-40 sm:h-52 w-full">
                        <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <p className="font-bold text-lg sm:text-xl">{ad.title}</p>
                            {ad.description && (
                                <p className="text-sm text-white/80 line-clamp-2">{ad.description}</p>
                            )}
                        </div>
                        <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold bg-black/40 backdrop-blur-sm text-white/80 rounded-full">
                            Publicidad
                        </span>
                    </div>
                ) : (
                    <div className="p-6 text-center h-40 sm:h-52 flex flex-col items-center justify-center">
                        <p className="font-bold text-lg text-gray-800">{ad.title}</p>
                        {ad.description && (
                            <p className="text-sm text-gray-600 mt-1">{ad.description}</p>
                        )}
                        <span className="inline-block mt-2 px-2 py-1 text-[10px] font-bold bg-gray-100 text-gray-500 rounded-full">
                            Publicidad
                        </span>
                    </div>
                )}
            </div>
        </div>
    );

    const content = (
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
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all z-10"
                    >
                        ‹
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); goNext(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all z-10"
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
                                ? 'bg-purple-600 w-6'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    return content;
}
