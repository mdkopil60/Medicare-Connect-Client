export const authHeader = async () => {
    const token = await getUserToken();

    // টোকেন না থাকলে সরাসরি একটি খালি অবজেক্ট রিটার্ন করুন। 
    // এতে Authorization হেডারটি তৈরিই হবে না।
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

    // এখানে খেয়াল করুন: ${baseUrl}${path} - মাঝের স্পেসটি সরিয়ে দিয়েছি
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