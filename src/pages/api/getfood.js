import { MongoClient } from 'mongodb';

export default async function handler(req, res) {

    const client = new MongoClient(process.env.MONGODB_URI);
    const location = req.query.location;
    const time = req.query.time;
    const sort_nutrient = req.query.nutrient;
    const sort = req.query.sort;
    const isVegetarian = req.query.isVegetarian;
    const isVegan = req.query.isVegan;
    const isHalal = req.query.isHalal;
    const isGlutenfree = req.query.isGlutenfree;
    const noEgg = req.query.noEgg;
    const noFish = req.query.noFish;
    const noMilk = req.query.noMilk;
    const noPeanuts = req.query.noPeanuts;
    const noSesame = req.query.noSesame;
    const noShellfish = req.query.noShellfish;
    const noSoy = req.query.noSoy;
    const noTreenuts = req.query.noTreenuts;
    const noWheat = req.query.noWheat;

    try {

        await client.connect();

        const database = client.db("dininghall");
        const collection = database.collection("food");
        let data = []
        var query = []
        console.log(isVegetarian)
        if (isVegetarian === "true") {
            query.push({'vegetarian': true})
        }
        else {
            let index = query.indexOf({'vegetarian': true})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (isVegan === "true") {
            query.push({'vegan': true})
        }
        else {
            let index = query.indexOf({'vegan': true})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (isHalal === "true") {
            query.push({'halal': true})
        }
        else {
            let index = query.indexOf({'halal': true})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (isGlutenfree === "true") {
            query.push({'gluten-free': true})
        }
        else {
            let index = query.indexOf({'gluten-free': true})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (noEgg === "true") {
            query.push({'egg': false})
        }
        else {
            let index = query.indexOf({'egg': false})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (noMilk === "true") {
            query.push({'milk': false})
        }
        else {
            let index = query.indexOf({'milk': false})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (noFish === "true") {
            query.push({'fish': false})
        }
        else {
            let index = query.indexOf({'fish': false})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (noPeanuts === "true") {
            query.push({'peanuts': false})
        }
        else {
            let index = query.indexOf({'peanuts': false})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (noSesame === "true") {
            query.push({'sesame': false})
        }
        else {
            let index = query.indexOf({'sesame': false})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (noShellfish === "true") {
            query.push({'shellfish': false})
        }
        else {
            let index = query.indexOf({'shellfish': false})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (noSoy === "true") {
            query.push({'soy': false})
        }
        else {
            let index = query.indexOf({'soy': false})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (noTreenuts === "true") {
            query.push({'tree-nuts': false})
        }
        else {
            let index = query.indexOf({'tree-nuts': false})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (noWheat === "true") {
            query.push({'wheat': false})
        }
        else {
            let index = query.indexOf({'wheat': false})
            if (index !== -1) {query.splice(index, 1)}
        }

        if (sort === '0' || sort_nutrient === '') {
            query.push({'mealtime': time}, {'location': location})
            data = await collection.find({$and: query}).toArray();
        }
        else {
            query.push({'mealtime': time}, {'location': location})
            data = await collection.find({$and: query}).sort({[sort_nutrient]: sort}).toArray();
        }
        console.log(query)
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