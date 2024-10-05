"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const [isOnline, setIsOnline] = useState(true); // Set default to true for initial load
    const [showNotification, setShowNotification] = useState(false); // State to control notification visibility

    useEffect(() => {
        // Function to update online status and show notification
        const updateOnlineStatus = () => {
            setIsOnline(navigator.onLine);
            setShowNotification(true); // Show notification when status changes

            // Hide notification after 2 seconds with fade-out effect
            setTimeout(() => {
                setShowNotification(false);
            }, 2000);
        };

        // Set initial online status
        updateOnlineStatus();

        // Event listeners for online and offline status
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="w-full bg-[#ff6b00] p-6">
                <div className="flex justify-center">
                    <p className="text-white font-bold text-[22px]">WELCOME TO HUMANITARIAN</p>
                </div>
            </nav>

            <div className="flex flex-col w-full max-w-full items-center mt-4">
                <Link href="/sitrep">
                    <div className="w-full max-w-md bg-gray-100 h-[230px] rounded-lg mb-4 cursor-pointer">
                        <img src="/Situation_Report.png" alt="Situasi Riport" className="w-full h-full object-cover rounded-lg" />
                    </div>
                </Link>
            </div>

            {/* Container Distribution Riport */}
            <div className="flex flex-col w-full max-w-full items-center mb-2">
                <Link href="/page-distrep/distrep">
                    <div className="w-full max-w-md bg-gray-100 h-[230px] rounded-lg mb-4 cursor-pointer">
                        <img src="/Distribution_Report.png" alt="Distribution Riport" className="w-full h-full object-cover rounded-lg" />
                    </div>
                </Link>
            </div>

            {/* Image Powered */}
            <div className='flex flex-col items-center'>
                <img src="/Powered.png" alt="Logo" className="w-[180px] h-[50px]" />
            </div>

            {/* Menu profile */}
            <div className="flex justify-between w-full h-[50px] fixed bottom-0 bg-white border-t border-gray-200">
                <button className="py-2 px-4 w-full bg-orange-500 text-white">
                    Home
                </button>
                <button className="py-2 px-4 w-full bg-white text-black border-l border-gray-200">
                    Profile
                </button>
            </div>

            {/* Status Online/Offline */}
            <div className={`fixed mt-[80px] right-4 px-4 py-2 text-white rounded-md transition-opacity duration-500 ${showNotification ? 'opacity-100' : 'opacity-0'} ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
                {isOnline ? 'Kamu sedang online' : 'Kamu sedang offline'}
            </div>
        </div>
    );
}
