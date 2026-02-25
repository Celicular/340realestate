import firebase_admin
from firebase_admin import credentials, firestore
import requests
from bs4 import BeautifulSoup
import datetime
import pprint

# Load Firebase Admin credentials
cred = credentials.Certificate('./firestore-scripts/serviceAccountKey.json')

# Initialize Firebase Admin
try:
    app = firebase_admin.get_app('flexmls_importer')
except ValueError:
    app = firebase_admin.initialize_app(cred, name='flexmls_importer')

db = firestore.client(app=app)

def extract_details_from_link1(url):
    """Parses Map Listing Preview"""
    print(f"Fetching Map Preview Link...")
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    images = []
    # Find all image links in the slideshow
    for a in soup.select('.previewSlideshow a.rsImg'):
        if a.has_attr('href'):
            images.append(a['href'])
            
    price_el = soup.select_one('.t-title--larger')
    price = price_el.text.strip() if price_el else ""
    
    address_el = soup.select_one('.lc-address')
    address = address_el.text.strip() if address_el else ""
    
    return {
        'images': images,
        'price': price,
        'location': address
    }

def extract_details_from_link2(url):
    """Parses Detailed Property Report"""
    print(f"Fetching Detailed Report Link...")
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    details = {}
    lines = soup.select('.listing-detail-field-line, .listingDetailFieldLine')
    for line in lines:
        label_el = line.select_one('.listing-detail-field-label')
        if label_el:
            label = label_el.text.strip()
            # Extract out the label from the field to just leave the value
            label_el.decompose()
            value = line.text.strip()
            details[label] = value
            
    return details

def extract_ids_from_url(url):
    import re
    # Extract shared_link_id and listing_id
    # Example URL: https://my.flexmls.com/TamelaDonnelly/search/shared_links/DVLw7/listings/20251122160943181749000000/report/general?newRoute=true
    # Or: https://my.flexmls.com/TamelaDonnelly/search/shared_links/DVLw7/map/listing_preview?listing_id=20251122160943181749000000
    
    shared_link_match = re.search(r'/shared_links/([^/]+)/', url)
    listing_id_match = re.search(r'(?:listing_id=|/listings/)(\d+)', url)
    
    if not shared_link_match or not listing_id_match:
        raise ValueError("Could not extract shared_link_id or listing_id from the URL.")
        
    return shared_link_match.group(1), listing_id_match.group(1)

def main():
    print("="*80)
    print("FLEXMLS PROPERTY IMPORTER")
    print("="*80)
    
    input_url = input("Enter Any Flexmls Link for the Property: ").strip()
    if not input_url:
        print("A URL is required.")
        return
        
    try:
        shared_link_id, listing_id = extract_ids_from_url(input_url)
        print(f"Detected Shared Link ID: {shared_link_id}")
        print(f"Detected Listing ID: {listing_id}")
        
        # Construct the URLs
        base_path = f"https://my.flexmls.com/TamelaDonnelly/search/shared_links/{shared_link_id}"
        link1 = f"{base_path}/map/listing_preview?listing_id={listing_id}"
        link2 = f"{base_path}/listings/{listing_id}/report/general?newRoute=true"
        
        data1 = extract_details_from_link1(link1)
        data2 = extract_details_from_link2(link2)
    except Exception as e:
        print(f"Error fetching/parsing links: {e}")
        return
        
    # --- Map extracted data to schema --- 
    price = data2.get('Current Price', data1.get('price', ''))
    beds_str = data2.get('Total Bedrooms', '0')
    baths_str = data2.get('Total Bathrooms', '0')
    pool_str = data2.get('Pool', 'No').lower()
    has_pool = 'yes' in pool_str or 'true' in pool_str
    
    location = data1.get('location', '')
    title = location.split(',')[0].strip() if location else 'New Property'
    description = data2.get('Public Remarks', '')
    
    # Clean beds, baths, sf so they are numbers if possible
    beds = 0
    try:
        beds = int(float(beds_str.replace('+', '')))
    except:
        beds = beds_str # fallback
        
    baths = 0.0
    try:
        baths = float(baths_str)
    except:
        baths = baths_str

    sqft_str = data2.get('Total SqFt. (+/-)', '')
    if isinstance(sqft_str, str):
        sqft_str = sqft_str.replace(',', '')
    try:
        sqft = float(sqft_str)
    except:
        sqft = sqft_str

    # Prepare Schema matching exactly what user requested, adding root-level properties typically needed by frontend
    doc_ref = db.collection('residentialPortfolio').document()
    
    property_type_input = input("Enter property type (default: residential - single family): ").strip()
    if not property_type_input:
        property_type_input = 'residential - single family'

    property_data = {
        'id': doc_ref.id,
        'subcategory': property_type_input.lower(),
        'overview': {
            'lotSizeAcres': data2.get('Lot Size In Acreage', ''),
            'lotSizeSqFt': data2.get('Lot Size In SqFt', ''),
            'grade': data2.get('Grade', ''),
        },
        'category': 'residential',
        'description': description,
        
        # Adding to root to match PortfolioItemForm exactly.
        'bedrooms': beds,
        'bathrooms': baths,
        'squareFeet': sqft,
        'hasPool': has_pool,
        
        'features': {
            'beds': beds,
            'baths': baths,
            'pool': has_pool,
            'type': data2.get('StandardStatus', 'Active')
        },
        'updatedBy': {
            'email': 'flexmls-importer@system.local', 
            'name': 'Flexmls Automated Importer'
        },
        'details': {
            'MLSListDate': data2.get('List Date', ''),
            'zoning': data2.get('Zoning', ''),
            'roadAssessmentYear': data2.get('Road Assessment Year', '')
        },
        'propertyType': property_type_input,
        'price': price,
        'updatedAt': datetime.datetime.now(datetime.timezone.utc),
        'amenities': [],
        'propertyDetails': None,
        'source': 'flexmls',
        'createdAt': datetime.datetime.now(datetime.timezone.utc),
        'showPackageDetails': False,
        'location': {
            'address': location,
            'country': data2.get('Country', 'US'),
            'latitude': '',
            'longitude': ''
        },
        'title': title,
        'images': data1.get('images', []),
        'status': 'for-sale',
        'collection': 'residentialPortfolio'
    }
    
    print("\n" + "="*80)
    print("--- SANITIZED PREVIEW ---")
    print("="*80)
    pprint.pprint(property_data, indent=2, sort_dicts=False)
    
    confirm = input("\nDoes this look correct? Upload to Firebase? (y/n): ").strip().lower()
    
    if confirm in ('y', 'yes'):
        try:
            doc_ref.set(property_data)
            print(f"SUCCESS! Property uploaded securely with ID: {doc_ref.id}")
        except Exception as e:
            print(f"Failed to upload: {e}")
    else:
        print("Upload cancelled.")

if __name__ == '__main__':
    main()
