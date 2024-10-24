export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const apiUrl = `https://humanitarian1-rz-be-dev1.cnt.id/apid/delete_dokumentasi_site_report`;
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }) // Kirim ID dalam body
        });

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
        if (data && data.status) {
            return new Response(JSON.stringify(data), {
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

