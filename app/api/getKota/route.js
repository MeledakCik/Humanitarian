export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const provinsiId = searchParams.get('province_id');
        console.log("province_id received in route:", provinsiId);

        if (!provinsiId) {
            return new Response(JSON.stringify({ message: 'Provinsi ID tidak tersedia' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const response = await fetch(`https://humanitarian1-rz-be-dev1.cnt.id/apid/get_kota?province_id=${provinsiId}`);
        if (!response.ok) {
            throw new Error('Error fetching cities');
        }

        const data = await response.json();
        return new Response(JSON.stringify({ status: true, data }), {
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
