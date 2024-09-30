"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Select from "react-select";

export default function Sitrep() {
    const [formData, setFormData] = useState([
        {
            date: "",
            eventType: "",
            eventName: "",
            pic: "",
            provinsi: "",
            kota: "",
            kecamatan: "",
            kelurahan: "",
            address: "",
        },
    ]);
    const [currentPage, setCurrentPage] = useState(0); // Track the current page
    const [message, setMessage] = useState("");
    const [isOnline, setIsOnline] = useState(true);
    const [drafts, setDrafts] = useState([]);
    const [publishedEvents, setPublishedEvents] = useState([]);

    const provinsiOptions = [
        { value: "provinsi1", label: "Provinsi 1" },
        { value: "provinsi2", label: "Provinsi 2" },
    ];

    const kotaOptions = [
        { value: "kota1", label: "Kota 1" },
        { value: "kota2", label: "Kota 2" },
    ];

    const kecamatanOptions = [
        { value: "kecamatan1", label: "Kecamatan 1" },
        { value: "kecamatan2", label: "Kecamatan 2" },
    ];

    const kelurahanOptions = [
        { value: "kelurahan1", label: "Kelurahan 1" },
        { value: "kelurahan2", label: "Kelurahan 2" },
    ];

    const handleInputChange = (index, field, value) => {
        const newFormData = [...formData];
        newFormData[index][field] = value;
        setFormData(newFormData);
    };

    const handleSelectChange = (index, field, value) => {
        const newFormData = [...formData];
        newFormData[index][field] = value;
        setFormData(newFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isOnline) {
            const updatedDrafts = [...drafts, ...formData];
            localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
            setDrafts(updatedDrafts);
            setMessage("Acara disimpan di Draft.");
        } else {
            const updatedDrafts = [...drafts, ...formData];
            localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
            setDrafts(updatedDrafts);
            setMessage("Koneksi offline. Acara disimpan di Draft.");
        }

        resetForm();
    };


    const handleSave = () => {
        const updatedDrafts = [...drafts, ...formData];
        localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
        setDrafts(updatedDrafts);
        setMessage("Acara disimpan di Draft!");
        resetForm();
    };

    const resetForm = () => {
        setFormData([
            {
                date: "",
                eventType: "",
                eventName: "",
                pic: "",
                provinsi: "",
                kota: "",
                kecamatan: "",
                kelurahan: "",
                address: "",
            },
        ]);
        setCurrentPage(0); // Reset to the first page after saving
    };

    const checkConnection = () => {
        setIsOnline(navigator.onLine);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsOnline(navigator.onLine);
            window.addEventListener("online", checkConnection);
            window.addEventListener("offline", checkConnection);

            const storedDrafts = localStorage.getItem("drafts");
            if (storedDrafts) {
                setDrafts(JSON.parse(storedDrafts));
            }

            return () => {
                window.removeEventListener("online", checkConnection);
                window.removeEventListener("offline", checkConnection);
            };
        }
    }, []);

    const nextPage = () => {
        if (currentPage < formData.length - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    // Custom styling for Select components
    const selectStyles = {
        control: (base) => ({
            ...base,
            padding: "5px",
            borderColor: "#30 41 59",
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
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <nav className="w-full bg-orange-400 p-4">
                <div className="flex justify-center">
                    <p className="text-white text-semibold text-[16px]">
                        DRAFT ENTRY REPORT
                    </p>
                </div>
            </nav>

            <div className="flex flex-col w-full max-w-full">
                {message && <p className="mt-4 text-red-500">{message}</p>}

                <form
                    className="bg-white p-6 rounded shadow-md w-full"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-4">
                        <p className="mb-2">Tanggal</p>
                        <input
                            type="date"
                            value={formData[currentPage].date}
                            onChange={(e) =>
                                handleInputChange(currentPage, "date", e.target.value)
                            }
                            className="border rounded w-full py-2 px-3 mb-2"
                            required
                        />
                        <p className="mb-2">Jenis Kejadian</p>
                        <input
                            type="text"
                            placeholder="Jenis Kejadian"
                            value={formData[currentPage].eventType}
                            onChange={(e) =>
                                handleInputChange(currentPage, "eventType", e.target.value)
                            }
                            className="border rounded w-full py-2 px-3 mb-2"
                            required
                        />
                        <p className="mb-2">Nama Kejadian</p>
                        <input
                            type="text"
                            placeholder="Nama Kejadian"
                            value={formData[currentPage].eventName}
                            onChange={(e) =>
                                handleInputChange(currentPage, "eventName", e.target.value)
                            }
                            className="border rounded w-full py-2 px-3 mb-2"
                            required
                        />
                        <p className="mb-2">PIC Lapangan</p>
                        <input
                            type="text"
                            placeholder="PIC Lapangan"
                            value={formData[currentPage].pic}
                            onChange={(e) =>
                                handleInputChange(currentPage, "pic", e.target.value)
                            }
                            className="border rounded w-full py-2 px-3 mb-2"
                            required
                        />

                        <p className="mb-2">Provinsi*</p>
                        <Select
                            name="provinsi"
                            value={provinsiOptions.find(
                                (option) => option.value === formData[currentPage].provinsi
                            )}
                            onChange={(option) =>
                                handleSelectChange(currentPage, "provinsi", option.value)
                            }
                            options={provinsiOptions}
                            styles={selectStyles}
                            className=" mb-2"
                            placeholder="Pilih Provinsi"
                        />
                        <p className="mb-2">Kota*</p>
                        <Select
                            name="kota"
                            value={kotaOptions.find(
                                (option) => option.value === formData[currentPage].kota
                            )}
                            onChange={(option) =>
                                handleSelectChange(currentPage, "kota", option.value)
                            }
                            options={kotaOptions}
                            styles={selectStyles}
                            className=" mb-2"
                            placeholder="Pilih Kota"
                        />

                        <p className="mb-2">Kecamatan*</p>
                        <Select
                            name="kecamatan"
                            value={kecamatanOptions.find(
                                (option) => option.value === formData[currentPage].kecamatan
                            )}
                            onChange={(option) =>
                                handleSelectChange(currentPage, "kecamatan", option.value)
                            }
                            options={kecamatanOptions}
                            styles={selectStyles}
                            className=" mb-2"
                            placeholder="Pilih Kecamatan"
                        />

                        <p className="mb-2">Kelurahan*</p>
                        <Select
                            name="kelurahan"
                            value={kelurahanOptions.find(
                                (option) => option.value === formData[currentPage].kelurahan
                            )}
                            onChange={(option) =>
                                handleSelectChange(currentPage, "kelurahan", option.value)
                            }
                            options={kelurahanOptions}
                            styles={selectStyles}
                            className=" mb-2"
                            placeholder="Pilih Kelurahan"
                        />

                        <p className="mb-2">Alamat</p>
                        <input
                            type="text"
                            placeholder="Alamat"
                            value={formData[currentPage].address}
                            onChange={(e) =>
                                handleInputChange(currentPage, "address", e.target.value)
                            }
                            className="border rounded w-full py-2 px-3 mb-2"
                        />
                    </div>

                    <div className="flex justify-between">
                        <Link href="/sitrep" passHref>
                            <button className="w-[100px] h-[40px] bg-white font-bold text-black border border-orange-300 rounded-lg">
                                BACK
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className={`w-[100px] h-[40px] bg-[#ff6b00] font-bold text-white rounded-l`}
                        >
                            SAVE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}