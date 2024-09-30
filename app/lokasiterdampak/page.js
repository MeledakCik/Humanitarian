"use client";
import { useState } from "react";
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
    const [formData, setFormData] = useState({
        jumlah: '',
        kecamatan: null, // Default value untuk kecamatan
    });
    const [savedData, setSavedData] = useState([]); // State untuk menyimpan semua data yang diinput

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

    const handleSave = () => {
        // Menyimpan data ke array savedData
        setSavedData([...savedData, formData]);
        setFormData({ jumlah: '', kecamatan: null }); // Reset form setelah save
        setShowForm(false); // Menyembunyikan form setelah save
    };

    const handleBack = () => {
        setShowForm(false); // Menyembunyikan form tanpa save
    };

    return (
        <>
            <div className="flex flex-col items-center bg-gray-100">
                <nav className="w-full bg-[#ff6b00] p-6 shadow-b-lg">
                    <div className="flex mt-[10px] justify-center">
                        <p className="text-white font-bold text-[22px]">Lokasi Terdampak</p>
                    </div>
                </nav>
                <div className="w-full relative min-h-full bg-white">
                    <div className="flex items-center justify-center mt-[20px]">
                        <button
                            className="w-[325px] h-[50px] bg-[#8bff7f] rounded-lg text-[13px] flex items-center justify-center"
                            onClick={() => setShowForm(!showForm)} // Toggle form saat button ditekan
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-[24px] h-[24px] mr-2 font-bold text-[#57636C]"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span className="font-bold font-[700] text-[#57636C]">
                                {showForm ? "Tutup Data" : "Tambahkan Data"}
                            </span>
                        </button>
                    </div>

                    {showForm && (
                        <div className="mt-[10px] p-7 bg-white rounded-lg">
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

                            <div className="flex justify-between">
                                <Link href="/damsarpras" passHref>
                                    <button className="w-[100px] h-[40px] bg-white border border-orange-500 font-bold text-black rounded-lg">
                                        BACK
                                    </button>
                                </Link>
                                <button
                                    onClick={handleSave}
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

                    <div className="mt-[20px] p-4">
                        {savedData.map((data, index) => (
                            <div
                                key={index}
                                className="mb-4 p-4 bg-white border border-orange-500 rounded-lg shadow-md"
                            >
                                <div className="flex justify-between">
                                    <div className="w-1/2">
                                        <p className="font-bold text-gray-700 text-md">Kecamatan</p>
                                        <p className="text-gray-800">{data.kecamatan?.label}</p>
                                    </div>
                                    <div className="w-1/2">
                                        <p className="font-bold text-gray-700 text-md">Jumlah</p>
                                        <p className="text-gray-800">{data.jumlah}</p>
                                    </div>
                                    <div className="flex">
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
                                            Hapus
                                        </button>
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
