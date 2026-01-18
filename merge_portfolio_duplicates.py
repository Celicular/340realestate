import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
from datetime import datetime

# Load Firebase Admin credentials
cred = credentials.Certificate('./firestore-scripts/serviceAccountKey.json')

# Initialize Firebase Admin
try:
    firebase_admin.delete_app(firebase_admin.get_app('portfolio_merge'))
except:
    pass

firebase_admin.initialize_app(cred, name='portfolio_merge')

# Get Firestore database instance
db = firestore.client(app=firebase_admin.get_app('portfolio_merge'))

def load_analysis():
    """Load the portfolio analysis JSON"""
    with open('portfolio_analysis.json', 'r') as f:
        return json.load(f)

def display_property_details(doc_id, data, index=None):
    """Pretty print property details"""
    header = f"\n{'='*80}\n"
    if index:
        header += f"Document #{index}: {doc_id}\n"
    else:
        header += f"Document: {doc_id}\n"
    header += f"{'='*80}\n"
    
    print(header)
    
    # Key fields to display
    key_fields = ['title', 'address', 'price', 'status', 'description']
    
    for field in key_fields:
        if field in data:
            value = data[field]
            if isinstance(value, str) and len(value) > 100:
                print(f"{field.upper()}: {value[:100]}...")
            else:
                print(f"{field.upper()}: {value}")
    
    # Display features if available
    if 'features' in data:
        features = data['features']
        print(f"\nFEATURES:")
        for key, value in features.items():
            print(f"  - {key}: {value}")
    
    # Display amenities if available
    if 'amenities' in data and isinstance(data['amenities'], list):
        print(f"\nAMENITIES ({len(data['amenities'])} total):")
        for idx, amenity in enumerate(data['amenities'][:5], 1):
            print(f"  {idx}. {amenity}")
        if len(data['amenities']) > 5:
            print(f"  ... and {len(data['amenities']) - 5} more")
    
    print(f"\nAll Fields: {list(data.keys())}\n")

def merge_property_data(documents):
    """
    Intelligently merge multiple property documents
    Takes data from both documents to create a complete merged version
    
    Args:
        documents: list of (doc_id, data) tuples
    
    Returns:
        merged_data: combined property data
        merge_notes: notes about what was merged
    """
    merged_data = {}
    merge_notes = []
    
    # List of fields that should be combined (arrays)
    array_fields = ['amenities', 'images', 'propertyDetails', 'tags']
    
    # List of fields to prioritize (prefer non-empty/non-null)
    priority_fields = ['title', 'price', 'address', 'description', 'status']
    
    # Merge each field
    all_keys = set()
    for _, data in documents:
        all_keys.update(data.keys())
    
    for field in sorted(all_keys):
        values = [data.get(field) for _, data in documents if field in data]
        
        if not values:
            continue
        
        # Handle array fields - combine them
        if field in array_fields:
            combined = []
            for value in values:
                if isinstance(value, list):
                    for item in value:
                        if item not in combined:  # Avoid duplicates
                            combined.append(item)
            if combined:
                merged_data[field] = combined
                merge_notes.append(f"  - {field}: Combined {len(values)} sources ({len(combined)} total items)")
        
        # Handle dict/object fields - deep merge
        elif isinstance(values[0], dict):
            merged_dict = {}
            for value in values:
                if isinstance(value, dict):
                    merged_dict.update(value)
            if merged_dict:
                merged_data[field] = merged_dict
                merge_notes.append(f"  - {field}: Merged from {len(values)} sources")
        
        # Handle priority fields - use first non-empty value
        elif field in priority_fields:
            for value in values:
                if value and (not isinstance(value, str) or value.strip()):
                    merged_data[field] = value
                    val_preview = str(value)[:50] if isinstance(value, str) else str(value)
                    merge_notes.append(f"  - {field}: {val_preview}")
                    break
        
        # Handle other fields - use first non-empty value
        else:
            for value in values:
                if value and (not isinstance(value, str) or value.strip()):
                    merged_data[field] = value
                    val_preview = str(value)[:50] if isinstance(value, str) else str(value)
                    merge_notes.append(f"  - {field}: {val_preview}")
                    break
    
    return merged_data, merge_notes

