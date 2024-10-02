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
    const [provinsiOptions, setProvinsiOptions] = useState([]); // State for province options
    const [kotaOptions, setKotaOptions] = useState([]); // State for city options
    const [kecamatanOptions, setKecamatanOptions] = useState([]); // State for sub-district options
    const [kelurahanOptions, setKelurahanOptions] = useState([]); // State for village options

    useEffect(() => {
        const fetchProvinsi = async () => {
            try {
                const response = await fetch("/api/getProvinsi/");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();

                // Ensure data exists and has a 'data' property
                if (data && data.status && data.data) {
                    const options = data.data.map((prov) => ({
                        value: prov.id, // Use the appropriate property for value
                        label: prov.prov, // Use 'prov' for the label
                    }));
                    setProvinsiOptions(options);
                } else {
                    console.error("Invalid data structure:", data);
                }
            } catch (error) {
                console.error("Failed to fetch provinces:", error);
            }
        };

        fetchProvinsi();
    }, []);

    useEffect(() => {
        const fetchKota = async () => {
            try {
                const response = await fetch("/api/getKota/");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();

                // Ensure data exists and has a 'data' property
                if (data && data.status && data.data) {
                    const options = data.data.map((kota) => ({
                        value: kota.id, // Use the appropriate property for value
                        label: kota.city, // Use 'city' for the label
                    }));
                    setKotaOptions(options);
                } else {
                    console.error("Invalid data structure:", data);
                }
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            }
        };

        fetchKota();
    }, []);

    useEffect(() => {
        const fetchKecamatan = async () => {
            try {
                const response = await fetch("/api/getKecamatan/");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();

                // Ensure data exists and has a 'data' property
                if (data && data.status && data.data) {
                    const options = data.data.map((kecamatan) => ({
                        value: kecamatan.id, // Use the appropriate property for value
                        label: kecamatan.district, // Use 'district' for the label
                    }));
                    setKecamatanOptions(options);
                } else {
                    console.error("Invalid data structure:", data);
                }
            } catch (error) {
                console.error("Failed to fetch sub-districts:", error);
            }
        };

        fetchKecamatan();
    }, []);

    useEffect(() => {
        const fetchKelurahan = async () => {
            try {
                const response = await fetch("/api/getKelurahan/");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();

                // Ensure data exists and has a 'data' property
                if (data && data.status && data.data) {
                    const options = data.data.map((kelurahan) => ({
                        value: kelurahan.id, // Use the appropriate property for value
                        label: kelurahan.subdistrict, // Use 'kelurahan' for the label
                    }));
                    setKelurahanOptions(options);
                } else {
                    console.error("Invalid data structure:", data);
                }
            } catch (error) {
                console.error("Failed to fetch villages:", error);
            }
        };

        fetchKelurahan();
    }, []);



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
        if (activeMenu === "publish" && isOnline) {
            setPublishedEvents((prev) => [...prev, ...formData]);
            setMessage("Acara dipublikasikan!");
            console.log("Acara yang dipublikasikan:", formData);
        } else if (activeMenu === "draft") {
            const updatedDrafts = [...drafts, ...formData];
            localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
            setDrafts(updatedDrafts);
            setMessage("Acara disimpan di Draft!");
        } else {
            setMessage("Koneksi offline. Anda tidak dapat mempublikasikan.");
        }
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

    const checkConnection = () => {
        setIsOnline(navigator.onLine);
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
                        PUBLISH ENTRY REPORT
                    </p>
                </div>
            </nav>
            <div className="flex flex-col w-full max-w-full">
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
                        <Select name="provinsi"
                            value={provinsiOptions.find(
                                (option) => option.value === formData[currentPage].provinsi
                            )}
                            onChange={(option) =>
                                handleSelectChange(currentPage, "provinsi", option.value)
                            }
                            options={provinsiOptions}
                            styles={selectStyles}
                            className="mb-2"
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
                            className="mb-2"
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
                            className="mb-2"
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
                            className="mb-2"
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

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-orange-500 text-white py-2 px-4 rounded"
                        >
                            Simpan
                        </button>
                    </div>

                    {message && (
                        <p className="mt-4 text-center text-green-500">{message}</p>
                    )}
                </form>
            </div>
        </div>
    );
}