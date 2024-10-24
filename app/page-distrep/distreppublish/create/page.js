"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

export default function Sitrep() {
    const router = useRouter();
    const initialFormData = {
        id: '',
        spk: '',
        tanggalpenyaluran: '',
        jeniskejadian: '',
        namakejadian: '',
        pic: '',
        provinsi: '',
        kota: '',
        kecamatan: '',
        kelurahan: '',
        alamat: '',
        jmlpm: '',
        jmlrelawan: '',
    };

    const [formData, setFormData] = useState([initialFormData]);
    const [currentPage, setCurrentPage] = useState(0);
    const [message, setMessage] = useState("");
    const [provinsiOptions, setProvinsiOptions] = useState([]);
    const [kotaOptions, setKotaOptions] = useState([]);
    const [kecamatanOptions, setKecamatanOptions] = useState([]);
    const [kelurahanOptions, setKelurahanOptions] = useState([]);
    const [jenisKejadianOptions, setJenisKejadianOptions] = useState([]);
    const [picLapanganOptions, setPicLapanganOptions] = useState([]);

    const handleInputChange = (index, field, value) => {
        const updatedData = [...formData];
        updatedData[index][field] = value;
        setFormData(updatedData);
    };

    const handleSelectChange = (index, field, value) => {
        const updatedData = [...formData];
        updatedData[index][field] = value;
        setFormData(updatedData);
    };

    const fetchOptions = async (url, setter, labelKey = "label") => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            if (Array.isArray(data.data)) {
                const options = data.data.map((item) => ({
                    value: item.id,
                    label: item[labelKey],
                }));
                setter(options);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOptions("/api/getJenis_kejadian/", setJenisKejadianOptions, "jenis_kejadian");
        fetchOptions("/api/getPic_lapangan/", setPicLapanganOptions, "fullname");
        fetchOptions("/api/getProvinsi/", setProvinsiOptions, "prov");
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

    useEffect(() => {
        console.log("kelurahan changed:", formData[currentPage]?.kecamatan);

        if (formData[currentPage]?.kecamatan) {
            const fetchkelurahan = async () => { // Renamed to fetchKecamatan for clarity
                try {
                    const response = await fetch(`/api/getKelurahan?district_id=${formData[currentPage].kecamatan}`);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                no_spk: formData[currentPage].spk,
                tanggal_penyaluran: formData[currentPage].tanggalpenyaluran,
                jenis_kejadian_id: formData[currentPage].jeniskejadian,
                nama_kejadian: formData[currentPage].namakejadian,
                pic_id: formData[currentPage].pic,
                province_id: formData[currentPage].provinsi,
                city_id: formData[currentPage].kota,
                district_id: formData[currentPage].kecamatan,
                sub_district_id: formData[currentPage].kelurahan,
                alamat_lengkap: formData[currentPage].alamat,
                jml_pm: formData[currentPage].jmlpm,
                jml_relawan: formData[currentPage].jmlrelawan,
            };

            const response = await fetch("/api/createDistrep", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Data berhasil dikirim.");
                router.push(`./../mitra/${data.ID}`);
            } else {
                setMessage(`Error: ${data.message || "Submission failed"}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const resetForm = () => {
        setFormData([initialFormData]);
        setCurrentPage(0);
    };

    const selectStyles = {
        control: (base) => ({
            ...base,
            padding: "5px",
            borderColor: "#E5E7EB",
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
                        PUBLISH DISTRIBUTION REPORT
                    </p>
                </div>
            </nav>

            <div className="flex flex-col w-[380px] max-w-md">
                <form
                    className="bg-white mt-5"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-4">
                        <p className="mb-2">No. SPK*</p>
                        <input
                            type="text"
                            placeholder="Nomor SPK"
                            value={formData[currentPage].spk}
                            onChange={(e) => handleInputChange(currentPage, "spk", e.target.value)}
                            className="border rounded w-full py-2 px-3 mb-2"
                            required
                        />
                        <p className="mb-2">Tanggal Penyaluran</p>
                        <input
                            type="date"
                            value={formData[currentPage].tanggalpenyaluran}
                            onChange={(e) => handleInputChange(currentPage, "tanggalpenyaluran", e.target.value)}
                            className="border rounded text-gray-400 w-full py-2 px-3 mb-2"
                            required
                        />
                        <p className="mb-2">Jenis Kejadian</p>
                        <Select name="jenis_kejadian"
                            value={jenisKejadianOptions.find((option) => option.value === formData[currentPage].jeniskejadian)}
                            onChange={(option) => handleSelectChange(currentPage, "jeniskejadian", option.value)}
                            options={jenisKejadianOptions}
                            styles={selectStyles}
                            className="mb-2"
                            placeholder="Pilih Jenis Kejadian"
                        />
                        <p className="mb-2">Nama Kejadian*</p>
                        <input
                            type="text"
                            placeholder="Nama Kejadian"
                            value={formData[currentPage].namakejadian}
                            onChange={(e) => handleInputChange(currentPage, "namakejadian", e.target.value)}
                            className="border rounded w-full py-2 px-3 mb-2"
                            required
                        />
                        <p className="mb-2">Nama PIC</p>
                        <Select name="Pic Lapangan"
                            value={picLapanganOptions.find((option) => option.value === formData[currentPage].pic)}
                            onChange={(option) => handleSelectChange(currentPage, "pic", option.value)}
                            options={picLapanganOptions}
                            styles={selectStyles}
                            className="mb-2"
                            placeholder="Pilih Pic Lapangan"
                        />
                        <p className="mb-2">Jumlah Penerima Manfaat</p>
                        <input
                            type="number"
                            placeholder="Jumlah Penerima Manfaat"
                            value={formData[currentPage].jmlpm}
                            onChange={(e) => handleInputChange(currentPage, "jmlpm", e.target.value)}
                            className="border rounded w-full py-2 px-3 mb-2"
                        />
                        <p className="mb-2">Jumlah Relawan</p>
                        <input
                            type="number"
                            placeholder="Jumlah Relawan"
                            value={formData[currentPage].jmlrelawan}
                            onChange={(e) => handleInputChange(currentPage, "jmlrelawan", e.target.value)}
                            className="border rounded w-full py-2 px-3 mb-2"
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
                            value={formData[currentPage].alamat}
                            onChange={(e) =>
                                handleInputChange(currentPage, "alamat", e.target.value)
                            }
                            className="border rounded w-full py-2 px-3 mb-2"
                        />
                    </div>
                    <div className="flex justify-between">
                        <Link href="../distrep" passHref>
                            <button className="w-[100px] h-[40px] border border-orange-500 bg-white font-bold text-black rounded-lg">
                                BACK
                            </button>
                        </Link>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className={`w-[100px] h-[40px] bg-[#ff6b00] font-bold text-white rounded-l`}
                        >
                            SAVE
                        </button>
                    </div>
                    {message && <p className="mt-4 text-red-500">{message}</p>}
                </form>
            </div>
        </div>
    );
}