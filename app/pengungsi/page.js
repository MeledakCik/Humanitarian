"use client";
import { useState, useEffect,useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from 'next/link';

export default function Sitrep() {
    const router = useRouter();
    const { id } = useParams();
    const [dataItems, setDataItems] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false)
    const [showForm, setShowForm] = useState(false);
    const [allData, setAllData] = useState([]); // All data fetched
    const [currentIndex, setCurrentIndex] = useState(0); // Current index for pagination
    const containerRef = useRef(null);
    const [storedKorbanSiteId, setStoredKorbanSiteId] = useState(localStorage.getItem('dampak_site_id') || null);
    const [message, setMessage] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        jumlah: '',
        lokasipengungsian: '',
        pengungsi_site_id: ''
    });

    useEffect(() => {
        if (storedKorbanSiteId) {
            setFormData((prevData) => ({
                ...prevData,
                pengungsi_site_id: storedKorbanSiteId,
            }));
        } else if (id) {
            // Store the current id in localStorage for future use
            localStorage.setItem('dampak_site_id', id);
            setFormData((prevData) => ({
                ...prevData,
                pengungsi_site_id: id,
            }));
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    useEffect(() => {
        if (id) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                pengungsi_site_id: id,
            }));
        }
    }, [id]);
    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            jumlah: item.jumlah,
            lokasipengungsian: item.lokasipengungsian,
            pengungsi_site_id: item.pengungsi_site_id,
        });
        setShowForm(true);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`/api/getPengungsian/?pengungsi_site_id=${storedKorbanSiteId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                if (result.status) {
                    const fetchedData = result.data.map((item) => ({
                        id: item.id || "Data tidak ada",
                        pengungsi_site_id: item.pengungsi_site_id || "Data tidak ada",
                        jumlah: item.jumlah || "Data tidak ada",
                        lokasipengungsian: item.lokasi_pengungsian || "Data tidak ada"
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
    }, [storedKorbanSiteId, isSubmit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: formData.id,
                jumlah: formData.jumlah,
                lokasi_pengungsian: formData.lokasipengungsian,
                pengungsi_site_id: storedKorbanSiteId,
            };

            const response = await fetch(
                formData.id ? "/api/updatePengungsi" : "/api/createPengungsi",
                {
                    method: formData.id ? "POST" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            setIsSubmit(true)
            const data = await response.json();
            if (response.ok) {
                setMessage("Data successfully submitted.");
                setFormData({
                    jumlah: '',
                    lokasipengungsian: '',
                    pengungsi_site_id: id
                });
                setShowForm(false);
                // router.push(`../kebutuhanmendesak`);
                setIsSubmit(false)

            } else {
                setMessage(`Error: ${data.message || "Submission failed"}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleDelete = async (itemId) => {
        if (!itemId) {
            console.error("ID tidak ditemukan:", itemId);
            return;
        }
        try {
            const response = await fetch(`/api/deletePengungsi?id=${itemId}`, {
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
        <>
            <div className="flex flex-col items-center bg-white">
                <nav className="w-full bg-[#ff6b00] p-6 shadow-b-lg">
                    <div className="flex mt-[10px] justify-center">
                        <p className="text-white font-bold text-[22px]">Pengungsi</p>
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
                        <div className="mt-[10px] bg-white rounded-lg" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-[14px] font-bold text-gray-700">Lokasi Pengungsian*</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="lokasipengungsian"
                                        value={formData.lokasipengungsian}
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
                </div>

                <div className="mt-7 space-y-4 w-[380px] max-w-md overflow-y-auto" ref={containerRef} style={{ height: '500px', paddingBottom: '80px' }}> {/* Added padding for the fixed button */}
                    {dataItems.map((item, index) => (
                        <div key={index} className="p-4 mt-4 bg-orange-100 border border-orange-500 rounded-lg shadow-md">
                            <div className="flex justify-between">
                                <div className="w-1/2">
                                    <p className="font-bold text-gray-700 text-md">Lokasi Pengungsian</p>
                                    <p className="text-gray-800">{item.lokasipengungsian}</p>
                                </div>
                                <div className="w-1/2">
                                    <p className="font-bold text-gray-700 text-md">Jumlah</p>
                                    <p className="text-gray-800">{item.jumlah}</p>
                                </div>
                                <div className="flex">
                                    <button className="mr-1 text-blue-500 hover:text-blue-700" onClick={() => handleEdit(item)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-4M16 3h-4v2h4V3z" />
                                        </svg>
                                    </button>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M10 3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="fixed bottom-0 left-0 right-0 flex justify-center space-x-[190px] p-6 bg-white shadow-lg">
                    <Link href="../sitrep" passHref>
                        <button className="w-[100px] h-[40px] bg-white border border-orange-500 font-bold text-black rounded-lg">
                            BACK
                        </button>
                    </Link>
                    <Link href="../kebutuhanmendesak" passHref>
                        <button className="w-[100px] h-[40px] bg-orange-500 text-white font-bold rounded-lg">
                            NEXT
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}
