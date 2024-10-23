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
    const [isSubmit, setIsSubmit] = useState(false)
    const [allData, setAllData] = useState([]); // All data fetched
    const [currentIndex, setCurrentIndex] = useState(0); // Current index for pagination
    const containerRef = useRef(null);
    const [storedKorbanSiteId, setStoredKorbanSiteId] = useState(localStorage.getItem('dampak_site_id') || null);
    const [formData, setFormData] = useState({
        id: '',
        jumlah: '',
        jeniskorbanjiwa: '',
        korban_site_id: '',  // Initially empty, to be filled from localStorage
    });

    // Fetch korban_site_id from localStorage
    useEffect(() => {
        if (storedKorbanSiteId) {
            setFormData((prevData) => ({
                ...prevData,
                korban_site_id: storedKorbanSiteId,
            }));
        } else if (id) {
            // Store the current id in localStorage for future use
            localStorage.setItem('dampak_site_id', id);
            setFormData((prevData) => ({
                ...prevData,
                korban_site_id: id,
            }));
        }
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: formData.id,
                jumlah: formData.jumlah,
                jenis_korban_jiwa: formData.jeniskorbanjiwa,
                korban_site_id: storedKorbanSiteId,
            };

            const response = await fetch(
                formData.id ? "/api/updateJumlahKorban" : "/api/createJumlahKorban",
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
                    jeniskorbanjiwa: '',
                    korban_site_id: '',
                });
                setShowForm(false);
                router.push(`../pengungsi`);
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
            if (storedKorbanSiteId) {
                try {
                    const response = await fetch(`/api/getJumlah_korban?korban_site_id=${storedKorbanSiteId}`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const result = await response.json();
                    if (result.status) {
                        const fetchedData = result.data.map((item) => ({
                            id: item.id || "Data tidak ada",
                            korban_site_id: item.korban_site_id || "Data tidak ada",
                            jumlah: item.jumlah || "Data tidak ada",
                            jeniskorbanjiwa: item.jenis_korban_jiwa || "Data tidak ada",
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
            const response = await fetch(`/api/deleteJumlahKorban?id=${itemId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: itemId }),
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
            korban_site_id: item.korban_site_id,
            jeniskorbanjiwa: item.jeniskorbanjiwa,
            jumlah: item.jumlah,
        });
        setShowForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        const newItems = allData.slice(currentIndex, currentIndex + 5);
        setDataItems(prevItems => [...prevItems, ...newItems]);
    }, [allData, currentIndex]);

    // Handle scroll event
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) { // Load more when scrolled near the bottom
            if (currentIndex + 5 < allData.length) { // Check if more data is available
                setCurrentIndex(prevIndex => prevIndex + 5);
            }
        }
    };

    // Attach scroll event listener
    useEffect(() => {
        const currentContainer = containerRef.current;
        if (currentContainer) {
            currentContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (currentContainer) {
                currentContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [currentIndex]);

    return (
        <div className="flex flex-col items-center bg-white">
            <nav className="w-full bg-[#ff6b00] p-6 shadow-b-lg">
                <div className="flex mt-[10px] justify-center">
                    <p className="text-white font-bold text-[22px]">Jumlah Korban</p>
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
                            <label className="block text-[14px] font-bold text-gray-700">Jumlah Korban Site ID*</label>
                            <input
                                type="text"
                                name="korban_site_id"
                                value={formData.korban_site_id}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-[14px] font-bold text-gray-700">Jenis Korban Jiwa*</label>
                            <input
                                type="text"
                                name="jeniskorbanjiwa"
                                value={formData.jeniskorbanjiwa}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-[14px] font-bold text-gray-700">Jumlah*</label>
                            <input
                                type="number"
                                name="jumlah"
                                value={formData.jumlah}
                                onChange={handleInputChange}
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
                    </form>
                )}

                <div className="mt-7 overflow-y-auto" ref={containerRef} style={{ height: '500px', paddingBottom: '80px' }}> {/* Added padding for the fixed button */}
                    {dataItems.map((item, index) => (
                        <div key={index} className="p-4 mt-4 bg-orange-100 border border-orange-500 rounded-lg shadow-md">
                            <div className="flex justify-between">
                                <div className="w-1/2">
                                    <p className="font-bold text-gray-700 text-md">Jenis Korban Jiwa</p>
                                    <p className="text-gray-800">{item.jeniskorbanjiwa}</p>
                                </div>
                                <div className="w-1/2">
                                    <p className="font-bold text-gray-700 text-md">Jumlah</p>
                                    <p className="text-gray-800">{item.jumlah}</p>
                                </div>
                                <div className="flex">
                                    <button className="mr-1 text-blue-500 hover:text-blue-700" onClick={() => handleEdit(item)}>
                                        Edit
                                    </button>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)}>
                                        Hapus
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
                    <Link href="../nextPage" passHref>
                        <button className="w-[100px] h-[40px] bg-orange-500 text-white font-bold rounded-lg">
                            NEXT
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
