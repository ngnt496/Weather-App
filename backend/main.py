from fastapi import FastAPI
import requests
import tomllib

with open("config.toml", "rb") as f:
    config = tomllib.load(f)
API_KEY = config["api"]["api_key"]

url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]?key={API_KEY}"


app = FastAPI()

@app.get("/")
def main():
    return {"message": "Hello, World!"}


@app.get("/weather/{city}")
def get_weather(city: str):
    data = requests.get(url.replace("[location]", city))
    return {"city": city, "temperature": data.json()["currentConditions"]["temp"], "condition": data.json()["currentConditions"]["conditions"]}


