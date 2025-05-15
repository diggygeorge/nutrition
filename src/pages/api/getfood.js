import { MongoClient } from 'mongodb';

export default async function handler(req, res) {

    const client = new MongoClient(process.env.MONGODB_URI);
    const location = req.query.location;
    const time = req.query.time;
    const sort_nutrient = req.query.nutrient;
    const sort = req.query.sort;
    try {

        await client.connect();

        const database = client.db("dininghall");
        const collection = database.collection("food");
        let data = []
        console.time("query")
        if (sort === '0' || sort_nutrient === '') {
            data = await collection.find({$and: [{'mealtime': time}, {'location': location}]}).toArray();
        }
        else {
        data = await collection.find({$and: [{'mealtime': time}, {'location': location}]}).sort({[sort_nutrient]: sort}).toArray();
        }
        console.timeEnd("query")
        res.status(200).json(data);
    } 
    catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ message: error });
    } 
    finally {
        await client.close();
    }

}