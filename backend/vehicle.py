import requests

def is_electric_vehicle(make, model, year):
    # Construct the API endpoint URL
    url = f"https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/{make}/modelyear/{year}?format=json"
    
    # Make the API request
    response = requests.get(url)
    
    if response.status_code != 200:
        print("Error: Unable to fetch data from NHTSA API.")
        return None
    
    data = response.json()
    
    if not data['Results']:
        print("No results found for the given make, model, and year.")
        return None
    
    for vehicle in data['Results']:
        if vehicle['Model_Name'].lower() == model.lower():
            # Use another endpoint to get detailed vehicle information
            vehicle_info_url = f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/{vehicle['Model_ID']}?format=json"
            vehicle_response = requests.get(vehicle_info_url)
            if vehicle_response.status_code == 200:
                vehicle_data = vehicle_response.json()
                if 'Results' in vehicle_data and len(vehicle_data['Results']) > 0:
                    fuel_type = vehicle_data['Results'][0].get('FuelTypePrimary', '')
                    if 'electric' in fuel_type.lower():
                        return True
                    else:
                        return False
    return None

# Example usage
make = "Tesla"
model = "Model 3"
year = "2020"

is_electric = is_electric_vehicle(make, model, year)
if is_electric is None:
    print("Unable to determine if the vehicle is electric.")
elif is_electric:
    print(f"The {year} {make} {model} is an electric vehicle.")
else:
    print(f"The {year} {make} {model} is not an electric vehicle.")
