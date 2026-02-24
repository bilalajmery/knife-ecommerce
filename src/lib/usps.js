
async function getUspsToken() {
    const key = process.env.USPS_CONSUMER_KEY;
    const secret = process.env.USPS_CONSUMER_SECRET;
    const url = `${process.env.USPS_API_BASE_URL}/oauth2/v3/token`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: 'client_credentials',
                client_id: key,
                client_secret: secret
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`USPS Token Error: ${errorData.error_description || response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('USPS Token Fetch failed:', error);
        throw error;
    }
}

export async function createUspsLabel(labelData) {
    const token = await getUspsToken();
    const url = `${process.env.USPS_API_BASE_URL}/labels/v3/label`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Payment-Authorization-Token': token // In some environments, the bearer token is also used here
            },
            body: JSON.stringify(labelData)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('USPS Label API Error Response:', JSON.stringify(data, null, 2));
            // USPS often returns errors in an 'errors' array or 'message' field
            const errorMsg = data.errors?.[0]?.detail || data.message || JSON.stringify(data);
            throw new Error(errorMsg);
        }

        return data;
    } catch (error) {
        console.error('USPS createUspsLabel failed:', error);
        throw error;
    }
}
