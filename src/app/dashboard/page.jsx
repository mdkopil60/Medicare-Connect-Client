import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { MongoClient } from "mongodb"; 

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect('/login');

    const client = new MongoClient(process.env.MONGO_DB_URI);
    await client.connect();
    const db = client.db(process.env.AUTH_DB_NAME);


    const user = await db.collection("user").findOne({ email: session.user.email.toLowerCase() });
    const role = user?.role;

    // console.log("Database Role Found:", role);

    if (role === 'Doctor') redirect('/dashboard/doctor');
    if (role === 'Patient') redirect('/dashboard/patient');
    if (session.user.email === 'admin@medicare.com') {
        redirect('/dashboard/admin');
    }

    return <div>no user</div>;
}