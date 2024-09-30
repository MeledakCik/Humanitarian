"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function Draft() {
    const [selectAllDraft, setSelectAllDraft] = useState(false);
    const [checkedItemsDraft, setCheckedItemsDraft] = useState([]);
    const [draftsItems, setDraftsItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [editItem, setEditItem] = useState({
        spk: "",
        date: "",
        jenisKejadian: "",
        eventName: "",
        namaPIC: "",
        jumlahPenerima: "",
        jumlahRelawan: "",
        provinsi: "",
        kota: "",
        kecamatan: "",
        kelurahan: "",
        address: "",
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Load drafts from local storage when component mounts
    useEffect(() => {
        const storedDrafts = localStorage.getItem('draftsdistrep');
        if (storedDrafts) {
            setDraftsItems(JSON.parse(storedDrafts));
        }
    }, []);

    const filteredItemsDraft = draftsItems.filter((item) => {
        return (
            (item.spk || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.date || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.jenisKejadian || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.eventName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.namaPIC || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.jumlahPenerima || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.jumlahRelawan || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.provinsi || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.kota || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.kecamatan || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.kelurahan || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.address || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    });


    const handleSelectAllDraftChange = () => {
        const newSelectAll = !selectAllDraft;
        setSelectAllDraft(newSelectAll);
        setCheckedItemsDraft(Array(filteredItemsDraft.length).fill(newSelectAll));
    };

    const handleItemChangeDraft = (index) => {
        const newCheckedItems = [...checkedItemsDraft];
        newCheckedItems[index] = !newCheckedItems[index];
        setCheckedItemsDraft(newCheckedItems);
        setSelectAllDraft(newCheckedItems.every(item => item));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEditClick = (index) => {
        setEditIndex(index);
        setEditItem(draftsItems[index]);
        setIsEditing(true);
    };

    const handleDeleteClick = (index) => {
        setItemToDelete(index);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        const updatedDrafts = draftsItems.filter((_, i) => i !== itemToDelete);
        setDraftsItems(updatedDrafts);
        localStorage.setItem('draftsdistrep', JSON.stringify(updatedDrafts));
        setShowDeleteConfirm(false);
        setItemToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
    };

    const handleSaveEdit = () => {
        const updatedDrafts = [...draftsItems];
        updatedDrafts[editIndex] = editItem;
        setDraftsItems(updatedDrafts);
        localStorage.setItem('draftsdistrep', JSON.stringify(updatedDrafts));
        setIsEditing(false);
        setEditIndex(-1);
        setEditItem({
            spk: "",
            date: "",
            jenisKejadian: "",
            eventName: "",
            namaPIC: "",
            jumlahPenerima: "",
            jumlahRelawan: "",
            provinsi: "",
            kota: "",
            kecamatan: "",
            kelurahan: "",
            address: "",
        }); // Reset edit item
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditItem({ ...editItem, [name]: value });
    };

    return (
        <>
            <Link href="./createdistrepdraft">
                <button className="w-[130px] h-[40px] bg-[#8bff7f] rounded-lg text-[13px] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[24px] h-[24px] mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Draft Report</span>
                </button>
            </Link>

            {/* Search bar */}
            <div className="flex flex-col mb-4 mt-5">
                <div className="flex items-center border border-orange-500 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[24px] h-[24px] ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 0l4 4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
                    </svg>
                    <input type="text" placeholder="Search..." className="flex-grow p-3 rounded-lg focus:outline-none" value={searchTerm} onChange={handleSearchChange} />
                </div>
            </div>

            {/* Checkbox "Select All" */}
            <div className="bg-white min-h-full">
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        className="mr-2 w-[20px] h-[20px]"
                        checked={selectAllDraft}
                        onChange={handleSelectAllDraftChange}
                    />
                    <label className="text-gray-700">Select All</label>
                </div>

                {/* Display filtered drafts */}
                <div className="relative w-full min-h-full">
                    {filteredItemsDraft.length === 0 ? (
                        <div className="text-gray-500">
                            {searchTerm ? `"${searchTerm}" not found` : "No draft items available"}
                        </div>
                    ) : (
                        filteredItemsDraft.map((item, index) => (
                            <div key={index} className="shadow-md mb-4 rounded-[20px]">
                                <div className="shadow-lg p-4 rounded-[20px] flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-4 w-[20px] h-[20px] mx-auto"
                                        checked={checkedItemsDraft[index]}
                                        onChange={() => handleItemChangeDraft(index)}
                                    />
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold">{item.eventName}</p>
                                            <p className="text-gray-600">{item.date}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-gray-700">{item.jenisKejadian}</p>
                                            <p className="text-gray-700">{item.namaPIC}</p>
                                        </div>
                                    </div>
                                    <div className="border-l border-orange-500 h-[50px] mx-2"></div>
                                    <button className="text-gray-500 hover:text-gray-800" onClick={() => handleEditClick(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[30px] h-[30px]">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.862 3.487a2.121 2.121 0 013.004 0l1.586 1.586a2.121 2.121 0 010 3.004l-1.586 1.586-4.588-4.588 1.586-1.586zM2 17.25V22h4.75l9.74-9.739-4.588-4.588L2 17.25z" />
                                        </svg>
                                    </button>
                                    <div className="border-l border-orange-500 h-[50px] mx-2"></div>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteClick(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[35px] h-[35px]">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Edit Modal */}
            {/* Edit Modal */}
            {isEditing && (
                <div className="flex flex-col fixed inset-0 bg-black bg-opacity-50 items-center">
                    <nav className="w-full bg-[#ff6b00] p-6 shadow-b-lg">
                        <div className="flex mt-[10px] justify-center">
                            <p className="text-white font-bold text-[22px]">Distribution Report Edit Draft</p>
                        </div>
                    </nav>
                    <div className="bg-white p-5 w-full min-h-full overflow-hidden">
                        <div className="overflow-y-auto max-h-[70vh]"> {/* Scrollable container */}
                            <label className="font-semibold mb-1">No Spk*</label>
                            <input
                                type="number"
                                name="spk"
                                placeholder="No Spk"
                                value={editItem.spk}
                                onChange={handleInputChange}
                                className="mb-4 border rounded p-2 mt-2 text-gray-400 w-full"
                            />

                            <label className="font-semibold mb-1">Jenis Kejadian*</label>
                            <input
                                type="text"
                                name="jenisKejadian"
                                placeholder="Jenis Kejadian"
                                value={editItem.jenisKejadian}
                                onChange={handleInputChange}
                                className="mb-4 border rounded p-2 mt-2 text-gray-400 w-full"
                            />

                            <label className="font-semibold mb-1">Tanggal*</label>
                            <input
                                type="date"
                                name="date"
                                placeholder="Tanggal"
                                value={editItem.date}
                                onChange={handleInputChange}
                                className="mb-4 border rounded p-2 mt-2 text-gray-400 w-full"
                            />

                            <label className="font-semibold mb-1">Nama PIC*</label>
                            <input
                                type="text"
                                name="namaPIC"
                                placeholder="Nama PIC"
                                value={editItem.namaPIC}
                                onChange={handleInputChange}
                                className="mb-4 border rounded p-2 mt-2 text-gray-400 w-full"
                            />

                            <label className="font-semibold mb-1">Jumlah Penerima*</label>
                            <input
                                type="number"
                                name="jumlahPenerima"
                                placeholder="Jumlah Penerima"
                                value={editItem.jumlahPenerima}
                                onChange={handleInputChange}
                                className="mb-4 border rounded p-2 mt-2 text-gray-400 w-full"
                            />

                            <label className="font-semibold mb-1">Jumlah Relawan*</label>
                            <input
                                type="number"
                                name="jumlahRelawan"
                                placeholder="Jumlah Relawan"
                                value={editItem.jumlahRelawan}
                                onChange={handleInputChange}
                                className="mb-4 border rounded p-2 mt-2 text-gray-400 w-full"
                            />

                            <label className="font-semibold mb-1">Provinsi*</label>
                            <input
                                type="text"
                                name="provinsi"
                                placeholder="Provinsi"
                                value={editItem.provinsi}
                                onChange={handleInputChange}
                                className="mb-4 border rounded p-2 mt-2 text-gray-400 w-full"
                            />

                            <label className="font-semibold mb-1">Kota*</label>
                            <input
                                type="text"
                                name="kota"
                                placeholder="Kota"
                                value={editItem.kota}
                                onChange={handleInputChange}
                                className="mb-4 border rounded p-2 mt-2 text-gray-400 w-full"
                            />

                            <label className="font-semibold mb-1">Kecamatan*</label>
                            <input
                                type="text"
                                name="kecamatan"
                                placeholder="Kecamatan"
                                value={editItem.kecamatan}
                                onChange={handleInputChange}
                                className="mb-4 border rounded p-2 mt-2 text-gray-400 w-full"
                            />

                            <label className="font-semibold mb-1">Kelurahan*</label>
                            <input
                                type="text"
                                name="kelurahan"
                                placeholder="Kelurahan"
                                value={editItem.kelurahan}
                                onChange={handleInputChange}
                                className="mb-4 border rounded p-2 mt-2 text-gray-400 w-full"
                            />

                            <label className="font-semibold mb-1">Alamat*</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Alamat"
                                value={editItem.address}
                                onChange={handleInputChange}
                                className="mb-4 border rounded p-2 mt-2 text-gray-400 w-full"
                            />

                            <div className="flex justify-end">
                                <button onClick={handleSaveEdit} className="bg-blue-500 text-white rounded px-4 py-2">Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-5 w-11/12 md:w-1/3">
                        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this draft?</p>
                        <div className="flex justify-end mt-4">
                            <button className="mr-2 bg-gray-300 rounded px-4 py-2" onClick={cancelDelete}>Cancel</button>
                            <button className="bg-red-500 text-white rounded px-4 py-2" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
