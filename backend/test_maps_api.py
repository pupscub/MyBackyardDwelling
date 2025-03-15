import os
import urllib.parse
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_google_maps_api():
    """Test the Google Maps Static API with the API key from .env file"""
    # Get the API key from environment
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    
    if not api_key or api_key == "YOUR_GOOGLE_MAPS_API_KEY":
        print("❌ No valid Google Maps API key found in .env file.")
        print("Please set a valid API key in the GOOGLE_MAPS_API_KEY environment variable.")
        return False
    
    # Test address
    test_address = "1600 Amphitheatre Parkway, Mountain View, CA"
    encoded_address = urllib.parse.quote(test_address)
    
    # Construct the Google Maps Static API URL
    url = f"https://maps.googleapis.com/maps/api/staticmap?center={encoded_address}&zoom=18&size=800x400&maptype=satellite&key={api_key}"
    
    try:
        # Make the request
        response = requests.get(url)
        
        # Check if the request was successful
        if response.status_code == 200:
            print(f"✅ Google Maps API test successful!")
            print(f"Image URL: {url}")
            return True
        else:
            print(f"❌ Google Maps API test failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    
    except Exception as e:
        print(f"❌ Error testing Google Maps API: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing Google Maps Static API...")
    test_google_maps_api() 