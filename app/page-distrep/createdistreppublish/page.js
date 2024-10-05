"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Select from "react-select";

export default function Sitrep() {
  const initialFormData = {
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
  };

  const [formData, setFormData] = useState([initialFormData]);
  const [currentPage, setCurrentPage] = useState(0);
  const [message, setMessage] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [activeMenu, setActiveMenu] = useState("draft");
  const [drafts, setDrafts] = useState([]);
  const [publishedEvents, setPublishedEvents] = useState([]);
  const [provinsiOptions, setProvinsiOptions] = useState([]);
  const [kotaOptions, setKotaOptions] = useState([]);
  const [kecamatanOptions, setKecamatanOptions] = useState([]);
  const [kelurahanOptions, setKelurahanOptions] = useState([]);
  const [jenis_kejadianOptions, setJenisKejadianOptions] = useState([]);
  const [pic_lapanganOptions, setPicLapanganOptions] = useState([]);

  // Fetching options from API
  useEffect(() => {
    const fetchData = async (url, setOptions, mapData) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        if (data?.status && data?.data) {
          setOptions(data.data.map(mapData));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData("/api/getJenis_kejadian", setJenisKejadianOptions, (item) => ({
      value: item.id,
      label: item.jenis_kejadian,
    }));

    fetchData("/api/getPic_lapangan", setPicLapanganOptions, (item) => ({
      value: item.id,
      label: item.pic,
    }));

    fetchData("/api/getProvinsi", setProvinsiOptions, (item) => ({
      value: item.id,
      label: item.prov,
    }));
  }, []);

  // Fetching dependent data (Kota, Kecamatan, Kelurahan)
  useEffect(() => {
    if (formData[currentPage]?.provinsi) {
      fetchKota(formData[currentPage].provinsi);
    }
  }, [formData[currentPage]?.provinsi]);

  useEffect(() => {
    if (formData[currentPage]?.kota) {
      fetchKecamatan(formData[currentPage].kota);
    }
  }, [formData[currentPage]?.kota]);

  useEffect(() => {
    if (formData[currentPage]?.kecamatan) {
      fetchKelurahan(formData[currentPage].kecamatan);
    }
  }, [formData[currentPage]?.kecamatan]);

  const fetchKota = async (provinsiId) => {
    try {
      const response = await fetch(`/api/getKota?province_id=${provinsiId}`);
      const data = await response.json();
      if (Array.isArray(data.data?.data)) {
        setKotaOptions(
          data.data.data.map((item) => ({
            value: item.id,
            label: item.city,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching kota:", error);
    }
  };

  const fetchKecamatan = async (kotaId) => {
    try {
      const response = await fetch(`/api/getKecamatan?city_id=${kotaId}`);
      const data = await response.json();
      if (Array.isArray(data.data?.data)) {
        setKecamatanOptions(
          data.data.data.map((item) => ({
            value: item.id,
            label: item.district,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching kecamatan:", error);
    }
  };

  const fetchKelurahan = async (kecamatanId) => {
    try {
      const response = await fetch(`/api/getKelurahan?district_id=${kecamatanId}`);
      const data = await response.json();
      if (Array.isArray(data.data?.data)) {
        setKelurahanOptions(
          data.data.data.map((item) => ({
            value: item.id,
            label: item.kel,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching kelurahan:", error);
    }
  };

  // Input Handlers
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

  // Form Submit and Save
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeMenu === "publish" && isOnline) {
      setPublishedEvents((prev) => [...prev, ...formData]);
      setMessage("Acara dipublikasikan!");
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
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <nav className="w-full bg-[#ff6b00] p-6 ">
        <div className="flex justify-center">
          <p className="text-white text-bold text-[16px]">
            PUBLISH DISTRIBUTION REPORT
          </p>
        </div>
      </nav>

      <div className="flex flex-col w-full max-w-full">
        <form
          className="bg-white p-6 rounded shadow-md w-full"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <p className="mb-2">No. SPK*</p>
            <input
              type="text"
              placeholder="Nomor SPK"
              value={formData[currentPage].spk || ""}
              onChange={(e) =>
                handleInputChange(currentPage, "spk", e.target.value)
              }
              className="border rounded w-full py-2 px-3 mb-2"
              required
            />
            <p className="mb-2">Tanggal Penyaluran</p>
            <input
              type="date"
              value={formData[currentPage].date}
              onChange={(e) =>
                handleInputChange(currentPage, "date", e.target.value)
              }
              className="border rounded text-gray-400 w-full py-2 px-3 mb-2"
              required
            />
            <p className="mb-2">Jenis Kejadian</p>
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
            <p className="mb-2">Nama Kejadian*</p>
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
            <p className="mb-2">Nama PIC</p>
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
            <p className="mb-2">Jumlah Penerima Manfaat</p>
            <input
              type="number"
              placeholder="Jumlah Penerima Manfaat"
              value={formData[currentPage].jumlahPenerima || ""}
              onChange={(e) =>
                handleInputChange(
                  currentPage,
                  "jumlahPenerima",
                  e.target.value
                )
              }
              className="border rounded w-full py-2 px-3 mb-2"
            />
            <p className="mb-2">Jumlah Relawan</p>
            <input
              type="number"
              placeholder="Jumlah Relawan"
              value={formData[currentPage].jumlahRelawan || ""}
              onChange={(e) =>
                handleInputChange(currentPage, "jumlahRelawan", e.target.value)
              }
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
              value={formData[currentPage].address}
              onChange={(e) =>
                handleInputChange(currentPage, "address", e.target.value)
              }
              className="border rounded w-full py-2 px-3 mb-2"
            />
          </div>

          <div className="flex justify-between">
            <Link href="/sitrep" passHref>
              <button className="w-[100px] h-[40px] border border-orange-500 bg-white font-bold text-black rounded-lg">
                BACK
              </button>
            </Link>
            <button
              type="submit"
              className={`w-[100px] h-[40px] bg-[#ff6b00] font-bold text-white rounded-l`}
            >
              {activeMenu === "publish" ? "Publish" : "SAVE"}
            </button>
            <Link href="./mitra" passHref>
              <button className="w-[100px] h-[40px] bg-[#ff6b00] font-bold text-white rounded-lg">
                NEXT
              </button>
            </Link>
          </div>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </form>
      </div>
    </div>
  );
}