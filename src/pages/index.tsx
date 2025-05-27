import { ObjectId } from 'mongodb'
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button, { ButtonProps } from '@mui/material/Button';
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { SnackbarProvider, useSnackbar } from 'notistack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';


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

const CartButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(red[500]),
  backgroundColor: red[500],
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '10px 12px',
  margin: '0px 12px 0px 0px',
  border: '1px solid',
  lineHeight: 0.5,
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    backgroundColor: red[700],
  },
}));

const Food = () => {
    function AddToCartButton({item}: {item: FoodItem}) {
      const { enqueueSnackbar } = useSnackbar();
      return (
      <>
        <Accordion key = {item._id.toString()}  className="">
          <AccordionSummary className="w-[750px] align-middle m-2 pt-4 pb-4" expandIcon={<ExpandMoreIcon />}>
            <h1 className="font-body">{item.name}</h1>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="grid grid-cols-2 pb-2">
              <Typography>Calories: {item.calories}</Typography>
              <Typography>Total Fat: {item.totalfat}g</Typography>
              <Typography>Saturated Fat: {item.saturatedfat}g</Typography>
              <Typography>Trans Fat: {item.transfat}g</Typography>
              <Typography>Cholesterol: {item.cholesterol}mg</Typography>
              <Typography>Sodium: {item.sodium}mg</Typography>
              <Typography>Total Carbohydrate: {item.totalcarbohydrate}g</Typography>
              <Typography>Dietary Fiber: {item.dietaryfiber}g</Typography>
              <Typography>Sugars: {item.sugars}g</Typography>
              <Typography>Protein: {item.protein}g</Typography>
            </Box>
            <CartButton onClick={() => {
                enqueueSnackbar(`${item.name} added to Cart`, {variant: "success"});
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
            }}
                }}>Add to Cart</CartButton>
          </AccordionDetails>
        </Accordion>
      </> )
    }

    function RemoveFromCartButton({item}: {item: FoodItem}) {
      const { enqueueSnackbar } = useSnackbar();
      return (
      <Box className="flex justify-between"> <Box className="flex">{item.name} {cart.get(item.name) > 1 ? <p className="pl-1">x{cart.get(item.name)}</p> : <></>}</Box>{cart.get(item.name) !== undefined ? <button className="pl-1" onClick={() => {
                      enqueueSnackbar(`${item.name} removed from Cart`, {variant: "error"});
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
                    }}> Remove Item</button>
                                  : <></>}</Box>)
    }
    

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

    const sortOptions = [0, -1, 1]
    const [sortOptionIndex, setIndex] = useState(0)
    const [sort, setSorted] = useState({
      value: sortOptionIndex,
      nutrient: ''
    })

    useEffect(() => {
        fetch(`https://bu-nutrition.vercel.app/api/getfood?location=${location}&time=${time}&nutrient=${sort.nutrient}&sort=${sort.value}`)
        .then((res) => (res.json()))
        .then((data) => {setFoodItems(data)})
        console.log(fooditems)
        console.log(sort)
    }, [location, time, sort])

    return (
      <SnackbarProvider maxSnack={3}>
        <Box className="flex flex-col h-screen bg-white">
            <Box className="bg-[#be030f] p-2">
              <h1 className="text-3xl text-white font-medium">MyFitnessTerrier</h1>
            </Box>
            <Box className="flex flex-grow overflow-auto">
              <Box className="bg-white w-[16.5%] pt-4 h-full">
                <Card className="m-2">
                  <Box className="p-4">
                    <TextField select label="Dining Hall" onChange={(e) => {setLocation(e.target.value.toLowerCase())}} defaultValue="Warren" helperText="Select your choice dining hall.">
                      {['Warren', 'West', 'Marciano', 'Granby', 'Fenway'].map((option) => (
                        <MenuItem key={option} value={option}>
                          <h1 className="font-body">{option}</h1>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Box className="p-4">
                    <TextField select label="Mealtime" onChange={(e) => {setTime(e.target.value.toLowerCase())}} defaultValue="Breakfast" helperText="Select your mealtime.">
                      {['Breakfast', 'Lunch', 'Brunch', 'Dinner'].map((option) => (
                        <MenuItem key={option} value={option}>
                          <h1 className="font-body">{option}</h1>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  
                  <Box className="pb-10 pr-2 pl-2">
                      <ToggleButtonGroup size="small" orientation="vertical" value={sort.nutrient} exclusive onChange={(event: React.MouseEvent<HTMLElement>, next: string) => {setSorted({value: sort.value, nutrient: next.toLowerCase().replace(" ", "")})}}>
                        <Box className="grid grid-cols-2 gap-2">
                          {['Calories', 'Total Fat', 'Saturated Fat', 'Trans Fat', 'Cholesterol', 'Sodium', 'Total Carbohydrate', 'Dietary Fiber', 'Sugars', 'Protein'].map((item) => (
                          <ToggleButton value={item} key ={item}>
                            <Box className={sort.nutrient == item.toLowerCase().replace(" ", "") ? "text-red-500 text-xs" : "text-xs"}>
                              {item}
                            </Box>
                          </ToggleButton>
                        
                      ))}
                        </Box>
                      
                    </ToggleButtonGroup>
                    <Box className="pt-2 border-black border-3">
                      <Button variant="outlined" color="error" className="w-full text-red-100" onClick={() => {
                                              setIndex((sortOptionIndex + 1) % 3)
                                              setSorted({value: sortOptions[sortOptionIndex], nutrient: sort.nutrient})
                                            }
                                      }>{sort.value === -1 ? 'High to Low' : sort.value === 1 ? 'Low to High' : 'No Order'}</Button>
                    </Box>
                  </Box>
                </Card>
              </Box>
              <Box className="pt-5 w-[50.5%] bg-white flex flex-col">
                <Box className="w-full">
                  <h1 className="text-black text-xl pb-3 bg-white font-medium">Menu</h1>
                </Box>
                <Divider/>
                <Box className="overflow-y-auto">
                  <Box>
                    <ul>
                        {fooditems?.map((item) => (
                              <AddToCartButton item={item}/>
                        ))}
                    </ul>
                  </Box>
                </Box>
              </Box>
              <Box className="flex flex-col w-[33%]">
                <Box className="flex flex-col pt-5 text-black h-[59%]">
                  <Box>
                    <h1 className="text-center text-xl pb-3 font-medium">Cart</h1>
                  </Box>
                  <Divider/>
                  <Box className="overflow-auto">
                  {cartInfo.map((item) => (
                    <h1 key = {item._id.toString()}>
                      <RemoveFromCartButton item={item}/>
                    </h1>
                  ))}
                  </Box>
                </Box>
                <Box className="font-body text-black w-full text-center">
                  <h1 className="text-xl pb-3">Nutrition</h1>
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
                </Box>
              </Box>
            </Box>
        </Box>
        </SnackbarProvider>
    )
}

export default Food;