def compare_duplicates_interactive():
    """
    Interactively show duplicates and get merge decisions from user
    """
    analysis = load_analysis()
    duplicates = analysis['duplicates']
    properties_list = analysis['properties']
    
    # Create a map of doc_id to property data
    doc_map = {p['doc_id']: p['data'] for p in properties_list}
    
    merge_log = []
    duplicate_count = 0
    
    print("\n" + "="*80)
    print(f"FOUND {len(duplicates)} PROPERTIES WITH DUPLICATE TITLES")
    print("="*80)
    
    for title, doc_ids in sorted(duplicates.items()):
        duplicate_count += 1
        print(f"\n\n{'#'*80}")
        print(f"DUPLICATE #{duplicate_count}/{len(duplicates)}: '{title}'")
        print(f"Number of documents: {len(doc_ids)}")
        print(f"{'#'*80}")
        
        # Display each document
        for idx, doc_id in enumerate(doc_ids, 1):
            if doc_id in doc_map:
                display_property_details(doc_id, doc_map[doc_id], idx)
        
        # Get user action
        while True:
            print("\nMERGE OPTIONS:")
            for idx, doc_id in enumerate(doc_ids, 1):
                print(f"  {idx} - Keep document #{idx} ({doc_id}) and MERGE data from others into it")
            print(f"  S - SKIP this duplicate for now")
            print(f"  Q - QUIT the merge process")
            
            choice = input("\nEnter your choice (1-{}/{}/S/Q): ".format(len(doc_ids), len(doc_ids))).strip().upper()
            
            if choice == 'Q':
                print("\n✗ Merge process cancelled.")
                return merge_log
            
            elif choice == 'S':
                print("⊘ Skipping this duplicate...")
                merge_log.append({
                    'title': title,
                    'doc_ids': doc_ids,
                    'action': 'SKIPPED'
                })
                break
            
            elif choice.isdigit() and 1 <= int(choice) <= len(doc_ids):
                keeper_idx = int(choice) - 1
                keeper_id = doc_ids[keeper_idx]
                to_delete = [doc_ids[i] for i in range(len(doc_ids)) if i != keeper_idx]
                
                # Prepare documents for merging
                documents_to_merge = [(keeper_id, doc_map[keeper_id])]
                for doc_id in to_delete:
                    documents_to_merge.append((doc_id, doc_map[doc_id]))
                
                # Merge the data
                merged_data, merge_notes = merge_property_data(documents_to_merge)
                
                # Show preview
                print(f"\n{'!'*80}")
                print(f"MERGE PREVIEW:")
                print(f"{'!'*80}")
                print(f"Base document: {keeper_id}")
                print(f"Merging data from: {to_delete}")
                print(f"\nMerged fields:")
                for note in merge_notes:
                    print(note)
                print(f"{'!'*80}")
                
                confirm = input("\nProceed with merge? (YES/no): ").strip().upper()
                
                if confirm == 'YES' or confirm == 'Y':
                    # Perform the merge
                    print(f"\n→ Executing merge...")
                    try:
                        # Update keeper document with merged data
                        db.collection('residentialPortfolio').document(keeper_id).set(merged_data)
                        print(f"  ✓ Updated document: {keeper_id}")
                        
                        # Delete duplicate documents
                        for doc_id_to_delete in to_delete:
                            db.collection('residentialPortfolio').document(doc_id_to_delete).delete()
                            print(f"  ✓ Deleted: {doc_id_to_delete}")
                        
                        print(f"  ✓ MERGED: Combined data into {keeper_id}")
                        merge_log.append({
                            'title': title,
                            'kept_doc_id': keeper_id,
                            'deleted_doc_ids': to_delete,
                            'merged_data_summary': merge_notes,
                            'action': 'MERGED',
                            'timestamp': datetime.now().isoformat()
                        })
                        print("  ✓ Merge completed successfully!\n")
                        break
                        
                    except Exception as e:
                        print(f"  ✗ Error during merge: {str(e)}")
                        import traceback
                        traceback.print_exc()
                        merge_log.append({
                            'title': title,
                            'doc_ids': doc_ids,
                            'action': 'ERROR',
                            'error': str(e)
                        })
                        break
                else:
                    print("Merge cancelled, proceeding to next duplicate...")
                    break
            
            else:
                print("Invalid choice. Please try again.")
    
    return merge_log

def save_merge_log(merge_log):
    """Save merge operations log"""
    with open('merge_log.json', 'w') as f:
        json.dump(merge_log, f, indent=2, default=str)
    print(f"\n✓ Merge log saved to 'merge_log.json'")

if __name__ == "__main__":
    print("\n" + "="*80)
    print("RESIDENTIAL PORTFOLIO - INTERACTIVE DUPLICATE MERGER")
    print("="*80)
    print("\nThis tool will show you duplicate properties one by one.")
    print("For each duplicate, you can choose which document to keep.")
    print("The data from ALL documents will be MERGED together!")
    print("WARNING: Documents not selected as keeper will be DELETED!\n")
    
    confirm_start = input("Ready to proceed? (yes/no): ").strip().lower()
    
    if confirm_start in ['yes', 'y']:
        merge_log = compare_duplicates_interactive()
        save_merge_log(merge_log)
        
        print("\n" + "="*80)
        print("MERGE PROCESS SUMMARY")
        print("="*80)
        
        merged_count = sum(1 for item in merge_log if item['action'] == 'MERGED')
        skipped_count = sum(1 for item in merge_log if item['action'] == 'SKIPPED')
        error_count = sum(1 for item in merge_log if item['action'] == 'ERROR')
        
        print(f"Merged: {merged_count}")
        print(f"Skipped: {skipped_count}")
        print(f"Errors: {error_count}")
        print(f"\nTotal duplicates processed: {len(merge_log)}")
        print("="*80 + "\n")
    else:
        print("\n✗ Process cancelled.")
