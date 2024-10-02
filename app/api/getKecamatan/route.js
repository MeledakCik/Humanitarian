export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const cityId = searchParams.get('city_id');
        console.log("City ID received in route:", cityId);

        if (!cityId) {
            return new Response(JSON.stringify({ message: 'City ID tidak tersedia' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const response = await fetch(`https://humanitarian1-rz-be-dev1.cnt.id/apid/get_kecamatan?city_id=${cityId}`);
        if (!response.ok) {
            throw new Error('Error fetching kecamatan');
        }

        const data = await response.json();

        // Ensure you're sending the expected data structure
        return new Response(JSON.stringify({ status: true, data: { data } }), { // Adjusted here
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error fetching data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
