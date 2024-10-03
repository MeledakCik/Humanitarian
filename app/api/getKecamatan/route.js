export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const cityId = searchParams.get('city_id');
        console.log("City ID received in route:", cityId);

        // Cek jika city_id tidak tersedia
        if (!cityId) {
            return new Response(JSON.stringify({ message: 'City ID tidak tersedia' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Ambil data dari API eksternal
        const response = await fetch(`https://humanitarian1-rz-be-dev1.cnt.id/apid/get_kecamatan?city_id=${cityId}`);
        
        // Cek apakah fetch berhasil
        if (!response.ok) {
            const errorText = await response.text(); // Coba baca pesan error dari respons
            console.error('Error fetching kecamatan:', errorText); // Log error response
            throw new Error('Error fetching kecamatan');
        }

        const data = await response.json();
        console.log("Data received from API:", data); // Tambahkan log untuk cek data dari API

        // Kirim respons balik ke frontend
        return new Response(JSON.stringify({ status: true, data }), { // Jangan bungkus dengan 'data: { data }' jika tidak diperlukan
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error in GET route:", error); // Log kesalahan agar bisa ditelusuri
        return new Response(JSON.stringify({ message: 'Error fetching data', error: error.message }), { // Tambahkan detail error ke respons
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
