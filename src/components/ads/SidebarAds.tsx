"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ad {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
    linkUrl: string | null;
}

export default function SidebarAds() {
    const [ads, setAds] = useState<Ad[]>([]);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const res = await fetch('/api/advertisements?position=sidebar');
            if (res.ok) {
                const data = await res.json();
                setAds(data.slice(0, 4)); // Max 4 sidebar ads (stacked)
            }
        } catch (error) {
            console.error('Error fetching sidebar ads:', error);
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

    if (ads.length === 0) return null;

    return (
        <div className="space-y-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Publicidad</p>
            {ads.map((ad) => {
                const content = (
                    <div
                        key={ad.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
                        onClick={() => handleClick(ad.id)}
                    >
                        {ad.imageUrl ? (
                            <div className="h-24 w-full overflow-hidden">
                                <img
                                    src={ad.imageUrl}
                                    alt={ad.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        ) : null}
                        <div className="p-3">
                            <p className="font-medium text-sm text-gray-800 line-clamp-2">{ad.title}</p>
                            {ad.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ad.description}</p>
                            )}
                        </div>
                    </div>
                );

                if (ad.linkUrl) {
                    return (
                        <Link key={ad.id} href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
                            {content}
                        </Link>
                    );
                }

                return <div key={ad.id}>{content}</div>;
            })}
        </div>
    );
}
