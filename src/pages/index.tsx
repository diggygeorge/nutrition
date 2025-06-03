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
import Image from 'next/image';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
                enqueueSnackbar(`${item.name} added!`, {variant: "success"});
                if (cart.get(item._id) === undefined) {
                  cart.set(item._id, 1)
                }
                else {
                  cart.set(item._id, cart.get(item._id) + 1)
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
                console.log(cartInfo)}}>Add</CartButton>
          </AccordionDetails>
        </Accordion>
      </> )
    }

    function RemoveFromCartButton({item}: {item: FoodItem}) {
      const { enqueueSnackbar } = useSnackbar();
      return (
      <Box className="flex justify-between"> <Box className="flex">{item.name} - {item.location.charAt(0).toUpperCase() + item.location.slice(1)} {cart.get(item._id) > 1 ? <p className="pl-1">x{cart.get(item._id)}</p> : <></>}</Box>{cart.get(item._id) !== undefined ? <button className="pl-1" onClick={() => {
                      enqueueSnackbar(`${item.name} removed!`, {variant: "error"});
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
                        if (cart.get(item._id) === 1) {
                          cart.delete(item._id)
                          let index = cartInfo.indexOf(item)
                          cartInfo.splice(index, 1)
                        }
                        else {
                          cart.set(item._id, cart.get(item._id) - 1)
                        }
                    }
                  }> Remove Item</button>
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

    const sortOptions = [-1, 1, 0]
    const [sortOptionIndex, setIndex] = useState(0)
    const [sort, setSorted] = useState({
      value: sortOptionIndex,
      nutrient: ''
    })
    const [isVegetarian, setIsVegetarian] = useState(false)
    const [isVegan, setIsVegan] = useState(false)
    const [isHalal, setIsHalal] = useState(false)
    const [isGlutenfree, setIsGlutenfree] = useState(false)
    const [hasEgg, setHasEgg] = useState(false)
    const [hasFish, setHasFish] = useState(false)
    const [hasMilk, setHasMilk] = useState(false)
    const [hasPeanuts, setHasPeanuts] = useState(false)
    const [hasSesame, setHasSesame] = useState(false)
    const [hasShellfish, setHasShellfish] = useState(false)
    const [hasSoy, setHasSoy] = useState(false)
    const [hasTreenuts, setHasTreenuts] = useState(false)
    const [hasWheat, setHasWheat] = useState(false)

    const ITEM_HEIGHT = 48;
      const ITEM_PADDING_TOP = 8;
      const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
            width: 150,
          },
        },
      };
    const [dietGroup, setDietGroup] = useState<string[]>([])

    const handleDietChange = (event: SelectChangeEvent<typeof dietGroup>) => {
      let {
        target: { value },
      } = event;
      console.log(event.target.value)
      setDietGroup(typeof value === 'string' ? value.split(',') : value);
    };

    useEffect(() => {
      setIsVegan(dietGroup.includes("Vegan"));
      setIsHalal(dietGroup.includes("Halal"));
      setIsVegetarian(dietGroup.includes("Vegetarian"));
      setIsGlutenfree(dietGroup.includes("Gluten Free"));
    }, [dietGroup]);

    const [allergyGroup, setAllergyGroup] = useState<string[]>([])

    const handleAllergyChange = (event: SelectChangeEvent<typeof allergyGroup>) => {
      let {
        target: { value },
      } = event;
      setAllergyGroup(typeof value === 'string' ? value.split(',') : value);
    };

    useEffect(() => {
      setHasEgg(allergyGroup.includes("Egg"));
      setHasFish(allergyGroup.includes("Fish"));
      setHasMilk(allergyGroup.includes("Milk"));
      setHasPeanuts(allergyGroup.includes("Peanuts"));
      setHasSesame(allergyGroup.includes("Sesame"));
      setHasShellfish(allergyGroup.includes("Shellfish"));
      setHasSoy(allergyGroup.includes("Soy"));
      setHasTreenuts(allergyGroup.includes("Tree Nuts"));
      setHasWheat(allergyGroup.includes("Wheat"));
    }, [allergyGroup]);

    useEffect(() => {
        fetch(`/api/getfood?location=${location}&time=${time}&nutrient=${sort.nutrient}&sort=${sort.value}&isVegetarian=${isVegetarian}&isVegan=${isVegan}&isHalal=${isHalal}&isGlutenfree=${isGlutenfree}&noEgg=${hasEgg}&noFish=${hasFish}&noMilk=${hasMilk}&noPeanuts=${hasPeanuts}&noSesame=${hasSesame}&noShellfish=${hasShellfish}&noSoy=${hasSoy}&noTreenuts=${hasTreenuts}&noWheat=${hasWheat}`)
        .then((res) => (res.json()))
        .then((data) => {setFoodItems(data)})
    }, [location, time, sort, isVegetarian, isVegan, isHalal, isGlutenfree, hasEgg, hasFish, hasMilk, hasPeanuts, hasShellfish, hasSoy, hasTreenuts, hasWheat])

    return (
      <SnackbarProvider maxSnack={3}>
      <title>MyFitnessTerrier</title>
        <Box className="flex flex-col h-screen bg-white">
            <Box className="flex bg-[#be030f]">
              <h1 className="text-3xl text-white font-medium p-2">MyFitnessTerrier</h1>
              <Image src="/myfitnessterrierlogo.png" alt="logo" width={50} height={50}></Image>
            </Box>
            <Box className="flex flex-grow overflow-auto">
              <Box className="bg-white w-[18.5%] pt-4 h-full">
                <Card className="m-2">
                  <Box className="pl-2 pr-2 pt-2 pb-2">
                    <TextField className="w-full" select label="Dining Hall" onChange={(e) => {setLocation(e.target.value.toLowerCase())}} defaultValue="Warren">
                      {['Warren', 'West', 'Marciano', 'Granby', 'Fenway'].map((option) => (
                        <MenuItem key={option} value={option}>
                          <h1 className="font-body">{option}</h1>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Box className="pl-2 pr-2 pt-2">
                    <TextField className="w-full" select label="Mealtime" onChange={(e) => {setTime(e.target.value.toLowerCase())}} defaultValue="Breakfast">
                      {['Breakfast', 'Lunch', 'Brunch', 'Dinner'].map((option) => (
                        <MenuItem key={option} value={option}>
                          <h1 className="font-body">{option}</h1>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  
                  <Box className="pb-2 pr-2 pl-2">
                    <Box className="pt-2">
                      <FormControl sx={{width: 1}}>
                        <InputLabel>Select dietary restrictions...</InputLabel>
                        <Select multiple value={dietGroup} onChange={handleDietChange} input={<OutlinedInput label="Diet" />} renderValue = {(selected) => selected.join(", ")} MenuProps={MenuProps}>
                          {["Vegetarian", "Vegan", "Halal", "Gluten Free"].map((item) => (
                            <MenuItem key={item} value={item}>
                              <Checkbox checked={dietGroup.includes(item)}/>
                              <ListItemText primary={item}/>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box className="pt-2 pb-2">
                      <FormControl sx={{width: 1}}>
                        <InputLabel>Select allergies...</InputLabel>
                        <Select multiple value={allergyGroup} onChange={handleAllergyChange} input={<OutlinedInput label="Allergy" />} renderValue = {(selected) => selected.join(", ")} MenuProps={MenuProps}>
                          {["Egg", "Fish", "Milk", "Peanuts", "Sesame", "Shellfish", "Soy", "Tree Nuts", "Wheat"].map((item) => (
                            <MenuItem key={item} value={item}>
                              <Checkbox checked={allergyGroup.includes(item)}/>
                              <ListItemText primary={item}/>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <h1 className="font-body text-center text-gray-500 pb-1">Sort by Nutrient</h1>
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
                                              setIndex((sortOptionIndex) => ((sortOptionIndex + 1) % 3))
                                              console.log(sortOptionIndex)
                                              setSorted({value: sortOptions[sortOptionIndex], nutrient: sort.nutrient})
                                            }
                                      }>{sort.value === -1 ? 'High > Low' : sort.value === 1 ? 'Low > High' : 'No Order'}</Button>
                    </Box>
                  </Box>
                </Card>
              </Box>
              <Box className="pt-5 w-[48.5%] bg-white flex flex-col">
                <Box className="w-full">
                  <h1 className="text-black text-xl pb-3 bg-white font-medium">Menu</h1>
                </Box>
                <Divider/>
                <Box className="overflow-y-auto">
                  <Box>
                    <ul>
                        {fooditems?.map((item) => (
                              <AddToCartButton key = {item._id.toString()} item={item}/>
                        ))}
                    </ul>
                  </Box>
                  {fooditems.length === 0 ? (isVegetarian || isVegan || isHalal || isGlutenfree || hasEgg || hasFish || hasMilk || hasPeanuts || hasSesame || hasShellfish || hasSoy || hasTreenuts || hasWheat) ? <h1 className="font-body text-black pt-4">Sorry, no menu items meet these filters.  Please choose less or different restrictions.</h1> : <h1 className="font-body text-black pt-4">Sorry, there seems to be no menu items at the moment.  Please select a different dining hall or time.</h1> : <></>}
                </Box>
              </Box>
              <Box className="flex flex-col w-[33%]">
                <Box className="flex flex-col pt-5 text-black h-[59%]">
                  <Box>
                    <h1 className="text-center text-xl pb-3 font-medium">Items</h1>
                  </Box>
                  <Divider/>
                  <Box className="overflow-auto pl-2 pr-2">
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
