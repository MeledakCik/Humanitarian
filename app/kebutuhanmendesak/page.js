"use client";
import { useState, useEffect } from "react";
import Link from 'next/link'; // Import Link untuk navigasi

export default function Sitrep() {
    const [showForm, setShowForm] = useState(false);
    const [dataItems, setDataItems] = useState([]);
    const [formData, setFormData] = useState({
        jumlah: '',
        kebutuhanmendesak: '',
        satuan: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/getKebutuhan_mendesak/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                if (result.status) {
                    const fetchedData = result.data.map((item) => ({
                        jumlah: item.jumlah, // Ambil data jumlah
                        kebutuhanmendesak: item.kebutuhan_mendesak, // Ambil data jenis korban jiwa
                        satuan: item.satuan, // Ambil data satuan
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
        <>
            <div className="flex flex-col items-center bg-white">
                <nav className="w-full bg-[#ff6b00] p-6 shadow-b-lg">
                    <div className="flex mt-[10px] justify-center">
                        <p className="text-white font-bold text-[22px]">Kebutuhan Mendesak</p>
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

                    {showForm && (
                        <div className="mt-[10px] bg-white rounded-lg">
                            <div className="mb-4">
                                <label className="block text-[14px] font-bold text-gray-700">Kebutuhan Mendesak*</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="kebutuhanmendesak"
                                        value={formData.kebutuhanmendesak}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-[14px] font-bold text-gray-700">Jumlah*</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="jumlah"
                                        value={formData.jumlah}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-[14px] font-bold text-gray-700">Satuan*</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="satuan"
                                        value={formData.satuan}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Link href="/pengungsi" passHref>
                                    <button className="w-[100px] h-[40px] bg-white border border-orange-500 font-bold text-black rounded-lg">
                                        BACK
                                    </button>
                                </Link>
                                <button
                                    className="w-[100px] h-[40px] bg-[#ff6b00] font-bold text-white rounded-lg"
                                >
                                    SAVE
                                </button>
                                <Link href="/sitrep" passHref>
                                    <button className="w-[100px] h-[40px] bg-[#ff6b00] font-bold text-white rounded-lg">
                                        NEXT
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 space-y-4 w-[380px] max-w-md">
                        {dataItems.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 bg-orange-100 border border-orange-500 rounded-lg shadow-md"
                            >
                                <div className="flex justify-between">
                                    <div className="w-1/2">
                                        <p className="font-bold text-gray-700 text-md">Kebutuhan Mendesak</p>
                                        <p className="text-gray-800">{item.kebutuhanmendesak}</p>
                                        <p className="font-bold text-gray-700 text-md mt-4">Jumlah</p>
                                        <p className="text-gray-800">{item.jumlah}</p>
                                    </div>

                                    <div className="w-1/4 flex flex-col">
                                        <p className="font-bold text-gray-700 text-md">Satuan</p>
                                        <p className="text-gray-800">{item.satuan}</p>
                                        <div className="flex items-center mt-4">
                                            <button className="mr-4 text-blue-500 hover:text-blue-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-4M16 3h-4v2h4V3z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button className="text-red-500 hover:text-red-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M10 3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
