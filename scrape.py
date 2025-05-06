import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime

date = datetime.today().strftime('%Y-%m-%d')

food_dict = {}
food_dict['locations'] = []


if True:
    locations = ['warren', 'west', 'marciano', 'granby']
    i = 0
    for location in locations:
        food_dict['locations'].extend([{"name": location, "mealtimes": []}])
        url = 'https://www.bu.edu/dining/location/' + location + '/#menu'
        page = requests.get(url)
        soup = BeautifulSoup(page.content, 'html.parser')
        today_menu = soup.find("ol", attrs={'data-menudate':date})
        mealtimes = ['breakfast', 'brunch', 'lunch', 'dinner']
        j = 0
        for time in mealtimes:
            today_meal = today_menu.find("li", class_="js-meal-period-" + time)
            if today_meal is not None:
                food_dict['locations'][i]['mealtimes'].extend([{'meal': time, 'items': []}])
                meals = today_meal.find_all("li", class_="menu-item")
                k = 0
                for meal in meals:
                    name = meal.find("h4", class_="menu-item-title")
                    table = meal.find("table", class_="nutrition-label")
                    if table is not None:
                        food_dict['locations'][i]['mealtimes'][j]['items'].extend([{'name': name.get_text().replace("\'", ""), 'nutrients': [{}]}])
                        sections = table.find_all("tr", class_=["nutrition-label-section", "nutrition-label-subsection"])
                        for section in sections:
                            nutrient = section.find("td", class_="nutrition-label-nutrient")
                            amount = section.find("td", class_="nutrition-label-amount")
                            food_dict['locations'][i]['mealtimes'][j]['items'][k]['nutrients'][0][nutrient.get_text()] = amount.get_text().replace("g", "").replace("m", "")
                        k += 1
                j += 1
        i += 1
                            
    food_dict['locations'].extend([{"name": 'fenway', "mealtimes": []}])

    url = 'https://bufenway.sodexomyway.com/en-us/locations/the-fenway-dining-hall'
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')

    # content script
    content = soup.find("script", string=re.compile(r"window.__PRELOADED_STATE__"))

    script_content = content.string

    match = re.search(r"window.__PRELOADED_STATE__\s*=\s*(\{.*\})", script_content)

    if match:
        i = 0
        js_object_str = match.group(1)
        preloaded_state = json.loads(js_object_str)
        sections = preloaded_state['composition']['subject']['regions'][1]['fragments'][0]['content']['main']['sections']
        for section in sections:
            food_dict['locations'][4]['mealtimes'].extend([{'meal': section['name'].lower(), 'items': []}])
            for group in section['groups']:
                for item in group['items']:
                    food_dict['locations'][4]['mealtimes'][i]['items'].extend(
                    [{
                        "name": item['formalName'],
                        "nutrients": [
                            {
                                "Calories": item['calories'],
                                "Total Fat": item['fat'].replace("g", ""),
                                "Saturated Fat": item['saturatedFat'].replace("g", ""),
                                "Trans Fat": item['transFat'].replace("g", ""),
                                "Cholesterol": item['cholesterol'].replace("mg", ""),
                                "Sodium": item['sodium'].replace("mg", ""),
                                "Total Carbohydrate": item['carbohydrates'].replace("g", ""),
                                "Dietary Fiber": item['dietaryFiber'].replace("g", ""),
                                "Sugars": item['sugar'].replace("g", ""),
                                "Protein": item['protein'].replace("g", "")
                            }
                        ]
                    }])
            i += 1
    else:
        print("__PRELOADED_STATE__ not found.")

print(food_dict)