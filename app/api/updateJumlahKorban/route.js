export async function POST(req) {
    try {
        const requestBody = await req.json();
        console.log("Incoming request body:", requestBody);

        const response = await fetch('https://humanitarian1-rz-be-dev1.cnt.id/apid/update_jumlah_korban', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
            return new Response(JSON.stringify({ message: 'Error fetching data from external API' }), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                }
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
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        if (data && data.status) {
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } else {
            console.error("Data tidak tersedia:", data);
            return new Response(JSON.stringify({ message: 'Data tidak tersedia' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}
