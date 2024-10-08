"use client";
import { useState, useEffect } from "react";
import Link from 'next/link'; // Import Link dari Next.js

export default function Sitrep() {
    const [dataItems, setDataItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        mitra: "",
        distribution: ""
    });

    // Fetch data from API
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/getMitra/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                if (result.status) {
                    const fetchedData = result.data.map((item) => ({
                        mitra: item.mitra,
                        mitra_dist_id: item.mitra_dist_id
                    }));
                    setDataItems(fetchedData);
                } else {
                    console.error("Data tidak tersedia");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen bg-white">
            <nav className="w-full bg-orange-500 p-4 sm:p-6 shadow-lg">
                <div className="flex justify-center">
                    <p className="text-white font-bold text-lg sm:text-xl">Mitra</p>
                </div>
            </nav>

            <div className="w-[380px] max-w-md mt-4">
                <button
                    className="w-full h-[50px] bg-green-500 rounded-lg text-white font-bold flex items-center justify-center mb-4"
                    onClick={() => setShowForm(!showForm)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 mr-2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {showForm ? "Tutup Data" : "Tambahkan Data"}
                </button>

                {/* Form untuk menambahkan data */}
                {showForm && (
                    <div className="space-y-4 bg-white">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Mitra*</label>
                            <input
                                type="text"
                                name="mitra"
                                value={formData.mitra}
                                onChange={(e) => setFormData({ ...formData, mitra: e.target.value })}
                                className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700">Distribution*</label>
                            <input
                                type="text"
                                name="distribution"
                                value={formData.distribution}
                                onChange={(e) => setFormData({ ...formData, distribution: e.target.value })}
                                className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                            />
                        </div>

                        <div className="flex justify-between">
                            <Link href="./createdistreppublish" passHref>
                                <button className="w-[100px] h-[40px] bg-white border border-orange-500 text-black font-bold rounded-lg">
                                    BACK
                                </button>
                            </Link>
                            <button
                                className="w-[100px] h-[40px] bg-orange-500 text-white font-bold rounded-lg"
                            >
                                SAVE
                            </button>
                        </div>
                    </div>
                )}

                {/* Tampilkan data yang sudah disimpan */}
                <div className="mt-6 space-y-4">
                    {dataItems.map((item, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white border border-orange-500 rounded-lg shadow-md"
                        >
                            <div className="flex justify-between flex-wrap">
                                <p className="font-bold text-gray-700">Mitra</p>
                                <p className="text-gray-800 max-w-[150px] sm:max-w-[200px] lg:max-w-[300px] truncate">
                                    {item.mitra}
                                </p>
                            </div>
                            <div className="flex justify-between flex-wrap">
                                <p className="font-bold text-gray-700">Distribution</p>
                                <p className="text-gray-800 max-w-[150px] sm:max-w-[200px] lg:max-w-[300px] truncate">
                                    {item.mitra_dist_id ? item.mitra_dist_id : "Tidak ada data / belum diisi"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
