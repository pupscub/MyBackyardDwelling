import os
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# def create_folders(towns: list[str]) -> None:
#     for town in towns:
#         # os.makedirs(f"data/towns/{town}", exist_ok=True)


if __name__ == "__main__":
    # Get the list of towns from the txt file
    towns_in_ma = [
    "Abington", "Acton", "Acushnet", "Adams", "Agawam", "Alford", "Amesbury", "Amherst", "Andover", "Arlington", "Ashburnham", "Ashby", "Ashfield", "Ashland", "Athol", "Attleboro", "Auburn", "Avon", "Ayer",
    "Baldwinville", "Barnstable", "Barre", "Becket", "Bedford", "Belchertown", "Bellingham", "Belmont", "Berkley", "Berlin", "Bernardston", "Beverly", "Billerica", "Blackstone", "Blandford", "Bolton", "Bondsville", "Boxborough", "Boxford", "Boylston", "Braintree", "Brewster", "Bridgewater", "Brimfield", "Brookfield", "Brookline", "Buckland", "Burlington", "Buzzards Bay",
    "Cambridge", "Canton", "Carlisle", "Carver", "Charlemont", "Charlton", "Chatham", "Chelmsford", "Chelsea", "Cheshire", "Chester", "Chesterfield", "Chicopee", "Chilmark", "Clinton", "Cohasset", "Colrain", "Concord", "Conway", "Cummington",
    "Dalton", "Danvers", "Dartmouth", "Dedham", "Deerfield", "Dennis", "Dennis Port", "Douglas", "Dover", "Dracut", "Dudley", "Dunstable", "Duxbury",
    "East Bridgewater", "East Brookfield", "East Dennis", "East Falmouth", "East Longmeadow", "East Sandwich", "Eastham", "Easthampton", "Easton", "Edgartown", "Erving", "Essex",
    "Fairhaven", "Falmouth", "Fiskdale", "Foxborough", "Framingham", "Franklin", "Freetown",
    "Gardner", "Georgetown", "Gill", "Gloucester", "Goshen", "Grafton", "Granby", "Granville", "Great Barrington", "Greenfield", "Groton", "Groveland",
    "Hadley", "Halifax", "Hamilton", "Hampden", "Hanover", "Hanson", "Hardwick", "Harvard", "Harwich", "Hatfield", "Heath", "Hingham", "Hinsdale", "Holbrook", "Holden", "Holland", "Holliston", "Hopedale", "Hopkinton", "Housatonic", "Hubbardston", "Hudson", "Hull", "Huntington",
    "Lakeville", "Lanesborough", "Lee", "Lenox", "Leverett", "Leyden", "Lincoln", "Littleton", "Longmeadow", "Ludlow", "Lunenburg", "Lynnfield",
    "Malden", "Manchester-by-the-Sea", "Mansfield", "Marblehead", "Marion", "Marshfield", "Mashpee", "Mattapoisett", "Maynard", "Medfield", "Medway", "Mendon", "Merrimac", "Middleborough", "Middlefield", "Middleton", "Milford", "Millbury", "Millis", "Millville", "Milton", "Monroe", "Monson", "Montague", "Monterey", "Montgomery",
    "Nahant", "Nantucket", "Natick", "Needham", "New Ashford", "New Braintree", "New Salem", "Newbury", "Newburyport", "Newton", "Norfolk", "North Andover", "North Attleboro", "North Brookfield", "North Eastham", "North Falmouth", "North Pembroke", "North Reading", "North Scituate", "Northborough", "Northbridge", "Northfield", "Norton", "Norwell", "Norwood",
    "Oak Bluffs", "Oakham", "Ocean Bluff", "Onset", "Orange", "Orleans", "Otis", "Oxford",
    "Palmer", "Paxton", "Pembroke", "Pepperell", "Petersham", "Pinehurst", "Plainfield", "Plainville", "Plymouth", "Plympton", "Pocasset", "Princeton", "Provincetown",
    "Randolph", "Raynham", "Reading", "Rehoboth", "Richmond", "Rochester", "Rockland", "Rockport", "Rowe", "Rowley", "Royalston", "Russell",
    "Salisbury", "Sandisfield", "Sandwich", "Saugus", "Savoy", "Scituate", "Seekonk", "Sharon", "Sheffield", "Shelburne", "Sherborn", "Shirley", "Shrewsbury", "Shutesbury", "Somerset", "South Hadley", "Southampton", "Southborough", "Southbridge", "Southwick", "Spencer", "Sterling", "Stockbridge", "Stoneham", "Stoughton", "Stow", "Sturbridge", "Sudbury", "Sunderland", "Sutton", "Swampscott", "Swansea",
    "Taunton", "Templeton", "Tewksbury", "Tisbury", "Tolland", "Topsfield", "Townsend", "Truro", "Tyngsborough", "Tyringham",
    "Upton", "Uxbridge",
    "Wakefield", "Wales", "Walpole", "Ware", "Wareham", "Warren", "Warwick", "Washington", "Watertown", "Wayland", "Webster", "Wellesley", "Wellfleet", "Wendell", "Wenham", "West Bridgewater", "West Brookfield", "West Boylston", "Westhampton", "Westminster", "West Newbury", "Weston", "Westport", "West Roxbury", "West Springfield", "West Stockbridge", "Westwood", "Weymouth", "Whately", "Whitman", "Wilbraham", "Williamsburg", "Williamstown", "Wilmington", "Winchendon", "Winchester", "Windsor", "Winthrop", "Woburn", "Worcester", "Worthington", "Yarmouth"
    ]
    
    with open("data/", "w") as f:
        for town in towns_in_ma:
            f.write(f"{town}"+"\n")


    
    # print("Creating database...")
    # create_folders(towns_in_ma)
    # print("Database created successfully.")
