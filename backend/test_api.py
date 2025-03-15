import requests
import json

# Define the base URL for the API
BASE_URL = "http://localhost:5000/api"

# Test the health endpoint
def test_health():
    print(f"Testing health endpoint: {BASE_URL}/health")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {str(e)}")
    print("-" * 50)

# Test the submit-property endpoint
def test_submit_property():
    url = f"{BASE_URL}/submit-property"
    
    # Test data
    data = {
        "firstName": "Test",
        "lastName": "User",
        "address": "123 Main St, Boston, MA",
        "email": "test@example.com"
    }
    
    print(f"Sending POST request to {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        # Send the request
        response = requests.post(url, json=data)
        
        # Print status code
        print(f"Status code: {response.status_code}")
        
        # Try to parse response as JSON
        try:
            result = response.json()
            print(f"Response JSON: {json.dumps(result, indent=2)}")
            return result
        except json.JSONDecodeError:
            print("Error: Could not parse response as JSON")
            print(f"Response text: {response.text[:500]}...")  # Show first 500 chars
            return None
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Is it running?")
        return None
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

# Test the get-submissions endpoint (admin)
def test_get_submissions():
    print(f"Testing get-submissions endpoint: {BASE_URL}/admin/submissions")
    try:
        response = requests.get(f"{BASE_URL}/admin/submissions")
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {str(e)}")
    print("-" * 50)

# Run the test
if __name__ == "__main__":
    print("Testing API endpoints...")
    test_health()
    
    result = test_submit_property()
    
    if result and result.get("success"):
        print("\nTest successful! ✓")
        
        # Now test the property-analysis endpoint if we got a user ID
        if "user" in result and "id" in result["user"]:
            user_id = result["user"]["id"]
            analysis_url = f"{BASE_URL}/property-analysis/{user_id}"
            print(f"\nTesting analysis endpoint: {analysis_url}")
            
            try:
                analysis_response = requests.get(analysis_url)
                print(f"Status code: {analysis_response.status_code}")
                
                try:
                    analysis_result = analysis_response.json()
                    print(f"Analysis response: {json.dumps(analysis_result, indent=2)[:500]}...")
                except json.JSONDecodeError:
                    print("Error: Could not parse analysis response as JSON")
                    print(f"Response text: {analysis_response.text[:500]}...")
            except Exception as e:
                print(f"Error testing analysis endpoint: {str(e)}")
    else:
        print("\nTest failed! ✗")
        
    test_get_submissions()
    print("Tests completed!") 