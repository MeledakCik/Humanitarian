// app/api/getStuden/route.js
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    try {
        const url = `https://humanitarian1-rz-be-dev1.cnt.id/apid/get_distribution_report?search=${search}`;
        const response = await fetch(url);

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
            return new Response(JSON.stringify({ statusCode: 200, data: data }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return new Response(JSON.stringify({ message: 'Error parsing data from external API' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // console.log("Data yang diterima dari APIx:", data);
        // if (data && data.statusCode === 200) {
        //     // Filter the data based on the student_name if provided
        //     const filteredData = studentName
        //         ? data.data.filter(item => item.student_name.toLowerCase().includes(studentName.toLowerCase()))
        //         : data.data;

        //     return new Response(JSON.stringify({ statusCode: 200, data: filteredData }), {
        //         status: 200,
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // } else {
        //     // console.error("Data tidak tersedia:", data);
        //     return new Response(JSON.stringify({ message: 'Data tidak tersedia' }), {
        //         status: 404,
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // }
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
