import requests
import json

API_URL = "http://localhost:5001/api/submit-property"

# Test data
test_data = {
    "firstName": "Test",
    "lastName": "User",
    "address": "123 Test Street, Boston, MA",
    "email": "test@example.com"
}

def test_submit_property():
    print("Testing property submission API...")
    print(f"Sending data: {json.dumps(test_data, indent=2)}")
    
    try:
        response = requests.post(API_URL, json=test_data)
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200 or response.status_code == 201:
            result = response.json()
            print(f"Success! Response data: {json.dumps(result, indent=2)}")
            
            if "redirect" in result:
                print(f"Redirect URL: {result['redirect']}")
                
                # Test the property analysis endpoint
                user_id = result["user"]["id"]
                print(f"\nTesting property analysis API for user ID: {user_id}")
                
                analysis_url = f"http://localhost:5001/api/property-analysis/{user_id}"
                analysis_response = requests.get(analysis_url)
                
                print(f"Analysis response status code: {analysis_response.status_code}")
                
                if analysis_response.status_code == 200:
                    analysis_result = analysis_response.json()
                    print(f"Analysis data available: {bool(analysis_result.get('analysis'))}")
                else:
                    print(f"Error retrieving analysis: {analysis_response.text}")
            
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return False

if __name__ == "__main__":
    test_submit_property() 