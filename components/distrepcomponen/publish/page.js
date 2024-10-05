"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function Publish() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dataItems, setDataItems] = useState([]);

    // Fetch data from API
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/getDistrep/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                if (result.status) {
                    const filteredData = result.data.map((item) => ({
                        nama_kejadian: item.nama_kejadian,
                        tanggal_penyaluran: item.tanggal_penyaluran,
                        city: item.city
                    }));
                    setDataItems(filteredData);
                } else {
                    console.error("Data tidak tersedia");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const filteredItems = dataItems.filter((item) =>
        item.nama_kejadian?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    return (
        <>
            <div className="w-full flex items-center justify-between mb-4">
                <Link href="./createdistreppublish">
                    <button className="w-[130px] h-[40px] bg-[#8bff7f] rounded-lg text-[13px] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[24px] h-[24px] mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Entry Report</span>
                    </button>
                </Link>
            </div>

            {/* Search bar */}
            <div className="flex flex-col mb-4 mt-5">
                <div className="flex items-center border border-orange-500 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[24px] h-[24px] ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 0l4 4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
                    </svg>
                    <input type="text" placeholder="Search..." className="flex-grow p-3 rounded-lg focus:outline-none" value={searchTerm} onChange={handleSearchChange} />
                </div>
            </div>

            {/* Checkbox "Select All" */}
            <div className="bg-white min-h-full">
                <div className="relative w-full min-h-full">
                    {filteredItems.length === 0 ? (
                        <div className="text-gray-500">
                            {searchTerm ? `"${searchTerm}" not found` : "No items available"}
                        </div>
                    ) : (
                        filteredItems.map((item, index) => (
                            <div key={item.id} className="shadow-md mb-4 rounded-[20px]">
                                <div className="shadow-lg p-2 rounded-[20px] flex items-center">
                                    <div className="flex-1 flex items-center justify-between p-4 rounded-lg">
                                        <div className="flex flex-col">
                                            <p className="font-bold">{item.nama_kejadian || "N/A"}</p>
                                            <p className="mt-2">{item.city || "N/A"}</p>
                                        </div>
                                        <p className="text-right">{item.tanggal_penyaluran || "N/A"}</p>
                                    </div>
                                    <div className="border-l border-orange-500 h-[50px] mx-2"></div>
                                    <button className="text-gray-500 hover:text-gray-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[40px] h-[40px]">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.862 3.487a2.121 2.121 0 013.004 0l1.586 1.586a2.121 2.121 0 010 3.004l-1.586 1.586-4.588-4.588 1.586-1.586zM2 17.25V22h4.75l9.74-9.739-4.588-4.588L2 17.25z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}