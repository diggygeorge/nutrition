import requests
from bs4 import BeautifulSoup
import json
import re

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
    food_count = 0
    for section in sections:
        print('--------------- ' + section['name'] + ' ---------------')
        for group in section['groups']:
            for item in group['items']:
                food_count += 1
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
    print(food_count)
else:
    print("__PRELOADED_STATE__ not found.")