import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
from typing import List, Dict
from datetime import datetime

# Load Firebase Admin credentials
cred = credentials.Certificate('./firestore-scripts/serviceAccountKey.json')

# Initialize Firebase Admin
try:
    firebase_admin.delete_app(firebase_admin.get_app('land_properties_list'))
except:
    pass

firebase_admin.initialize_app(cred, name='land_properties_list')

# Get Firestore database instance
db = firestore.client(app=firebase_admin.get_app('land_properties_list'))

def list_land_properties(sort_by_date: bool = True) -> List[Dict]:
    """
    Retrieve all land properties from the landPortfolio collection
    with their document IDs, names, and creation dates.
    
    Args:
        sort_by_date: If True, sort by creation date (oldest first)
    
    Returns:
        List of dictionaries containing property info sorted by date
    """
    properties_list = []
    
    try:
        # Get all documents from the landPortfolio collection
        docs = db.collection('landPortfolio').stream()
        
        for doc in docs:
            doc_id = doc.id
            data = doc.to_dict()
            
            # Extract the name field (could be 'name', 'title', or 'address')
            property_name = data.get('name') or data.get('title') or data.get('address') or 'N/A'
            
            # Get creation date
            created_at = data.get('createdAt')
            if isinstance(created_at, datetime):
                created_date = created_at
                created_str = created_at.strftime('%Y-%m-%d %H:%M:%S')
            else:
                created_date = None
                created_str = 'N/A'
            
            properties_list.append({
                'id': doc_id,
                'name': property_name,
                'createdAt': created_date,
                'createdStr': created_str,
                'data': data
            })
        
        # Sort by creation date (oldest first) if requested
        if sort_by_date:
            properties_list.sort(key=lambda x: x['createdAt'] if x['createdAt'] else datetime.min)
        
        return properties_list
    
    except Exception as e:
        print(f"Error fetching land properties: {str(e)}")
        return []

def display_properties_table(properties: List[Dict], show_doc_id: bool = True) -> None:
    """
    Display land properties in a formatted table, sorted by creation date.
    
    Args:
        properties: List of property dictionaries
        show_doc_id: Whether to show the full document ID column
    """
    if not properties:
        print("No properties found in the landPortfolio collection.")
        return
    
    print(f"\n{'='*130}")
    print(f"LAND PROPERTIES ({len(properties)} total) - Sorted by Creation Date (Oldest First)")
    print(f"{'='*130}\n")
    
    if show_doc_id:
        # Table header with doc ID
        print(f"{'#':<5} {'Created Date':<20} {'Document ID':<40} {'Name/Title':<60}")
        print(f"{'-'*5} {'-'*20} {'-'*40} {'-'*60}")
        
        # Table rows
        for idx, prop in enumerate(properties, 1):
            doc_id = prop['id'][:37] + "..." if len(prop['id']) > 40 else prop['id']
            name = prop['name'][:57] + "..." if len(prop['name']) > 60 else prop['name']
            created = prop['createdStr']
            print(f"{idx:<5} {created:<20} {doc_id:<40} {name:<60}")
    else:
        # Table header without doc ID
        print(f"{'#':<5} {'Created Date':<20} {'Name/Title':<100}")
        print(f"{'-'*5} {'-'*20} {'-'*100}")
        
        # Table rows
        for idx, prop in enumerate(properties, 1):
            name = prop['name'][:97] + "..." if len(prop['name']) > 100 else prop['name']
            created = prop['createdStr']
            print(f"{idx:<5} {created:<20} {name:<100}")
    
    print(f"\n{'='*130}\n")

def export_to_json(properties: List[Dict], filename: str = 'land_properties_list.json') -> None:
    """
    Export land properties to a JSON file.
    
    Args:
        properties: List of property dictionaries
        filename: Output filename
    """
    export_data = [
        {
            'id': prop['id'],
            'name': prop['name'],
            'createdAt': prop['createdStr']
        }
        for prop in properties
    ]
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
    
    print(f"Exported {len(export_data)} properties to {filename}")

def find_duplicates(properties: List[Dict]) -> Dict[str, List[Dict]]:
    """
    Find duplicate property names and group them.
    Shows which ones are older and can be deleted.
    
    Args:
        properties: List of property dictionaries
    
    Returns:
        Dictionary with duplicate names as keys and list of properties as values
    """
    name_groups = {}
    
    for prop in properties:
        name = prop['name']
        if name not in name_groups:
            name_groups[name] = []
        name_groups[name].append(prop)
    
    # Filter to only duplicates
    duplicates = {name: props for name, props in name_groups.items() if len(props) > 1}
    
    return duplicates

