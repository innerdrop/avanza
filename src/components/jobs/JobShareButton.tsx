"use client";

import React from 'react';

interface JobShareButtonProps {
    jobId: number;
    jobTitle: string;
    jobCompany: string;
    children?: React.ReactNode;
    className?: string;
}

export default function JobShareButton({ jobId, jobTitle, jobCompany, children, className }: JobShareButtonProps) {
    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Ensure we are in a browser context
        if (typeof window === 'undefined') return;

        const url = `${window.location.origin}/empleos/${jobId}`;
        const shareData = {
            title: jobTitle,
            text: `Mira esta oferta laboral: ${jobTitle} en ${jobCompany}`,
            url: url,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                alert("Enlace copiado al portapapeles");
            } else {
                // Fallback for very old browsers or non-secure contexts
                const textArea = document.createElement("textarea");
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert("Enlace copiado al portapapeles");
            }
        } catch (err) {
            console.error("Error al compartir:", err);
            // Even if an error occurs (like user canceling the share menu), 
            // we at least tried. If it was a critical failure, we can fallback to clipboard.
            try {
                await navigator.clipboard.writeText(url);
                alert("Enlace copiado al portapapeles");
            } catch (copyErr) {
                console.error("Fallback copy failed:", copyErr);
            }
        }
    };

    if (children) {
        return (
            <button onClick={handleShare} className={className}>
                {children}
            </button>
        );
    }

    return (
        <button
            onClick={handleShare}
            className={className || "p-2 text-gray-400 hover:text-[var(--primary)] transition-colors relative z-10"}
            title="Compartir"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
        </button>
    );
}
