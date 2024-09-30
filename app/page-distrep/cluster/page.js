"use client";
import { useState } from "react";

export default function Sitrep() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        cluster: '',
        program: '',
        jumlah: '',
        satuan: '',
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
        setFormData({ cluster: '', program: '', jumlah: '', satuan: '', distribution: '' });
        setShowForm(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-white">
            <nav className="w-full bg-orange-500 p-4 shadow-lg">
                <div className="flex justify-center">
                    <p className="text-white font-bold text-lg">Cluster</p>
                </div>
            </nav>

            <div className="w-full max-w-4xl px-4 mt-4"> 
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

                <div className="p-4">
                    {showForm && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Cluster*</label>
                                <select
                                    name="cluster"
                                    value={formData.cluster}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                >
                                    <option value="">Please select...</option>
                                    <option value="Cluster1">Cluster 1</option>
                                    <option value="Cluster2">Cluster 2</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700">Program*</label>
                                <input
                                    type="text"
                                    name="program"
                                    value={formData.program}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700">Jumlah</label>
                                <input
                                    type="number"
                                    name="jumlah"
                                    value={formData.jumlah}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700">Satuan*</label>
                                <input
                                    type="text"
                                    name="satuan"
                                    value={formData.satuan}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700">Distribution*</label>
                                <select
                                    name="distribution"
                                    value={formData.distribution}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                >
                                    <option value="">Please select...</option>
                                    <option value="Distribution1">Distribution 1</option>
                                    <option value="Distribution2">Distribution 2</option>
                                </select>
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

                <div className="mt-6 space-y-4">
                    {savedData.map((data, index) => (
                        <div
                            key={index}
                            className="p-4 bg-orange-100 border border-orange-500 rounded-lg shadow-md"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-bold text-gray-700">Cluster</p>
                                    <p className="text-gray-800">{data.cluster}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">Distribution</p>
                                    <p className="text-gray-800">{data.distribution}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">Program</p>
                                    <p className="text-gray-800">{data.program}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">Satuan</p>
                                    <p className="text-gray-800">{data.satuan}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">Jumlah</p>
                                    <p className="text-gray-800">{data.jumlah}</p>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-lg">Edit</button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Hapus</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
