"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function Publish() {
    const [filter, setFilter] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // State untuk data yang difilter
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/getDistrep`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                if (result.statusCode === 200) {
                    const dataFetched = result.data.data.map((item, index) => ({
                        id: item.id || index,
                        nama_kejadian: item.nama_kejadian,
                        tanggal_penyaluran: item.tanggal_penyaluran,
                        city: item.city
                    }));
                    
                    setData(dataFetched);
                    setFilteredData(dataFetched);
                    setNotFound(dataFetched.length === 0);
                } else {
                    console.error("Data tidak tersedia");
                    setNotFound(true);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
                setNotFound(true);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const search = filter.toLowerCase();
        const filtered = data.filter(item => 
            (item.nama_kejadian?.toLowerCase() || "").includes(search) || 
            (item.city?.toLowerCase() || "").includes(search)
        );
        setFilteredData(filtered);
        setNotFound(filtered.length === 0);
    }, [filter, data]);
    

    return (
        <>
            <div className="w-full flex items-center justify-between mb-4">
                <Link href="./createdistreppublish">
                    <button className="w-[130px] h-[40px] bg-[#8bff7f] rounded-lg text-[13px] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[24px] h-[24px] mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Entry Report</span>
                    </button>
                </Link>
            </div>

            <div className="flex flex-col mb-4 mt-5">
                <div className="flex items-center border border-orange-500 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[24px] h-[24px] ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 0l4 4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
                    </svg>
                    <input type="text" placeholder="Search by event or city..." className="flex-grow p-3 rounded-lg focus:outline-none" value={filter}
                        onChange={(e) => setFilter(e.target.value)} />
                </div>
            </div>

            <div className="bg-white min-h-full">
                <div className="relative w-full min-h-full">
                    {loading ? (
                        <div className='w-full min-w-full h-full min-h-full'>
                            <p className='mt-2 text-center text-gray-500'>Loading data...</p>
                        </div>
                    ) : notFound ? (
                        <div className='w-full min-w-full h-full min-h-full p-8'>
                            <img src="/notfound.png" alt="Data tidak ditemukan" className="mx-auto" />
                            <p className='flex text-[20px] font-semibold text-gray-400 justify-center'>Data Tidak Ditemukan</p>
                        </div>
                    ) : (
                        filteredData.map((item) => (
                            <div key={item.id} className="shadow-md mb-4 rounded-[20px]">
                                <div className="shadow-lg p-4 rounded-[20px] flex items-center">
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold">{item.nama_kejadian || "N/A"}</p>
                                            <p className="text-right">{item.tanggal_penyaluran || "N/A"}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="mt-2 text-gray-700">{item.city || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="border-l border-orange-500 h-[50px] mx-2"></div>
                                    <button className="text-gray-500 hover:text-gray-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[35px] h-[35px]">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.862 3.487a2.121 2.121 0 013.004 0l1.586 1.586a2.121 2.121 0 010 3.004l-1.586 1.586-4.588-4.588 1.586-1.586zM2 17.25V22h4.75l9.74-9.739-4.588-4.588L2 17.25z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}