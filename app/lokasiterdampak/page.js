"use client";
import { useState, useEffect } from "react";
import Select from 'react-select'; // Import react-select
import Link from 'next/link'; // Import Link untuk navigasi

const kecamatanOptions = [
    { value: 'Kecamatan1', label: 'Kecamatan 1' },
    { value: 'Kecamatan2', label: 'Kecamatan 2' },
    { value: 'Kecamatan3', label: 'Kecamatan 3' },
    { value: 'Kecamatan4', label: 'Kecamatan 4' },
    // Tambahkan kecamatan lainnya
];

export default function Sitrep() {
    const [showForm, setShowForm] = useState(false);
    const [dataItems, setDataItems] = useState([]);
    const [formData, setFormData] = useState({
        jumlah: '',
        kecamatan: null, // Default value untuk kecamatan
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/getLokasi_terdampak/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                if (result.status) {
                    const fetchedData = result.data.map((item) => ({
                        jumlah: item.jumlah, // Ambil data jumlah
                        kecamatan: item.kec_id, // Ambil data kecamatan
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectChange = (selectedOption) => {
        setFormData({
            ...formData,
            kecamatan: selectedOption,
        });
    };

    return (
        <>
            <div className="flex flex-col items-center bg-white">
                <nav className="w-full bg-[#ff6b00] p-6 shadow-b-lg">
                    <div className="flex mt-[10px] justify-center">
                        <p className="text-white font-bold text-[22px]">Lokasi Terdampak</p>
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
                                <label className="block text-[14px] font-bold text-gray-700">Kecamatan*</label>
                                <div className="relative border border-orange-500 rounded-md">
                                    <Select
                                        name="kecamatan"
                                        value={formData.kecamatan}
                                        onChange={handleSelectChange}
                                        options={kecamatanOptions}
                                        placeholder="Pilih Kecamatan"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between mt-[50px]">
                                <Link href="/damsarpras" passHref>
                                    <button className="w-[100px] h-[40px] bg-white border border-orange-500 font-bold text-black rounded-lg">
                                        BACK
                                    </button>
                                </Link>
                                <button
                                    className="w-[100px] h-[40px] bg-[#ff6b00] font-bold text-white rounded-lg"
                                >
                                    SAVE
                                </button>
                                <Link href="/jumlahkorban" passHref>
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
                                        <p className="font-bold text-gray-700 text-md">Kecamatan</p>
                                        <p className="text-gray-800">{item.kecamatan}</p> {/* Tampilkan kecamatan langsung */}
                                    </div>
                                    <div className="w-1/2">
                                        <p className="font-bold text-gray-700 text-md">Jumlah</p>
                                        <p className="text-gray-800">{item.jumlah}</p>
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
