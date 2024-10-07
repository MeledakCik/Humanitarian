"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import Draft from '@/components/draft/page';
import Publish from '@/components/publish/page';
import { IoIosArrowBack } from "react-icons/io";

export default function Sitrep() {
    const [activeMenu, setActiveMenu] = useState('publish');

    return (
        <div className="flex flex-col items-center bg-white">
            <nav className="w-full bg-[#ff6b00] p-6 shadow-b-lg">
                <div className="flex mt-[10px] justify-center relative">
                    <Link href="/homeprofile"> 
                        <p className="absolute left-4 top-[50%] transform -translate-y-1/2">
                            <IoIosArrowBack className="text-white text-[42px]" />
                        </p>
                    </Link>
                    <p className="text-white font-bold text-[22px]">Situation Report</p>
                </div>
            </nav>

            <div className="flex flex-col w-[400px] max-w-md min-h-screen mt-[1px]">
                <div className="flex">
                    <button
                        onClick={() => setActiveMenu('publish')}
                        className={`py-4 px-4 w-full ${activeMenu === 'publish' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
                    >
                        Publish
                    </button>
                    <button
                        onClick={() => setActiveMenu('draft')}
                        className={`py-4 px-4 w-full ${activeMenu === 'draft' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
                    >
                        Draft
                    </button>
                </div>

                {activeMenu === 'publish' && (
                    <div className="p-4 bg-white min-h-screen">
                        <Publish />
                    </div>
                )}

                {activeMenu === 'draft' && (
                    <div className="p-4 bg-white min-h-screen">
                        <Draft />
                    </div>
                )}
            </div>
        </div>
    );
}
