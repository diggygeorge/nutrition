import { MongoClient } from 'mongodb';

export default async function handler(req, res) {

    const client = new MongoClient(process.env.MONGODB_URI);
    const location = req.query.location;
    const time = req.query.time;
    try {

        await client.connect();

        const database = client.db("dininghall");
        const collection = database.collection("food");
        const data = await collection.find({$and: [{'mealtime': time}, {'location': location}]}).toArray();
        res.status(200).json(data);
    } 
    catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    } 
    finally {
        await client.close();
    }

}