"use client";
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Select from "react-select";

export default function Sitrep() {
    const router = useRouter();
    const { id } = useParams();
    const containerRef = useRef(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        date: "",
        jenis_kejadian: "",
        eventName: "",
        pic: "",
        provinsi: "",
        kota: "",
        kecamatan: "",
        kelurahan: "",
        address: "",
    });
    const [dataItems, setDataItems] = useState([]);
    const [currentPage, setCurrentPageOptions] = useState([]);

    const [picLapangan, setPicLapangan] = useState(null); // State untuk Pic Lapangan

    const [jenisKejadian, setJenisKejadian] = useState(null); // State untuk Jenis Kejadian

    const [provProvinsi, setProvinsi] = useState(null);
    const [provinsiOptions, setProvinsiOptions] = useState([]);

    const [kotaOptions, setKotaOptions] = useState([]);
    const [cityKota, setCityKota] = useState(null);
    const [valueCity, setValueCity] = useState(null);

    const [pic_lapanganOptions, setPicLapanganOptions] = useState([]); // State untuk opsi Pic Lapangan

    const [jenis_kejadianOptions, setJenisKejadianOptions] = useState([]);

    const [kecamatanOptions, setKecamatanOptions] = useState([]);
    const [valueKecamatan, setValueKecamatan] = useState(null);
    const [kecamatanKec, setKecamatanKec] = useState(null);

    const [kelurahanOptions, setKelurahanOptions] = useState([]);
    const [valueKelurahan, setValueKelurahan] = useState(null);
    const [kelurahanKel, setKelurahanKel] = useState(null);

    const handleUpdateData = async (e, formData) => {
        try {
            e.preventDefault();
            const payload = {
                tanggal_kejadian: formData.date,
                nama_kejadian: formData.eventName,
                jenis_kejadian_id: formData.jenis_kejadian,
                pic_id: formData.pic,
                province_id: formData.provinsi,
                city_id: formData.kota,
                district_id: formData.kecamatan,
                sub_district_id: formData.kelurahan,
                alamat_lengkap: formData.address
            }
            const response = await fetch(`/api/updateSitrep?id=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setIsSuccess(true);
                console.log("Data berhasil diperbarui");
            } else {
                console.error("Gagal memperbarui data");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        const fetchJenisKejadian = async () => {
            try {
                const response = await fetch("/api/getJenis_kejadian/"); // Endpoint untuk mendapatkan Jenis Kejadian
                const data = await response.json();
                const options = data.data.map(item => ({ value: item.id, label: item.jenis_kejadian })); // Ganti 'name' sesuai dengan nama field yang sesuai di API
                setJenisKejadianOptions(options);
            } catch (error) {
                console.error(error);
            }
        };
        fetchJenisKejadian();

        const fetchPic_lapangan = async () => {
            try {
                const response = await fetch("/api/getPic_lapangan/");
                const data = await response.json();
                const options = data.data.map(item => ({ value: item.id, label: item.fullname }));
                setPicLapanganOptions(options);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPic_lapangan();
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/getSitrep?id=${id}`);
                const result = await response.json();
                if (result.statusCode === 200) {
                    const data = result.data.data[0];
                    setFormData({
                        date: data.tanggal_kejadian,
                        eventName: data.nama_kejadian,
                        jenis_kejadian: data.jenis_kejadian_id,
                        pic: data.pic_id,
                        provinsi: data.province_id,
                        kota: data.city_id,
                        kecamatan: data.district_id,
                        kelurahan: data.sub_district_id,
                        address: data.alamat_lengkap,
                    });
                    console.log(data, "ada")
                } else {
                    console.error("Data tidak tersedia");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchProvinsi = async () => {
            try {
                const response = await fetch("/api/getProvinsi/");
                const data = await response.json();
                const options = data.data.map(item => ({ value: item.id, label: item.prov }));
                setProvinsiOptions(options);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProvinsi();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/getDok?dok_site_id=${id}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                if (result.status) {
                    const fetchedData = result.data.map((item) => ({
                        id: item.id || "Data tidak ada",
                        dok_site_id: item.dok_site_id || "Data tidak ada",
                        base64_sitrep_dokumentasi: item.base64_sitrep_dokumentasi || "Data tidak ada" // Use the correct key
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

    useEffect(() => {
        if (formData.provinsi) {
            const fetchKota = async () => {
                try {
                    const response = await fetch(`/api/getKota?province_id=${formData.provinsi}`);
                    const data = await response.json();
                    if (Array.isArray(data.data.data)) {
                        const options = data.data.data.map((item) => ({
                            value: item.id,
                            label: item.city,
                        }));

                        setKotaOptions(options);

                        // Set valueCity ke kota yang ada di formData.kota
                        const filterKotaExist = options.find((item) => item.value === String(formData.kota));
                        setValueCity(filterKotaExist || null);
                    } else {
                        console.error("Expected an array, but got:", data.data);
                    }
                } catch (error) {
                    console.error("Error fetching kota:", error);
                }
            };
            fetchKota();
        } else {
            setKotaOptions([]);
            setValueCity(null); // Reset valueCity saat provinsi kosong
        }
    }, [formData.provinsi]);

    useEffect(() => {
        if (formData.kota) {
            const fetchKecamatan = async () => {
                try {
                    const response = await fetch(`/api/getKecamatan?city_id=${formData.kota}`);
                    const data = await response.json();
                    if (Array.isArray(data.data.data)) {
                        const options = data.data.data.map((item) => ({
                            value: item.id,
                            label: item.district,
                        }));
                        setKecamatanOptions(options);
                        const filterKecamatanExist = options.find((item) => item.value === String(formData.kecamatan));
                        setValueKecamatan(filterKecamatanExist || null);
                    } else {
                        console.error("Expected an array, but got:", data.data);
                    }
                } catch (error) {
                    console.error("Error fetching kota:", error);
                }
            };
            fetchKecamatan();
        } else {
            setKecamatanOptions([]);
            setValueKecamatan(null);
        }
    }, [formData.kota]);

    useEffect(() => {
        if (formData.kecamatan) {
            const fetchKelurahan = async () => {
                try {
                    const response = await fetch(`/api/getKelurahan?district_id=${formData.kecamatan}`);
                    const data = await response.json();
                    if (Array.isArray(data.data.data)) {
                        const options = data.data.data.map((item) => ({
                            value: item.id,
                            label: item.kel,
                        }));
                        setKelurahanOptions(options);
                        const filterKelurahanExist = options.find((item) => item.value === String(formData.kelurahan));
                        setValueKelurahan(filterKelurahanExist || null);
                    } else {
                        console.error("Expected an array, but got:", data.data);
                    }
                } catch (error) {
                    console.error("Error fetching kota:", error);
                }
            };
            fetchKelurahan();
        } else {
            setKelurahanOptions([]);
            setValueKelurahan(null);
        }
    }, [formData.kecamatan]);

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
                        dampak_site_id: item.dampak_site_id || "Data tidak ada",
                        satuan: item.satuan || "Data tidak ada"
                    }));
                    setDataItems(fetchedData);
                } else {
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const handleInputChange = (currentPage, field, value) => {
        if (field === "provinsi") {
            const selectedProvinsi = provinsiOptions.find((option) => option.value === value);
            setProvinsi(selectedProvinsi);
            setFormData((prevData) => ({
                ...prevData,
                provinsi: value, // Update formData state
                kota: "", // Reset kota when provinsi changes
                kecamatan: "", // Reset kecamatan when provinsi changes
                kelurahan: "", // Reset kelurahan when provinsi changes
            }));
            setCityKota(null); // Reset kota when provinsi changes
            setValueCity(null); // Reset valueCity
            setKecamatanKec(null); // Reset kecamatan when provinsi changes
            setValueKecamatan(null); // Reset valueKecamatan
            setKelurahanKel(null); // Reset kelurahan when provinsi changes
            setValueKelurahan(null); // Reset valueKelurahan
        } else if (field === "kota") {
            const selectedKota = kotaOptions.find((option) => option.value === value);
            setCityKota(selectedKota);
            setFormData((prevData) => ({
                ...prevData,
                kota: value, // Update formData state
                kecamatan: "", // Reset kecamatan when kota changes
                kelurahan: "", // Reset kelurahan when kota changes
            }));
            setValueCity(selectedKota); // Set valueCity to selected kota
            setKecamatanKec(null); // Reset kecamatan when kota changes
            setValueKecamatan(null); // Reset valueKecamatan
            setKelurahanKel(null); // Reset kelurahan when kota changes
            setValueKelurahan(null); // Reset valueKelurahan
        } else if (field === "pic") {
            const selectedPic = pic_lapanganOptions.find((option) => option.value === value);
            setPicLapangan(selectedPic);
            setFormData((prevData) => ({
                ...prevData,
                pic: value, // Update formData state
            }));
        } else if (field === "jenis_kejadian") {
            const selectedJenisKejadian = jenis_kejadianOptions.find((option) => option.value === value);
            setJenisKejadian(selectedJenisKejadian);
            setFormData((prevData) => ({
                ...prevData,
                jenis_kejadian: value, // Update formData state
            }));
        } else if (field === "kecamatan") {
            const selectedKecamatan = kecamatanOptions.find((option) => option.value === value);
            setKecamatanKec(selectedKecamatan);
            setFormData((prevData) => ({
                ...prevData,
                kecamatan: value, // Update formData state
            }));
            setValueKecamatan(selectedKecamatan); // Set valueKecamatan to selected kecamatan
        } else if (field === "kelurahan") {
            const selectedKelurahan = kelurahanOptions.find((option) => option.value === value);
            setKelurahanKel(selectedKelurahan);
            setFormData((prevData) => ({
                ...prevData,
                kelurahan: value, // Update formData state
            }));
            setValueKelurahan(selectedKelurahan); // Set valueKelurahan to selected kelurahan
        } else if (field === "date") { // Handling the date input
            setFormData((prevData) => ({
                ...prevData,
                date: value, // Update formData state with selected date
            }));
        } else if (field === "address") { // Handling the date input
            setFormData((prevData) => ({
                ...prevData,
                [field]: value, // Update formData state with selected date
            }));
        } else if (currentPage === "eventName") { // Handling the date input
            setFormData((prevData) => ({
                ...prevData,
                eventName: value, // Update formData state with selected date
            }));
        }
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

    useEffect(() => {
        const filterOps = jenis_kejadianOptions.filter((item) => {
            return item.value === String(formData.jenis_kejadian)
        })
        setJenisKejadian(filterOps[0])
    }, [formData, jenisKejadian])

    useEffect(() => {
        const filterOps = pic_lapanganOptions.filter((item) => {
            return item.value === String(formData.pic)
        })
        setPicLapangan(filterOps[0])
    }, [formData, picLapangan])

    useEffect(() => {
        const filterOps = provinsiOptions.filter((item) => {
            return item.value === String(formData.provinsi)
        })
        setProvinsi(filterOps[0])
    }, [formData, provProvinsi])

    useEffect(() => {
        const filterOps = kotaOptions.filter((item) => {
            return item.value === String(formData.kota)
        })
        setCityKota(filterOps[0])
    }, [formData, cityKota])

    useEffect(() => {
        const filterOps = kecamatanOptions.filter((item) => {
            return item.value === String(formData.kecamatan);
        });
        setKecamatanKec(filterOps[0]);
    }, [formData, kecamatanKec]);

    useEffect(() => {
        const filterOps = kelurahanOptions.filter((item) => {
            return item.value === String(formData.kelurahan);
        });
        setKelurahanKel(filterOps[0]);
    }, [formData, kelurahanKel]);


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
                // onSubmit={handleUpdateData(formData)}
                >
                    <div className="mb-4">
                        <p className="mb-2">Tanggal</p>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                            className="border rounded w-full text-gray-400 py-2 px-3 mb-2"
                            required
                        />
                        <p className="mb-2">Jenis Kejadian*</p>
                        <Select
                            value={jenisKejadian}
                            onChange={(option) => handleInputChange("jenis_kejadian", option.value)}
                            options={jenis_kejadianOptions}
                            styles={selectStyles}
                            className="mb-2"
                            placeholder="Pilih Jenis Kejadian"
                        />
                        <p className="mb-2">Nama Kejadian</p>
                        <input
                            type="text"
                            placeholder="Nama Kejadian"
                            value={formData.eventName}
                            onChange={(e) => handleInputChange("eventName", e.target.value)}
                            className="border rounded w-full py-2 px-3 mb-2"
                            required
                        />
                        <p className="mb-2">Pic Lapangan*</p>
                        <Select
                            name="Pic Lapangan"
                            value={picLapangan}
                            onChange={(option) => handleInputChange("pic", option.value)}
                            options={pic_lapanganOptions}
                            styles={selectStyles}
                            className="mb-2"
                            placeholder="Pilih Pic Lapangan"
                        />

                        <p className="mb-2">Provinsi*</p>
                        <Select
                            name="provinsi"
                            value={provProvinsi}
                            onChange={option => handleInputChange("provinsi", option.value)}
                            options={provinsiOptions}
                            styles={selectStyles}
                            className="mb-2"
                            placeholder="Pilih Provinsi"
                        />

                        <p className="mb-2">Kota*</p>
                        <Select
                            name="kota"
                            value={valueCity} // Ganti defaultValue dengan value
                            onChange={option => handleInputChange("kota", option.value)}
                            options={kotaOptions}
                            styles={selectStyles}
                            className="mb-2"
                            placeholder="Pilih Kota"
                            isDisabled={!provProvinsi} // Disable kota jika provinsi belum dipilih
                        />

                        <p className="mb-2">Kecamatan*</p>
                        <Select
                            name="kecamatan"
                            value={valueKecamatan}
                            onChange={option =>
                                handleInputChange("kecamatan", option.value)
                            }
                            options={kecamatanOptions}
                            styles={selectStyles}
                            className="mb-2"
                            placeholder="Pilih Kecamatan"
                        />

                        <p className="mb-2">Kelurahan*</p>
                        <Select
                            name="kelurahan"
                            value={valueKelurahan}
                            onChange={option => handleInputChange("kelurahan", option.value)}
                            options={kelurahanOptions}
                            styles={selectStyles}
                            className="mb-2"
                            placeholder="Pilih Kelurahan"
                        />
                        <p className="mb-2">Alamat</p>
                        <input
                            type="text"
                            placeholder="Alamat"
                            value={formData.address}
                            onChange={(e) =>
                                handleInputChange(currentPage, "address", e.target.value)
                            }
                            className="border rounded w-full py-2 px-3 mb-2"
                        />
                    </div>
                    {isSuccess && (
                        <div className="text-green p-2 rounded mb-4 text-center">
                            Data berhasil diperbarui
                        </div>
                    )}
                    <div className="mt-3 overflow-y-auto" ref={containerRef} style={{ height: '400px', paddingBottom: '80px' }}>
                        {dataItems.map((item, index) => (
                            <div key={index} className="p-2">
                                <div className="flex justify-between">
                                    <div className="w-full">
                                        {item.base64_sitrep_dokumentasi ? (
                                            <img
                                                src={convertBase64ToImage(item.base64_sitrep_dokumentasi)}
                                                alt="Dokumentasi Bencana Alam"
                                                className="w-full h-auto rounded-md"
                                            />
                                        ) : (
                                            <p className="text-gray-800"></p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-row justify-between mb-4">
                        <a href="./sitrep">
                            <button
                                type="button"
                                className="bg-white border border-orange-500 font-bold text-black py-2 px-6 rounded"
                            >
                                BACK
                            </button>
                        </a>
                        <Link href={`/damsarpras/${id}`} passHref>
                            <button
                                type="button"
                                className="bg-orange-500 text-white py-2 px-6 font-bold rounded"
                            >
                                NEXT
                            </button>
                        </Link>
                        <button
                            className="bg-orange-500 text-white py-2 px-6 font-bold rounded"
                            onClick={(e) => handleUpdateData(e, formData)}>
                            UPDATE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}