"use client";
import { useState, useEffect,useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from 'next/link';

export default function Sitrep() {
    const router = useRouter();
    const { id } = useParams();
    const [dataItems, setDataItems] = useState([]);
    const [allData, setAllData] = useState([]); // All data fetched
    const [currentIndex, setCurrentIndex] = useState(0); // Current index for pagination
    const containerRef = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [storedKorbanSiteId, setStoredKorbanSiteId] = useState(localStorage.getItem('mitra_dist_id') || null);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        id: '',
        mitra: "",
        mitra_dist_id: id || ""
    });

    useEffect(() => {
        localStorage.setItem('mitra_dist_id', id);
    }, [id]);

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            mitra: item.mitra,
            mitra_dist_id: storedKorbanSiteId
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: formData.id,
                mitra: formData.mitra,
                mitra_dist_id: id,
            };

            const response = await fetch(
                formData.id ? "/api/updateMitra" : "/api/createMitra",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            setIsSubmit(true)
            const data = await response.json();
            if (response.ok) {
                setMessage("Data berhasil disimpan.");
                setFormData({
                    id: '',
                    mitra: "",
                    mitra_dist_id: id
                });
                setShowForm(false);
                setIsSubmit(false)
            } else {
                setMessage(`Error: ${data.message || "Submission failed"}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`/api/getMitra?mitra_dist_id=${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                if (result.status && result.data) {
                    // Filter data sesuai dengan mitra_dist_id dari parameter
                    const filteredData = result.data.filter(item => item.mitra_dist_id === parseInt(id));

                    const fetchedData = filteredData.map((item) => ({
                        id: item.id || "Data tidak ada",
                        mitra: item.mitra || "Data tidak ada",
                        mitra_dist_id: item.mitra_dist_id || "Data tidak ada"
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
            const response = await fetch(`/api/deleteMitra?id=${itemId}`, {
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
                    <div className="space-y-4 bg-white" onSubmit={handleSubmit}>
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
                        <div className="flex justify-between">
                            <Link href="../sitrep" passHref>
                                <button className="w-[100px] h-[40px] bg-white border border-orange-500 font-bold text-black rounded-lg">
                                    RESET
                                </button>
                            </Link>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="bg-orange-500 text-white py-2 px-6 font-bold rounded"
                            >
                                {formData.id ? "UPDATE" : "SAVE"}
                            </button>
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
                                    <p className="font-bold text-gray-700 text-md">Mitra</p>
                                    <p className="text-gray-800">{item.mitra}</p>
                                </div>
                                <div className="flex mt-4">
                                    <button className="mr-4 text-blue-500 hover:text-blue-700" onClick={() => handleEdit(item)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-4M16 3h-4v2h4V3z" />
                                        </svg>
                                    </button>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-1.293-1.293A1 1 0 0017.414 5H6.586a1 1 0 00-.707.293L5 7m2 10h10a2 2 0 002-2V7m-2 10H7a2 2 0 01-2-2V7m0 0h12m-6 4h.01" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="fixed bottom-0 left-0 right-0 flex justify-center space-x-[190px] p-6 bg-white shadow-lg">
                        <Link href="../sitrep" passHref>
                            <button className="w-[100px] h-[40px] bg-white border border-orange-500 font-bold text-black rounded-lg">
                                BACK
                            </button>
                        </Link>
                        <Link href="../cluster" passHref>
                            <button className="w-[100px] h-[40px] bg-orange-500 text-white font-bold rounded-lg">
                                NEXT
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
