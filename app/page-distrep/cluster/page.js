"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import Select from "react-select";

export default function Sitrep() {
    const [dataItems, setDataItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [clusterOptions, setClusterOptions] = useState([]);
    const [formData, setFormData] = useState({
        cluster: '',
        program: '',
        jumlah: '',
        satuan: '',
        cluster_dist_id: '',
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/getCluster/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                if (result.status) {
                    const fetchedData = result.data.map((item) => ({
                        cluster: item.cluster || "Data tidak ada",
                        program: item.program || "Data tidak ada",
                        jumlah: item.jumlah !== null ? item.jumlah : "Data tidak ada",
                        satuan: item.satuan || "Data tidak ada",
                        cluster_dist_id: item.cluster_dist_id || "Data tidak ada"
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

    useEffect(() => {
        const fetchCluster = async () => {
            try {
                const response = await fetch("/api/getCluster/");
                if (!response.ok) throw new Error("Failed to fetch clusters");
                const data = await response.json();
                if (data && data.status && data.data) {
                    const options = data.data.map((cluster_p) => ({
                        value: cluster_p.id,
                        label: cluster_p.cluster,
                    }));
                    setClusterOptions(options);
                }
            } catch (error) {
                console.error("Error fetching cluster data:", error);
            }
        };
        fetchCluster();
    }, []);

    const selectStyles = {
        control: (base) => ({
            ...base,
            padding: "5px",
            borderColor: "#304159",
            borderRadius: "5px",
            fontSize: "14px",
            width: "100%",
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#ff6b00" : "white",
            color: state.isSelected ? "white" : "black",
            "&:hover": {
                backgroundColor: "#ff6b00",
                color: "white",
            },
        }),
    };

    const handleSelectChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }));
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-white">
            <nav className="w-full bg-orange-500 p-4 shadow-lg">
                <div className="flex justify-center">
                    <p className="text-white font-bold text-lg">Cluster</p>
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
                    <div className="space-y-4 bg-white rounded-md">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Cluster*</label>
                                <Select
                                    name="Cluster"
                                    value={clusterOptions.find((option) => option.value === formData.cluster)}
                                    onChange={(option) => handleSelectChange("cluster", option.value)}
                                    options={clusterOptions}
                                    placeholder="Pilih cluster"
                                    styles={selectStyles}
                                    className="mb-2"
                                />
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
                                    value={formData.cluster_dist_id}
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
                                    className="w-[100px] h-[40px] bg-orange-500 text-white font-bold rounded-lg"
                                >
                                    SAVE
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-6 space-y-4">
                    {dataItems.map((item, index) => (
                        <div
                            key={index}
                            className="p-4 bg-orange-100 border border-orange-500 rounded-lg shadow-md"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-bold text-gray-700">Cluster</p>
                                    <p className="text-gray-800">{item.cluster}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">Distribution</p>
                                    <p className="text-gray-800">{item.cluster_dist_id}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">Program</p>
                                    <p className="text-gray-800">{item.program}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">Satuan</p>
                                    <p className="text-gray-800">{item.satuan}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">Jumlah</p>
                                    <p className="text-gray-800">{item.jumlah}</p>
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
        </div >
    );
}
