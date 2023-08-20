import requests

url = "https://geocoding.geo.census.gov/geocoder/v2/geocode?location=38.8976,-77.0365&format=json"
response = requests.get(url)
print(response.text)