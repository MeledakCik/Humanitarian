"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from 'next/link';
import Select from "react-select";

export default function Sitrep() {
    const router = useRouter();
    const { id } = useParams();
    const [dataItems, setDataItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        id: '',
        cluster: '',
        program: '',
        jumlah: '',
        satuan: '',
        cluster_dist_id: id,
    });

    const clusterOptions = [
        { value: 'Cluster1', label: 'Cluster 1' },
        { value: 'Cluster2', label: 'Cluster 2' },
        { value: 'Cluster3', label: 'Cluster 3' },
        { value: 'Cluster4', label: 'Cluster 4' },
    ];

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

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            cluster: item.cluster,
            jumlah: item.jumlah,
            satuan: item.satuan,
            cluster_dist_id: item.cluster_dist_id,
        });
        setShowForm(true);
    };

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            cluster_dist_id: id,
        }));
    }, [id]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`/api/getCluster?cluster_dist_id=${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                if (result.status && result.data) {
                    const filteredData = result.data.filter(item => item.cluster_dist_id === parseInt(id));

                    const fetchedData = filteredData.map((item) => ({
                        id: item.id || "Data tidak ada",
                        cluster: item.cluster || "Data tidak ada",
                        program: item.program || "Data tidak ada",
                        jumlah: item.jumlah  || "Data tidak ada",
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

        const intervalId = setInterval(fetchData, 3000);
        return () => clearInterval(intervalId);
    }, [id]);

    const handleDelete = async (itemId) => {
        if (!itemId) {
            console.error("ID tidak ditemukan:", itemId);
            return;
        }
        try {
            const response = await fetch(`/api/deleteCluster?id=${itemId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: itemId }), // Pastikan ID ada di body
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            const data = await response.json();
            setDataItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
            setMessage("Data berhasil dihapus.");
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

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

                <div className="mt-6 space-y-4 w-[380px] max-w-md">
                    {dataItems.map((item, index) => (
                        <div
                            key={index}
                            className="p-4 bg-orange-100 border border-orange-500 rounded-lg shadow-md space-y-3"
                        >
                            {/* Grid layout for consistent alignment */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="font-bold text-gray-700">Cluster</p>
                                    <p className="text-gray-800 truncate" title={item.cluster}>{item.cluster}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">Jumlah</p>
                                    <p className="text-gray-800 truncate" title={item.jumlah}>{item.jumlah}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">Distribution</p>
                                    <p className="text-gray-800 truncate" title={item.cluster_dist_id}>{item.cluster_dist_id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="font-bold text-gray-700">Satuan</p>
                                    <p className="text-gray-800 truncate" title={item.satuan}>{item.satuan}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">Program</p>
                                    <p className="text-gray-800 truncate" title={item.program}>{item.program}</p>
                                </div>
                                <div>
                                    {/* Empty div to keep alignment */}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                    onClick={() => handleEdit(item)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-4M16 3h-4v2h4V3z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700 flex items-center"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-1.293-1.293A1 1 0 0017.414 5H6.586a1 1 0 00-.707.293L5 7m2 10h10a2 2 0 002-2V7m-2 10H7a2 2 0 01-2-2V7m0 0h12m-6 4h.01" />
                                    </svg>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}
