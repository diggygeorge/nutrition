import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
import pymongo

from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env.local")

database_url = os.getenv("MONGODB_URI")
print(database_url)
myclient = pymongo.MongoClient(database_url)
mydb = myclient["dininghall"]
mycollection = mydb["food"]

date = datetime.today().strftime('%Y-%m-%d')

food_list = []

# Finds foods and their nutrition values for warren, west, marciano, and granby.
locations = ['warren', 'west', 'marciano', 'granby']
loc_index = 0
for location in locations:
    url = 'https://www.bu.edu/dining/location/' + location + '/#menu'
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    today_menu = soup.find("ol", attrs={'data-menudate':date})
    mealtimes = ['breakfast', 'brunch', 'lunch', 'dinner']
    time_index = 0
    for time in mealtimes:
        today_meal = today_menu.find("li", class_="js-meal-period-" + time)
        if today_meal is not None:
            meals = today_meal.find_all("li", class_="menu-item")
            meal_index = 0
            for meal in meals:
                name = meal.find("h4", class_="menu-item-title")
                table = meal.find("table", class_="nutrition-label")
                if table is not None:
                    item_dict = {
                        'name': name.get_text().replace("\'", ""),
                        'location': location,
                        'mealtime': time
                    }
                    sections = table.find_all("tr", class_=["nutrition-label-section", "nutrition-label-subsection"])
                    for section in sections:
                        nutrient = section.find("td", class_="nutrition-label-nutrient")
                        amount = section.find("td", class_="nutrition-label-amount")
                        item_dict[nutrient.get_text().lower().replace(" ", "")]= float(amount.get_text().replace("g", "").replace("m", ""))
                    food_list.extend([item_dict])
                    meal_index += 1
            print(location + "'s " + time + " items updated!")
            time_index += 1
    loc_index += 1

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
                food_list.extend([{
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
                    'protein': float(item['protein'].replace("g", "")) if item['protein'] != "" else 0.0
                }])
        fenway_time_index += 1
else:
    print("__PRELOADED_STATE__ not found.")

# Deletes the old data in the collection and replaces it with the new one.
x = mycollection.delete_many({})
print(x.deleted_count, " documents deleted.")
x = mycollection.insert_many(food_list)
print("Data updated successfully!")