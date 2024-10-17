export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const lokasiSiteId = searchParams.get("lokasi_site_id");
        // Panggil API eksternal tanpa parameter filter
        const apiUrl = `https://humanitarian1-rz-be-dev1.cnt.id/apid/get_lokasi_terdampak`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return new Response(JSON.stringify({ message: 'Error fetching data from external API' }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return new Response(JSON.stringify({ message: 'Error parsing data from external API' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Cek apakah data valid dan lakukan filter berdasarkan kebutuhan_site_id jika tersedia
        if (data && data.status && Array.isArray(data.data)) {
            const filteredData = lokasiSiteId
                ? data.data.filter((item) => item.lokasi_site_id == lokasiSiteId)
                : data.data;

            return new Response(JSON.stringify({ status: true, data: filteredData }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({ message: 'Data tidak tersedia' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
