import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
import pymongo
# from dotenv import load_dotenv
import os

# load_dotenv(dotenv_path=".env.local")
database_url = "mongodb+srv://diggygeorge:FalzarGaming@cluster0.dnnyvow.mongodb.net/dininghalls?retryWrites=true&w=majority&appName=Cluster0&authSource=admin"
myclient = pymongo.MongoClient(database_url)
mydb = myclient["dininghall"]
mycollection = mydb["food"]

date = datetime.today().strftime('%m/%d/%Y')
print(date)

food_list = []

r = requests.get("https://www.bu.edu/phpbin/dining/api/full/")
data = r.json()
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
url = 'https://bufenway.sodexomyway.com/en-us/locations/the-fenway-dining-hall'
page = requests.get(url)
soup = BeautifulSoup(page.content, 'html.parser')

# content script
content = soup.find("script", string=re.compile(r"window.__PRELOADED_STATE__"))

script_content = content.string

match = re.search(r"window.__PRELOADED_STATE__\s*=\s*(\{.*\})", script_content)

if match:
    fenway_time_index = 0
    js_object_str = match.group(1)
    preloaded_state = json.loads(js_object_str)
    sections = preloaded_state['composition']['subject']['regions'][1]['fragments'][0]['content']['main']['sections']
    for section in sections:
        for group in section['groups']:
            for item in group['items']:
                description_dict = {
                    'name': item['formalName'].replace("\'", ""),
                    'location': 'fenway',
                    'mealtime': section['name'].lower(),
                    "calories": float(item['calories']) if item['calories'] != "" else 0.0,
                    'totalfat': float(item['fat'].replace("g", "")) if item['fat'] != "" else 0.0,
                    'saturatedfat': float(item['saturatedFat'].replace("g", "")) if item['saturatedFat'] != "" else 0.0,
                    'transfat': float(item['transFat'].replace("g", "")) if item['transFat'] != "" else 0.0,
                    'cholesterol': float(item['cholesterol'].replace("mg", "")) if item['cholesterol'] != "" else 0.0,
                    'sodium': float(item['sodium'].replace("mg", "")) if item['sodium'] != "" else 0.0,
                    'totalcarbohydrate': float(item['carbohydrates'].replace("g", "")) if item['carbohydrates'] != "" else 0.0,
                    'dietaryfiber': float(item['dietaryFiber'].replace("g", "")) if item['dietaryFiber'] != "" else 0.0,
                    'sugars': float(item['sugar'].replace("g", "")) if item['sugar'] != "" else 0.0,
                    'protein': float(item['protein'].replace("g", "")) if item['protein'] != "" else 0.0,
                    'description': item['description'],
                    'ingredients': "",
                    'station': item['course'].title(),
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
                        
                        
                        
                food_list.extend([description_dict])

        fenway_time_index += 1
else:
    print("__PRELOADED_STATE__ not found.")

print(food_list)

# Deletes the old data in the collection and replaces it with the new one.
x = mycollection.delete_many({})
print(x.deleted_count, " documents deleted.")
x = mycollection.insert_many(food_list)
print("Data updated successfully!")