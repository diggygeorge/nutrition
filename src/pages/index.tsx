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

const cart = new Map()
var cartInfo: FoodItem[] = []

const Food = () => {
    let emptyItem: FoodItem[] = []

    const [fooditems, setFoodItems] = useState<FoodItem[]>(emptyItem);
    const [location, setLocation] = useState('warren')
    const [time, setTime] = useState('breakfast')
    const [total, setTotal] = useState({
      calories: 0,
      totalfat: 0,
      saturatedfat: 0,
      transfat: 0,
      cholesterol: 0,
      sodium: 0,
      totalcarbohydrate: 0,
      dietaryfiber: 0,
      sugars: 0,
      protein: 0,
    })


    useEffect(() => {
        fetch(`http://localhost:3001/api/getfood?location=${location}&time=${time}`)
        .then((res) => (res.json()))
        .then((data) => {setFoodItems(data)})
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
            <div className="pt-5">
                <ul>
                    {fooditems.map((item) => (
                        <li key = {item._id.toString()}>
                            <h1><button onClick={() => {
                              if (cart.get(item.name) === undefined) {
                                cart.set(item.name, 1)
                              }
                              else {
                                cart.set(item.name, cart.get(item.name) + 1)
                              }
                              setTotal(
                                {
                                  calories: total.calories += item.calories,
                                  totalfat: total.totalfat += item.totalfat,
                                  saturatedfat: total.saturatedfat += item.saturatedfat,
                                  transfat: total.transfat += item.transfat,
                                  cholesterol: total.cholesterol += item.cholesterol,
                                  sodium: total.sodium += item.sodium,
                                  totalcarbohydrate: total.totalcarbohydrate += item.totalcarbohydrate,
                                  dietaryfiber: total.dietaryfiber += item.dietaryfiber,
                                  sugars: total.sugars += item.sugars,
                                  protein: total.protein += item.protein
                                }
                              )
                              {if (cartInfo.indexOf(item) === -1) {cartInfo.push(item)
                                                                 console.log(cartInfo)
                              } }}}>{item.name}</button></h1>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="pt-5">
              <h1>Cart:</h1>
              <ul>
              {cartInfo.map((item) => (
                <li key = {item._id.toString()}>
                <div>{item.name} {cart.get(item.name) > 1 ? <p>x {cart.get(item.name)}</p> : <></>}{cart.get(item.name) !== undefined ? <button onClick={() => {
                  setTotal(
                            {
                              calories: total.calories -= item.calories,
                              totalfat: total.totalfat -= item.totalfat,
                              saturatedfat: total.saturatedfat -= item.saturatedfat,
                              transfat: total.transfat -= item.transfat,
                              cholesterol: total.cholesterol -= item.cholesterol,
                              sodium: total.sodium -= item.sodium,
                              totalcarbohydrate: total.totalcarbohydrate -= item.totalcarbohydrate,
                              dietaryfiber: total.dietaryfiber -= item.dietaryfiber,
                              sugars: total.sugars -= item.sugars,
                              protein: total.protein -= item.protein
                            }
                          )
                    if (cart.get(item.name) === 1) {
                      cart.delete(item.name)
                      let index = cartInfo.indexOf(item)
                      cartInfo.splice(index, 1)
                    }
                    else {
                      cart.set(item.name, cart.get(item.name) - 1)
                    }
                }}>Remove Item</button> : <></>}</div></li>
              ))}
              </ul>
            </div>
            <div className="pt-5">
              <h1>Total:</h1>
              <p>Calories: {total.calories}</p>
              <p>Total Fat: {total.totalfat}g</p>
              <p>Saturated Fat: {total.saturatedfat}g</p>
              <p>Trans Fat: {total.transfat}g</p>
              <p>Cholesterol: {total.cholesterol}mg</p>
              <p>Sodium: {total.sodium}mg</p>
              <p>Total Carbohydrates: {total.totalcarbohydrate}g</p>
              <p>Dietary Fiber: {total.dietaryfiber}g</p>
              <p>Sugars: {total.sugars}g</p>
              <p>Protein: {total.protein}g</p>
            </div>
        </>
    )
}

export default Food;