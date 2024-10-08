"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Link from "next/link";
import Select from "react-select";

export default function Sitrep() {
    const router = useRouter();
    const [formData, setFormData] = useState([
        {
            date: "",
            jenis_kejadian: "",
            eventName: "",
            pic: "",
            provinsi: "",
            kota: "",
            kecamatan: "",
            kelurahan: "",
            address: "",
        },
    ]);
    const [currentPage, setCurrentPage] = useState(0);
    const [dataItems, setDataItems] = useState([]);
    const [message, setMessage] = useState("");
    const [provinsiOptions, setProvinsiOptions] = useState([]);
    const [kotaOptions, setKotaOptions] = useState([]);
    const [kecamatanOptions, setKecamatanOptions] = useState([]);
    const [kelurahanOptions, setKelurahanOptions] = useState([]);
    const [jenis_kejadianOptions, setJenis_kejadianOptions] = useState([]);
    const [pic_lapanganOptions, setPic_lapanganOptions] = useState([]);
    
    useEffect(() => {
        const fetchJenis_kejadian = async () => {
            try {
                const response = await fetch("/api/getJenis_kejadian/");
                if (!response.ok) throw new Error("Failed to fetch provinces");
                const data = await response.json();
                if (data && data.status && data.data) {
                    const options = data.data.map((jenis_kejadian) => ({
                        value: jenis_kejadian.id,
                        label: jenis_kejadian.jenis_kejadian,
                    }));
                    setJenis_kejadianOptions(options);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchJenis_kejadian();
    }, []);


    useEffect(() => {
        const fetchPic_lapangan = async () => {
            try {
                const response = await fetch("/api/getPic_lapangan/");
                if (!response.ok) throw new Error("Failed to fetch provinces");
                const data = await response.json();
                if (data && data.status && data.data) {
                    const options = data.data.map((pic_lapangan) => ({
                        value: pic_lapangan.id,
                        label: pic_lapangan.fullname,
                    }));
                    setPic_lapanganOptions(options);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchPic_lapangan();
    }, []);


    useEffect(() => {
        const fetchProvinsi = async () => {
            try {
                const response = await fetch("/api/getProvinsi/");
                if (!response.ok) throw new Error("Failed to fetch provinces");
                const data = await response.json();
                if (data && data.status && data.data) {
                    const options = data.data.map((prov) => ({
                        value: prov.id,
                        label: prov.prov,
                    }));
                    setProvinsiOptions(options);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchProvinsi();
    }, []);

    // Fetch Kota berdasarkan Provinsi yang dipilih
    useEffect(() => {
        console.log("Provinsi changed:", formData[currentPage]?.provinsi);

        if (formData[currentPage]?.provinsi) {
            const fetchKota = async () => {
                try {
                    const response = await fetch(`/api/getKota?province_id=${formData[currentPage].provinsi}`);
                    if (!response.ok) throw new Error("Failed to fetch cities");

                    const data = await response.json();
                    console.log("Data yang diterima dari API:", data);

                    // Access the inner data array correctly
                    if (Array.isArray(data.data.data)) { // Adjusted here
                        const options = data.data.data.map((kota) => ({
                            value: kota.id,
                            label: kota.city,
                        }));
                        setKotaOptions(options);
                    } else {
                        console.error("Expected an array, but got:", data.data);
                    }
                } catch (error) {
                    console.error("Error fetching kota:", error);
                }
            };
            fetchKota();
        }
    }, [formData[currentPage]?.provinsi]);


    useEffect(() => {
        console.log("Kota changed:", formData[currentPage]?.kota);

        if (formData[currentPage]?.kota) {
            const fetchKecamatan = async () => { // Renamed to fetchKecamatan for clarity
                try {
                    const response = await fetch(`/api/getKecamatan?city_id=${formData[currentPage].kota}`);

                    // Periksa apakah response berhasil
                    if (!response.ok) throw new Error("Failed to fetch kecamatan");

                    const data = await response.json();
                    console.log("Data yang diterima dari API:", data);

                    // Cek apakah data berbentuk array
                    if (Array.isArray(data.data?.data)) {
                        const options = data.data.data.map((kecamatan) => ({
                            value: kecamatan.id,
                            label: kecamatan.district,
                        }));

                        setKecamatanOptions(options); // Pastikan state diubah dengan benar
                    } else {
                        console.error("Expected an array, but got:", data.data);
                    }
                } catch (error) {
                    console.error("Error fetching kecamatan:", error);
                }
            };

            fetchKecamatan(); // Panggil fungsi untuk mengambil kecamatan
        }
    }, [formData[currentPage]?.kota]);



    // Memanggil API untuk mendapatkan kelurahan berdasarkan ID kecamatan yang dipilih
    useEffect(() => {
        console.log("kelurahan changed:", formData[currentPage]?.kecamatan);

        if (formData[currentPage]?.kecamatan) {
            const fetchkelurahan = async () => { // Renamed to fetchKecamatan for clarity
                try {
                    const response = await fetch(`/api/getKelurahan?district_id=${formData[currentPage].kecamatan}`);

                    // Periksa apakah response berhasil
                    if (!response.ok) throw new Error("Failed to fetch kecamatan");

                    const data = await response.json();
                    console.log("Data yang diterima dari API:", data);

                    // Cek apakah data berbentuk array
                    if (Array.isArray(data.data?.data)) {
                        const options = data.data.data.map((kelurahan) => ({
                            value: kelurahan.id,
                            label: kelurahan.kel,
                        }));

                        setKelurahanOptions(options); // Pastikan state diubah dengan benar
                    } else {
                        console.error("Expected an array, but got:", data.data);
                    }
                } catch (error) {
                    console.error("Error fetching kecamatan:", error);
                }
            };

            fetchkelurahan(); // Panggil fungsi untuk mengambil kecamatan
        }
    }, [formData[currentPage]?.kecamatan]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/getDampak_sarpras/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                if (result.status) {
                    const fetchedData = result.data.map((item) => ({
                        jumlah: item.jumlah || "Data tidak ada",
                        kerusakan: item.kerusakan || "Data tidak ada",
                        satuan: item.satuan || "Data tidak ada"
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
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                tanggal_kejadian: formData[currentPage].date,
                nama_kejadian: formData[currentPage].eventName,
                jenis_kejadian_id: formData[currentPage].jenis_kejadian,
                pic_id: formData[currentPage].pic_lapangan,
                province_id: formData[currentPage].provinsi,
                city_id: formData[currentPage].kota,
                district_id: formData[currentPage].kecamatan,
                sub_district_id: formData[currentPage].kelurahan,
                alamat_lengkap: formData[currentPage].address,
            };

            const response = await fetch("/api/createSitrep/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Data successfully submitted.");
                router.push('./damsarpras'); // Pindah halaman ke '/target-page' setelah berhasil
            } else {
                setMessage(`Error: ${data.message || "Submission failed"}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

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
        <div className="flex flex-col items-center min-h-screen bg-white">
            <nav className="w-full bg-[#ff6b00] p-6 shadow-b-lg">
                <div className="flex mt-[10px] justify-center relative">
                    <p className="text-white font-bold text-[22px]">
                        PUBLISH ENTRY REPORT
                    </p>
                </div>
            </nav>
            <div className="flex flex-col w-[380px] max-w-md">
                <form
                    className="bg-white mt-5"
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
                            className="border rounded w-full text-gray-400 py-2 px-3 mb-2"
                            required
                        />
                        <p className="mb-2">Jenis Kejadian*</p>
                        <Select name="jenis_kejadian"
                            value={jenis_kejadianOptions.find(
                                (option) => option.value === formData[currentPage].jenis_kejadian
                            )}
                            onChange={(option) =>
                                handleSelectChange(currentPage, "jenis_kejadian", option.value)
                            }
                            options={jenis_kejadianOptions}
                            styles={selectStyles}
                            className="mb-2"
                            placeholder="Pilih Jenis Kejadian"
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
                        <p className="mb-2">Pic Lapangan*</p>
                        <Select name="Pic Lapangan"
                            value={pic_lapanganOptions.find(
                                (option) => option.value === formData[currentPage].pic_lapangan
                            )}
                            onChange={(option) =>
                                handleSelectChange(currentPage, "pic_lapangan", option.value)
                            }
                            options={pic_lapanganOptions}
                            styles={selectStyles}
                            className="mb-2"
                            placeholder="Pilih Pic Lapangan"
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
                    <div className="flex flex-row justify-between">
                        <a href="./sitrep">
                            <button
                                type="button"
                                className="bg-white border border-orange-500 font-bold text-black py-2 px-6 rounded"
                            >
                                BACK
                            </button>
                        </a>
                        <button
                            type="submit"
                            className="bg-orange-500 text-white py-2 px-6 font-bold rounded"
                        >
                            SAVE
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