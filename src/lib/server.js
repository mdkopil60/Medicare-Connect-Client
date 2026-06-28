export const authHeader = async () => {
    const token = await getUserToken();

    if (!token) {
        return {};
    }
    return {
        authorization: `Bearer ${token}`
    };
}

export const serverMutation = async (path, data, method = 'POST') => {
    const headers = {
        'Content-Type': 'application/json',
        ...await authHeader()
    };

    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: headers,
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
    }
    return res.json();
}