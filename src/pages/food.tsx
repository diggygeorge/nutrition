import { ObjectId } from 'mongodb'
import { useState, useEffect } from 'react';

interface FoodItem {
    _id: ObjectId;
    name: string;
    location: string;
    mealtime: string;
    calories: number;
    totalfat: number;
    saturatedfat: number;
    transfat: number;
    cholesterol: number;
    sodium: number;
    totalcarbohydrate: number;
    dietaryfiber: number;
    sugars: number;
    protein: number;
}

var location = 'warren'
const Food = () => {
    let defaultItems: FoodItem[] = []
                                    
    const [fooditems, setFoodItems] = useState<FoodItem[]>(defaultItems);
    const [location, setLocation] = useState('warren')
    const [time, setTime] = useState('breakfast')

    useEffect(() => {
        fetch(`http://localhost:3001/api/getfood?location=${location}&time=${time}`)
        .then((res) => (res.json()))
        .then((data) => {
                            setFoodItems(data)
                            console.log(fooditems)
        })
    }, [location, time])

    return (
        <>
            <div>
                <button onClick={() => {setLocation('warren')}}>Warren</button>
                <button onClick={() => {setLocation('west')}}>West</button>
                <button onClick={() => {setLocation('marciano')}}>Marciano</button>
                <button onClick={() => {setLocation('granby')}}>Granby</button>
                <button onClick={() => {setLocation('fenway')}}>Fenway</button>
            </div>
            <div>
                <button onClick={() => {setTime('breakfast')}}>Breakfast</button>
                <button onClick={() => {setTime('lunch')}}>Lunch</button>
                <button onClick={() => {setTime('brunch')}}>Brunch</button>
                <button onClick={() => {setTime('dinner')}}>Dinner</button>
            </div>
            <div>
                <ul>
                    {fooditems.map((item) => (
                        <li key = {item._id.toString()}>
                            <h1>{item.name}</h1>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Food;