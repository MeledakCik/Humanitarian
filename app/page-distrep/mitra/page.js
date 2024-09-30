"use client";
import { useState } from "react";

export default function Sitrep() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        mitra: '',
        distribution: '',
    });
    const [savedData, setSavedData] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        setSavedData([...savedData, formData]);
        setFormData({ mitra: '', distribution: '' });
        setShowForm(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-white"> 
            <nav className="w-full bg-orange-500 p-4 sm:p-6 shadow-lg">
                <div className="flex justify-center">
                    <p className="text-white font-bold text-lg sm:text-xl">Mitra</p>
                </div>
            </nav>

            <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12 mt-4">
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

                {/* Latar putih tetap ada meski form disembunyikan */}
                <div className="p-4 ">
                    {showForm && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Mitra*</label>
                                <input
                                    type="text"
                                    name="mitra"
                                    value={formData.mitra}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700">Distribution*</label>
                                <input
                                    type="text"
                                    name="distribution"
                                    value={formData.distribution}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="w-[100px] h-[40px] bg-white border border-orange-500 text-black font-bold rounded-lg"
                                >
                                    BACK
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="w-[100px] h-[40px] bg-orange-500 text-white font-bold rounded-lg"
                                >
                                    SAVE
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Selalu tampilkan data yang sudah disimpan */}
                <div className="mt-6 space-y-4">
                    {savedData.map((data, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white border border-orange-500 rounded-lg shadow-md"
                        >
                            <div className="flex justify-between">
                                <p className="font-bold text-gray-700">Mitra</p>
                                <p className="text-gray-800">{data.mitra}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-bold text-gray-700">Distribution</p>
                                <p className="text-gray-800">{data.distribution}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
