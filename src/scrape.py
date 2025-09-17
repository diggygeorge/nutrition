import requests
from datetime import datetime
import pymongo
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env.local")
MONGODB_URI = os.getenv("MONGODB_URI")
myclient = pymongo.MongoClient(MONGODB_URI)
mydb = myclient["dininghall"]
mycollection = mydb["food"]

date = datetime.today().strftime('%m/%d/%Y')
print(date)

food_list = []
print("Connecting to BU dining API..")
r = requests.get("https://www.bu.edu/phpbin/dining/api/full/")
data = r.json()
print("Connected to BU Dining API...")
menu = data['menu']
recipes = data['recipes']
meals = menu[date]
for location in meals:
    for mealtime in meals[location]:
        for station in meals[location][mealtime]:
            for item in meals[location][mealtime][station]:
                description_dict = {
                    'name': recipes[item]['name'] if 'name' in recipes[item] and recipes[item]['name'] is not None else "",
                    'location': location.lower(),
                    'mealtime': mealtime.lower(),
                    'calories': round(recipes[item]['calories']) if 'calories' in recipes[item] and recipes[item]['calories'] is not None else 0.0,
                    'totalfat': round(recipes[item]['total_fat']) if 'total_fat' in recipes[item] and recipes[item]['total_fat'] is not None else 0.0,
                    'saturatedfat': round(recipes[item]['saturated_fat']) if 'saturated_fat' in recipes[item] and recipes[item]['saturated_fat'] is not None else 0.0,
                    'transfat': round(recipes[item]['trans_fat']) if 'trans_fat' in recipes[item] and recipes[item]['trans_fat'] is not None else 0.0,
                    'cholesterol': round(recipes[item]['cholesterol']) if 'cholesterol' in recipes[item] and recipes[item]['cholesterol'] is not None else 0.0,
                    'sodium': round(recipes[item]['sodium']) if 'sodium' in recipes[item] and recipes[item]['sodium'] is not None else 0.0,
                    'totalcarbohydrate': round(recipes[item]['carbohydrates']) if 'carbohydrates' in recipes[item] and recipes[item]['carbohydrates'] is not None else 0.0,
                    'dietaryfiber': round(recipes[item]['dietary_fiber']) if 'dietary_fiber' in recipes[item] and recipes[item]['dietary_fiber'] is not None else 0.0,
                    'sugars': round(recipes[item]['sugar']) if 'sugar' in recipes[item] and recipes[item]['sugar'] is not None else 0.0,
                    'protein': round(recipes[item]['protein']) if 'protein' in recipes[item] and recipes[item]['protein'] is not None else 0.0,
                    'description': recipes[item]['description'] if 'description' in recipes[item] and recipes[item]['description'] is not None else "",
                    'ingredients': recipes[item]['ingredients'] if 'ingredients' in recipes[item] and recipes[item]['ingredients'] is not None else "",
                    'station': station,
                    'serving_size': recipes[item]['serving_size'] if 'serving_size' in recipes[item] and recipes[item]['serving_size'] is not None else False,
                    'vegetarian': recipes[item]['is_vegetarian'] if 'is_vegetarian' in recipes[item] and recipes[item]['is_vegetarian'] is not None else False,
                    'vegan': recipes[item]['is_vegan'] if 'is_vegan' in recipes[item] and recipes[item]['is_vegan'] is not None else False,
                    'halal': recipes[item]['is_halal'] if 'is_halal' in recipes[item] and recipes[item]['is_halal'] is not None else False,
                    'gluten-free': recipes[item]['is_glutenfree'] if 'is_glutenfree' in recipes[item] and recipes[item]['is_glutenfree'] is not None else False,
                    'egg': recipes[item]['has_egg'] if 'has_egg' in recipes[item] and recipes[item]['has_egg'] is not None else False,
                    'fish': recipes[item]['has_fish'] if 'has_fish' in recipes[item] and recipes[item]['has_fish'] is not None else False,
                    'milk': recipes[item]['has_milk'] if 'has_milk' in recipes[item] and recipes[item]['has_milk'] is not None else False,
                    'peanuts': recipes[item]['has_peanut'] if 'has_peanut' in recipes[item] and recipes[item]['has_peanut'] is not None else False,
                    'sesame': recipes[item]['has_sesame'] if 'has_sesame' in recipes[item] and recipes[item]['has_sesame'] is not None else False,
                    'shellfish': recipes[item]['has_shellfish'] if 'has_shellfish' in recipes[item] and recipes[item]['has_shellfish'] is not None else False,
                    'soy': recipes[item]['has_soy'] if 'has_soy' in recipes[item] and recipes[item]['has_soy'] is not None else False,
                    'tree-nuts': recipes[item]['has_tree_nuts'] if 'has-tree_nuts' in recipes[item] and recipes[item]['has_tree_nuts'] is not None else False,
                    'wheat': False
                }
                food_list.extend([description_dict])

