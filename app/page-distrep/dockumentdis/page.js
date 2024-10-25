"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from 'next/link';

export default function Sitrep() {
    const router = useRouter();
    const { id } = useParams();
    const [dataItems, setDataItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [storedKorbanSiteId, setStoredKorbanSiteId] = useState(localStorage.getItem('mitra_dist_id') || null);
    const [formData, setFormData] = useState({
        id: '',
        distrep_dokumentasi: '',
        dok_dist_id: ''
    });

    useEffect(() => {
        if (storedKorbanSiteId) {
            setFormData((prevData) => ({
                ...prevData,
                dok_dist_id: storedKorbanSiteId,
            }));
        } else if (id) {
            localStorage.setItem('mitra_dist_id', id);
            setFormData((prevData) => ({
                ...prevData,
                dok_dist_id: id,
            }));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: formData.id,
                distrep_dokumentasi: formData.distrep_dokumentasi,
                dok_dist_id: storedKorbanSiteId,
            };

            const response = await fetch(
                formData.id ? "/api/updateDokDist" : "/api/createDokDist",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            setIsSubmit(true);
            const data = await response.json();

            if (response.ok) {
                setMessage("Data successfully submitted.");
                setFormData({
                    distrep_dokumentasi: '',
                    dok_dist_id: id,
                });
                setSelectedImage(null);
                setShowForm(false);
                setIsSubmit(false);
            } else {
                setMessage(`Error: ${data.message || "Submission failed"}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setSelectedImage(base64String);
                setFormData({ ...formData, distrep_dokumentasi: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        async function fetchData() {
            if (storedKorbanSiteId) {
                try {
                    const response = await fetch(`/api/getDokDist?dok_dist_id=${storedKorbanSiteId}`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const result = await response.json();
                    console.log(result, 'agus');
                    if (result.status) {
                        const fetchedData = result.data.map((item) => ({
                            id: item.id || "Data tidak ada",
                            dok_dist_id: item.dok_dist_id || "Data tidak ada",
                            base64_distrep_dokumentasi: item.base64_distrep_dokumentasi || "Data tidak ada" // Use the correct key
                        }));
                        setDataItems(fetchedData);
                    } else {
                        console.error("Data tidak tersedia");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        }
        fetchData();
    }, [storedKorbanSiteId, isSubmit]);

    const handleDelete = async (itemId) => {
        if (!itemId) return;
        try {
            const response = await fetch(`/api/deleteDokDist?id=${itemId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            setDataItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
            setMessage("Data berhasil dihapus.");
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            dok_dist_id: item.dok_dist_id,
            distrep_dokumentasi: item.distrep_dokumentasi
        });
        setShowForm(true);
    };

    const convertBase64ToImage = (base64) => {
        if (!base64) return '';
        if (base64.startsWith('data:image/')) {
            return base64; // Already has data URI format
        } else if (base64.startsWith('iVBORw0KGgo')) {
            return `data:image/png;base64,${base64}`; // PNG prefix
        } else if (base64.startsWith('/9j/')) {
            return `data:image/jpeg;base64,${base64}`; // JPEG prefix
        } else {
            console.warn('Format gambar tidak dikenali:', base64);
            return ''; // Unrecognized format
        }
    };

    return (
        <div className="flex flex-col items-center bg-white">
            <nav className="w-full bg-[#ff6b00] p-6 shadow-b-lg">
                <div className="flex mt-[10px] justify-center">
                    <p className="text-white font-bold text-[22px]">Dokumentasi</p>
                </div>
            </nav>
            <div className="w-[380px] max-w-md mt-4">
                <button
                    className="w-full h-[50px] bg-green-500 rounded-lg text-white font-bold flex items-center justify-center mb-4"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Tutup Data" : "Tambahkan Data"}
                </button>

                {showForm && (
                    <form className="mt-[10px] bg-white rounded-lg" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-[14px] font-bold text-gray-700">Image *</label>
                            <input
                                type="file"
                                name="distrep_dokumentasi"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                            />
                            {selectedImage && (
                                <div className="mt-4">
                                    <p className="text-gray-700">Pratinjau Gambar:</p>
                                    <img src={selectedImage} alt="Preview" className="w-full h-auto mt-2 rounded-md" />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <Link href="../sitrep" passHref>
                                <button className="w-[100px] h-[40px] bg-white border border-orange-500 font-bold text-black rounded-lg">
                                    RESET
                                </button>
                            </Link>
                            <button
                                type="submit"
                                className="bg-orange-500 text-white py-2 px-6 font-bold rounded"
                            >
                                {formData.id ? "UPDATE" : "SAVE"}
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-7 overflow-y-auto" ref={containerRef} style={{ height: '500px', paddingBottom: '80px' }}>
                    {dataItems.map((item, index) => (
                        <div key={index} className="p-4 mt-4 bg-orange-100 border border-orange-500 rounded-lg shadow-md">
                            <div className="flex justify-between">
                                <div className="w-1/2">
                                    {item.base64_distrep_dokumentasi ? (
                                        <img
                                            src={convertBase64ToImage(item.base64_distrep_dokumentasi)}
                                            alt="Dokumentasi Bencana Alam"
                                            className="w-full h-auto mt-2 rounded-md"
                                        />
                                    ) : (
                                        <p className="text-gray-800">No Image Available</p>
                                    )}
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
                    <Link href="../distrep" passHref>
                        <button className="w-[100px] h-[40px] bg-orange-500 text-white font-bold rounded-lg">
                            NEXT
                        </button>
                    </Link>
                </div>

                {message && (
                    <p className="mt-4 text-center text-green-500 font-bold">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
