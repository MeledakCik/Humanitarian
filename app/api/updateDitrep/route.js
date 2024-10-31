
export async function POST(req) {
    try {
        const { searchParams } = new URL(req.url);
        const requestBody = await req.json(); // Parse the JSON body
        console.log("Final payload to API:", JSON.stringify(requestBody));
        const idDitrep = searchParams.get("id");
        const response = await fetch(`https://humanitarian1-rz-be-dev1.cnt.id/apid/update_distribution_report?id=${idDitrep}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
        });

        
        // console.log(response ,"iki mid cupu")
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return new Response(JSON.stringify({ message: 'Error fetching data from external API' }), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const text = await response.text(); // Get the raw response as text
        console.log("Raw response from API:", text); // Log the raw response

        // Try parsing the response as JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return new Response(JSON.stringify({ message: 'Error parsing data from external API' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        console.log("Data yang diterima dari API:", data);
        if (data && data.status) {
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            console.error("Data tidak tersedia:", data);
            return new Response(JSON.stringify({ message: 'Data tidak tersedia' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error); // Log the error for debugging
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}