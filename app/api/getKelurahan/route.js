export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const kecamatanId = searchParams.get('district_id');
        console.log("district_id received in route:", kecamatanId); // Log the received district_id

        // Check if district_id (kecamatanId) is provided
        if (!kecamatanId) {
            return new Response(JSON.stringify({ message: 'Kecamatan ID tidak tersedia' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Fetch kelurahan data from external API using kecamatanId (district_id)
        const response = await fetch(`https://humanitarian1-rz-be-dev1.cnt.id/apid/get_kelurahan?district_id=${kecamatanId}`);
        if (!response.ok) {
            throw new Error('Error fetching kelurahan data');
        }

        const data = await response.json();
        console.log("Data kelurahan yang diterima dari API:", data); // Log the received data for debugging

        // Return the data in a proper structure
        return new Response(JSON.stringify({ status: true, data }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        // Log the error and return a proper error response
        console.error("Error fetching kelurahan:", error);
        return new Response(JSON.stringify({ message: 'Error fetching data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
