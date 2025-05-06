import requests
from bs4 import BeautifulSoup
import json
import re
if True:
    locations = ['warren', 'west', 'marciano', 'granby']
    for location in locations:
        url = 'https://www.bu.edu/dining/location/' + location + '/#menu'
        page = requests.get(url)
        soup = BeautifulSoup(page.content, 'html.parser')
        today_menu = soup.find("ol", attrs={'data-menudate':"2025-05-05"})
        mealtimes = ['breakfast', 'brunch', 'lunch', 'dinner']
        for time in mealtimes:
            today_meal = today_menu.find("li", class_="js-meal-period-" + time)
            if today_meal is not None:
                print("------ " + time.upper() + " ITEMS ------")
                meals = today_meal.find_all("li", class_="menu-item")
                for meal in meals:
                    name = meal.find("h4", class_="menu-item-title")
                    table = meal.find("table", class_="nutrition-label")
                    if table is not None:
                        print("------" + name.get_text() + "------")
                        sections = table.find_all("tr", class_=["nutrition-label-section", "nutrition-label-subsection"])
                        for section in sections:
                            nutrient = section.find("td", class_="nutrition-label-nutrient")
                            amount = section.find("td", class_="nutrition-label-amount")
                            print(nutrient.get_text() + ": " + amount.get_text())
        print(location + "'s items printed!")

    url = 'https://bufenway.sodexomyway.com/en-us/locations/the-fenway-dining-hall'
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')

    # content script
    content = soup.find("script", string=re.compile(r"window.__PRELOADED_STATE__"))

    script_content = content.string

    match = re.search(r"window.__PRELOADED_STATE__\s*=\s*(\{.*\})", script_content)

    if match:
        js_object_str = match.group(1)
        preloaded_state = json.loads(js_object_str)
        sections = preloaded_state['composition']['subject']['regions'][1]['fragments'][0]['content']['main']['sections']
        for section in sections:
            print('--------------- ' + section['name'] + ' ---------------')
            for group in section['groups']:
                for item in group['items']:
                    print(item['formalName'] +
                            ': Calories: ' + item['calories'] +
                            ' - Fat: ' + item['fat'] +
                            ' - Saturated Fat: ' + item['saturatedFat'] +
                            ' - Trans Fat: ' + item['transFat'] +
                            ' - Cholesterol: ' + item['cholesterol'] +
                            ' - Sodium: ' + item['sodium'] +
                            ' - Carbohydrates: ' + item['carbohydrates'] +
                            ' - Dietary Fiber: ' + item['dietaryFiber'] +
                            ' - Sugar: ' + item['sugar'] +
                            ' - Protein: ' + item['protein'] +
                            ' - Potassium: ' + item['potassium'])
        print("Fenway's items printed!")
    else:
        print("__PRELOADED_STATE__ not found.")