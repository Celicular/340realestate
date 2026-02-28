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
    app = firebase_admin.get_app('flexmls_land_importer')
except ValueError:
    app = firebase_admin.initialize_app(cred, name='flexmls_land_importer')

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
    print("FLEXMLS LAND PROPERTY IMPORTER")
    print("="*80)
    
    input_url = input("Enter Any Flexmls Link for the Land Property: ").strip()
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
        
    # --- Map extracted data to landPortfolio schema --- 
    price = data2.get('Current Price', data1.get('price', ''))
    
    location = data1.get('location', '')
    title = location.split(',')[0].strip() if location else 'New Land Property'
    description = data2.get('Public Remarks', '')
    
    # Extract lot size
    lot_size_acres_str = data2.get('Lot Size In Acreage', '0')
    lot_size_sqft_str = data2.get('Lot Size In SqFt', '0')
    
    lot_size_acres = 0
    try:
        lot_size_acres = float(lot_size_acres_str.replace(',', '') if isinstance(lot_size_acres_str, str) else lot_size_acres_str)
    except:
        lot_size_acres = 0
        
    lot_size_sqft = 0
    try:
        lot_size_sqft = float(lot_size_sqft_str.replace(',', '') if isinstance(lot_size_sqft_str, str) else lot_size_sqft_str)
    except:
        lot_size_sqft = 0

    # Extract views if available
    views_str = data2.get('View', '')
    views = [v.strip() for v in views_str.split(',') if v.strip()] if views_str else []
    
    # Extract hurricane damage info
    hurricane_str = data2.get('Hurricane Damage', 'No').lower()
    hurricane_damaged = 'yes' in hurricane_str or 'true' in hurricane_str
    hurricane_damage_source = data2.get('Hurricane Damage Source', None)
    
    # Extract waterfront
    waterfront = data2.get('Waterfront', 'N')
    
    # Extract zoning
    zoning = data2.get('Zoning', '')
    
    # Extract restrictions
    restrictions = data2.get('Deed Restrictions', '')
    
    # Extract financing
    financing = data2.get('Financing', 'Cash')
    
    # Extract intended use
    intended_use = data2.get('Intended Use', 'Residential')
    
    # Extract improvements
    improvements = data2.get('Improvements', None)
    
    # Extract access
    access = data2.get('Access', 'of record')
    
    # Prepare Schema matching landPortfolio collection
    doc_ref = db.collection('landPortfolio').document()
    
    mls_number = input("Enter MLS Number (optional): ").strip() or None

    property_data = {
        'id': doc_ref.id,
        'type': 'Land',
        'category': 'land',
        'subcategory': 'land',
        'source': 'flexmls',
        'status': 'for-sale',
        'collection': 'landPortfolio',
        
        'title': title,
        'description': description,
        'price': price,
        
        'overview': {
            'beds': 0,
            'baths': 0,
            'sqft': 0,
            'lotSizeAcres': lot_size_acres,
            'lotSizeSqFt': int(lot_size_sqft) if lot_size_sqft else 0,
            'grade': data2.get('Grade', ''),
            'yearBuilt': None,
            'hurricaneDamaged': hurricane_damaged,
            'hurricaneDamageSource': hurricane_damage_source,
            'view': views,
        },
        
        'location': {
            'address': location,
            'country': data2.get('Country', 'US'),
            'latitude': None,
            'longitude': None,
            'subdivision': data2.get('Subdivision', ''),
            'quarter': data2.get('Quarter', ''),
        },
        
        'details': {
            'zoning': zoning,
            'waterfront': waterfront,
            'restrictions': restrictions,
            'financing': financing,
            'intendedUse': intended_use,
            'improvements': improvements,
            'access': access,
            'roadAssessment': 0,
            'roadAssessmentYear': datetime.datetime.now().year,
            'documents': [],
            'thirdPartyApproval': False,
            'improvedProperty': bool(improvements),
            'bankOwned': False,
            'easements': data2.get('Easements', 'of record'),
            'assocFee': 0,
            'assocYear': datetime.datetime.now().year,
            'hoaDues': 0,
            'stampTax': 'Split 50/50',
        },
        
        'features': {},
        'images': data1.get('images', []),
        'amenities': [],
        
        'updatedBy': {
            'email': 'flexmls-importer@system.local', 
            'name': 'Flexmls Automated Importer'
        },
        'createdAt': datetime.datetime.now(datetime.timezone.utc),
        'updatedAt': datetime.datetime.now(datetime.timezone.utc),
    }
    
    # Add MLS if provided
    if mls_number:
        property_data['mls'] = mls_number
    
    print("\n" + "="*80)
    print("--- SANITIZED PREVIEW (LAND PORTFOLIO) ---")
    print("="*80)
    pprint.pprint(property_data, indent=2, sort_dicts=False)
    
    confirm = input("\nDoes this look correct? Upload to Firebase? (y/n): ").strip().lower()
    
    if confirm in ('y', 'yes'):
        try:
            doc_ref.set(property_data)
            print(f"SUCCESS! Land Property uploaded securely with ID: {doc_ref.id}")
            print(f"Collection: landPortfolio")
        except Exception as e:
            print(f"Failed to upload: {e}")
    else:
        print("Upload cancelled.")

if __name__ == '__main__':
    main()