# Finds foods and their nutritional values for fenway.  Fenway's website is different than the others.

date = datetime.today().strftime('%Y/%m/%d')
print(date)
url = "https://api-prd.sodexomyway.net/v0.2/data/menu/31992001/%20152621"
params = {"date": date}

headers = {
    "Accept": "application/json",
    "API-key": os.getenv("FENWAY_KEY"),
    "Origin": "https://bufenway.sodexomyway.com", 
    "Referer": "https://bufenway.sodexomyway.com/",
}

def is_float(s):
    try:
        float(s)
        return True
    except ValueError:
        return False
print("Requesting from Fenway API...")
resp = requests.get(url, headers=headers, params=params)
print("Response Text:", resp.text)
print(resp.status_code)
fenway_data = resp.json()

for section in fenway_data:
        for group in section['groups']:
            station = group['name']
            for item in group['items']:
                description_dict = {
                    'name': item['formalName'].replace("\'", ""),
                    'location': 'fenway',
                    'mealtime': section['name'].lower(),
                    "calories": float(item['calories']) if is_float(item['calories']) else 0.0,
                    'totalfat': float(item['fat'].replace("g", "")) if is_float(item['fat']) else 0.0,
                    'saturatedfat': float(item['saturatedFat'].replace("g", "")) if is_float(item['saturatedFat']) else 0.0,
                    'transfat': float(item['transFat'].replace("g", "")) if is_float(item['transFat']) else 0.0,
                    'cholesterol': float(item['cholesterol'].replace("mg", "")) if is_float(item['cholesterol']) else 0.0,
                    'sodium': float(item['sodium'].replace("mg", "")) if is_float(item['sodium']) else 0.0,
                    'totalcarbohydrate': float(item['carbohydrates'].replace("g", "")) if is_float(item['carbohydrates']) else 0.0,
                    'dietaryfiber': float(item['dietaryFiber'].replace("g", "")) if is_float(item['dietaryFiber']) else 0.0,
                    'sugars': float(item['sugar'].replace("g", "")) if is_float(item['sugar']) else 0.0,
                    'protein': float(item['protein'].replace("g", "")) if is_float(item['protein']) else 0.0,
                    'description': item['description'],
                    'ingredients': "",
                    'station': station.strip(),
                    'serving_size': item['portion'],
                    'vegetarian': item['isVegetarian'],
                    'vegan': item['isVegan'],
                    'halal': False,
                    'gluten-free': False,
                    'egg': False,
                    'fish': False,
                    'milk': False,
                    'peanuts': False,
                    'sesame': False,
                    'shellfish': False,
                    'soy': False,
                    'tree-nuts': False,
                    'wheat': False
                }
                for allergen in item['allergens']:
                    match allergen['name']:
                        case "Egg":
                            description_dict['egg'] = True
                        case "Fish":
                            description_dict['fish'] = True
                        case "Milk":
                            description_dict['milk'] = True
                        case "Peanut":
                            description_dict['peanuts'] = True
                        case "Sesame":
                            description_dict['sesame'] = True
                        case "Shellfish":
                            description_dict['shellfish'] = True
                        case "Soy":
                            description_dict['soy'] = True
                        case "Treenuts":
                            description_dict['tree-nuts'] = True
                        case "Wheat":
                            description_dict['wheat'] = True
                        case "Gluten":
                            description_dict['gluten-free'] = True
                        
                        
                if description_dict['mealtime'] != 'snack' and description_dict['mealtime'] != 'late night':
                    food_list.extend([description_dict])

print(food_list)

# Deletes the old data in the collection and replaces it with the new one.
x = mycollection.delete_many({})
print(x.deleted_count, " documents deleted.")
x = mycollection.insert_many(food_list)
print("Data updated successfully!")