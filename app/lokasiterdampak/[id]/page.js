"use client";
import Select from 'react-select';
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from 'next/link';

export default function Sitrep() {
    const router = useRouter();
    const { id } = useParams();
    const [dataItems, setDataItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");
    const [kecamatanOptions, setKecamatanOptions] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        jumlah: '',
        kecamatan: '',
        lokasi_site_id: id,
    });

    // useEffect(() => {
    //     async function fetchKecamatanOptions() {
    //         try {
    //             const response = await fetch(`api/getKecamatan?city_id=` + city_id);
    //             if (response.ok) {
    //                 const result = await response.json();
    //                 const options = result.data.map((kecamatan) => ({
    //                     value: kecamatan.id,
    //                     label: kecamatan.kec_id,
    //                 }));
    //                 setKecamatanOptions(options);
    //             } else {
    //                 console.error("Failed to fetch kecamatan data");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching kecamatan data:", error);
    //         }
    //     }

    //     fetchKecamatanOptions();
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                kecamatan: formData.kecamatan,
                jumlah: formData.jumlah,
                lokasi_site_id: id,
            };

            const response = await fetch("/api/createLokasiTerdampak/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Data berhasil disimpan.");
                router.push(`../jumlahkorban/${id}`);
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
                const response = await fetch(`/api/getLokasi_terdampak?lokasi_site_id=${id}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                if (result.status) {
                    const fetchedData = result.data.map((item) => ({
                        id: item.id || "Data tidak ada",
                        lokasi_site_id: item.lokasi_site_id || "Data tidak ada",
                        jumlah: item.jumlah || "Data tidak ada",
                        kecamatan: item.kecamatan || "Data tidak ada"
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
        const intervalId = setInterval(fetchData, 4000);
        return () => clearInterval(intervalId);
    }, [id]);


    const handleDelete = async (itemId) => {
        if (!itemId) {
            console.error("ID tidak ditemukan:", itemId);
            return;
        }
        try {
            const response = await fetch(`/api/deleteLokasiTerdampak?id=${itemId}`, {
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

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            lokasi_site_id: id,
        }));
    }, [id]);

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
                    {showForm ? "Tutup Data" : "Tambahkan Data"}
                </button>

                {showForm && (
                    <form className="mt-[10px] bg-white rounded-lg" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-[14px] font-bold text-gray-700">Dampak Site Id</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="dampak_site_id"
                                    value={formData.lokasi_site_id}
                                    className="mt-1 block w-full p-2 border border-orange-500 rounded-md focus:outline-none"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-[14px] font-bold text-gray-700">Jumlah*</label>
                            <input
                                type="number"
                                name="jumlah"
                                value={formData.jumlah}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-2 border border-orange-500 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-[14px] font-bold text-gray-700">Kecamatan*</label>
                            <Select
                                name="kecamatan"
                                value={formData.kecamatan}
                                onChange={handleSelectChange}
                                options={kecamatanOptions}
                                placeholder="Pilih Kecamatan"
                            />
                        </div>

                        <div className="flex justify-between mt-[50px]">
                            <Link href="../dampaksarpras">
                                <button className="w-[100px] h-[40px] bg-white border border-orange-500 font-bold text-black rounded-lg">
                                    BACK
                                </button>
                            </Link>
                            <button
                                type="submit"
                                className="bg-orange-500 text-white py-2 px-6 font-bold rounded"
                            >
                                SAVE
                            </button>
                            <button
                                className="w-[100px] h-[40px] bg-orange-500 text-white font-bold rounded-lg"
                            >
                                NEXT
                            </button>
                        </div>
                    </form>
                )}
                <div className="mt-6 space-y-4 w-[380px] max-w-md">
                    {dataItems.map((item, index) => (
                        <div key={index} className="p-4 bg-orange-100 border border-orange-500 rounded-lg shadow-md">
                            <div className="flex justify-between">
                                <div className="w-1/2">
                                    <p className="font-bold text-gray-700 text-md">Kecamatan</p>
                                    <p className="text-gray-800">{item.kecamatan}</p>
                                </div>
                                <div className="w-1/2">
                                    <p className="font-bold text-gray-700 text-md">Jumlah</p>
                                    <p className="text-gray-800">{item.jumlah}</p>
                                </div>
                                <div className="flex">
                                    <button className="mr-1 text-blue-500 hover:text-blue-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-4M16 3h-4v2h4V3z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)}>
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
    );
}