def delete_oldest_from_duplicates(property_names: List[str], confirm: bool = True) -> int:
    """
    For each property name, find duplicates and delete the oldest version(s),
    keeping only the newest.
    
    Args:
        property_names: List of property names to check for duplicates
        confirm: If True, ask for confirmation before deleting
    
    Returns:
        Number of properties deleted
    """
    all_props = list_land_properties(sort_by_date=False)
    
    # Group all properties by name
    name_groups = {}
    for prop in all_props:
        name = prop['name']
        if name not in name_groups:
            name_groups[name] = []
        name_groups[name].append(prop)
    
    to_delete = []
    
    # For each property name provided, find duplicates and mark older ones for deletion
    for target_name in property_names:
        if target_name in name_groups:
            props = name_groups[target_name]
            if len(props) > 1:
                # Sort by creation date, keep the newest (last)
                sorted_props = sorted(props, key=lambda x: x['createdAt'] if x['createdAt'] else datetime.min)
                # All but the last one are older
                for prop in sorted_props[:-1]:
                    to_delete.append(prop)
    
    if not to_delete:
        print("No older duplicates found for the specified properties.")
        return 0
    
    print(f"\nOlder duplicates to DELETE ({len(to_delete)}):")
    print("=" * 130)
    for idx, prop in enumerate(to_delete, 1):
        # Find the newest version for comparison
        for target_name in property_names:
            if prop['name'] == target_name and target_name in name_groups:
                newest = sorted(name_groups[target_name], key=lambda x: x['createdAt'] if x['createdAt'] else datetime.min)[-1]
                print(f"{idx}. {prop['name']:<60}")
                print(f"   OLD: Created {prop['createdStr']:<20} ID: {prop['id'][:40]}")
                print(f"   NEW: Created {newest['createdStr']:<20} ID: {newest['id'][:40]}")
                break
    print("=" * 130)
    
    if confirm:
        response = input(f"\nAre you sure you want to delete {len(to_delete)} older duplicate properties? (yes/no): ")
        if response.lower() != 'yes':
            print("Deletion cancelled.")
            return 0
    
    # Delete older duplicates
    deleted_count = 0
    for prop in to_delete:
        try:
            db.collection('landPortfolio').document(prop['id']).delete()
            print(f"✓ Deleted: {prop['name']} (Created: {prop['createdStr']})")
            deleted_count += 1
        except Exception as e:
            print(f"✗ Error deleting {prop['name']}: {str(e)}")
    
    print(f"\nTotal deleted: {deleted_count}")
    return deleted_count

def delete_older_duplicates(confirm: bool = True) -> int:
    """
    Find duplicate property names and delete the older versions,
    keeping only the newest.
    
    Args:
        confirm: If True, ask for confirmation before deleting
    
    Returns:
        Number of properties deleted
    """
    duplicates = find_duplicates(list_land_properties())
    
    if not duplicates:
        print("No duplicate properties found.")
        return 0
    
    print(f"\nFound {len(duplicates)} properties with duplicates:")
    print("=" * 130)
    
    to_delete = []
    
    for name, props in duplicates.items():
        print(f"\n{name}:")
        for idx, prop in enumerate(props, 1):
            marker = " (KEEP - NEWEST)" if idx == len(props) else " (DELETE - OLDER)"
            print(f"  {idx}. Created: {prop['createdStr']:<20} ID: {prop['id']:<40} {marker}")
            if idx < len(props):
                to_delete.append(prop)
    
    print("\n" + "=" * 130)
    
    if not to_delete:
        print("No older duplicates to delete.")
        return 0
    
    if confirm:
        response = input(f"\nAre you sure you want to delete {len(to_delete)} older duplicate properties? (yes/no): ")
        if response.lower() != 'yes':
            print("Deletion cancelled.")
            return 0
    
    # Delete older duplicates
    deleted_count = 0
    for prop in to_delete:
        try:
            db.collection('landPortfolio').document(prop['id']).delete()
            print(f"✓ Deleted: {prop['name']} (Created: {prop['createdStr']})")
            deleted_count += 1
        except Exception as e:
            print(f"✗ Error deleting {prop['name']}: {str(e)}")
    
    print(f"\nTotal deleted: {deleted_count}")
    return deleted_count

def main():
    """Main execution with menu options"""
    print("\n" + "="*130)
    print("LAND PROPERTIES MANAGER")
    print("="*130)
    
    while True:
        print("\nOptions:")
        print("  1. List all properties (sorted by creation date)")
        print("  2. Find duplicate properties")
        print("  3. Delete oldest from 8 specific properties")
        print("  4. Delete older duplicates automatically")
        print("  5. Export to JSON")
        print("  6. Exit")
        
        choice = input("\nSelect option (1-6): ").strip()
        
        if choice == '1':
            print("\nFetching land properties from Firestore...")
            properties = list_land_properties()
            display_properties_table(properties, show_doc_id=True)
        
        elif choice == '2':
            print("\nFetching land properties from Firestore...")
            properties = list_land_properties()
            duplicates = find_duplicates(properties)
            
            if duplicates:
                print(f"\nFound {len(duplicates)} properties with duplicates:")
                print("=" * 130)
                for name, props in duplicates.items():
                    print(f"\n{name}:")
                    for idx, prop in enumerate(sorted(props, key=lambda x: x['createdAt'] if x['createdAt'] else datetime.min), 1):
                        marker = " ✓ NEWEST" if idx == len(props) else " ✗ OLDER"
                        print(f"  {idx}. Created: {prop['createdStr']:<20} ID: {prop['id']:<40} {marker}")
                print("\n" + "=" * 130)
            else:
                print("No duplicate properties found.")
        
        elif choice == '3':
            # Specific list of properties to check for duplicates
            props_to_check = [
                "6-3-87 Carolina",
                "17E-3,4,&5 Emmaus",
                "6-3-126 Carolina",
                "6B-24 St. Quaco & Zimmerman",
                "17E-4 Emmaus",
                "85 Fish Bay",
                "6Z-3A Hansen Bay",
                "6Z-3 Hansen Bay"
            ]
            print(f"\nChecking {len(props_to_check)} properties for duplicates and deleting oldest versions...")
            delete_oldest_from_duplicates(props_to_check, confirm=True)
        
        elif choice == '4':
            print("\nFinding and deleting older duplicates...")
            delete_older_duplicates(confirm=True)
        
        elif choice == '5':
            print("\nFetching land properties from Firestore...")
            properties = list_land_properties()
            if properties:
                export_to_json(properties)
        
        elif choice == '6':
            print("Exiting...")
            break
        
        else:
            print("Invalid option. Please select 1-6.")

if __name__ == "__main__":
    main()
