const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkJobs() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db();
        const collection = db.collection('agendaJobs');
        const jobs = await collection.find({}).toArray();
        console.log('Total Jobs in Agenda:', jobs.length);
        jobs.forEach(job => {
            console.log(`- Job: ${job.name}, Next Run: ${job.nextRunAt}, Last Run: ${job.lastRunAt}, Last Finished: ${job.lastFinishedAt}, Failures: ${job.failCount || 0}`);
            if (job.lastRunAt && !job.lastFinishedAt) {
                console.log('  [!] Job is currently locked or crashed');
            }
        });
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

checkJobs();
