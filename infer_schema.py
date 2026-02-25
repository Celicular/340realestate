import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from collections import Counter
import pprint

# Load Firebase Admin credentials
cred = credentials.Certificate('./firestore-scripts/serviceAccountKey.json')

# Initialize Firebase Admin
try:
    firebase_admin.delete_app(firebase_admin.get_app('schema_inference'))
except Exception:
    pass

firebase_admin.initialize_app(cred, name='schema_inference')

# Get Firestore database instance
db = firestore.client(app=firebase_admin.get_app('schema_inference'))

def get_schema(data):
    """
    Recursively extract the fields/schema of a dictionary.
    Returns a sorted tuple to make it hashable for counting.
    """
    if isinstance(data, dict):
        schema = []
        for k, v in data.items():
            schema.append((k, get_schema(v)))
        return tuple(sorted(schema))
    elif isinstance(data, list):
        if len(data) > 0 and isinstance(data[0], dict):
            # assume uniform list of dicts, take the schema of the first item
            return ('list_of_dicts', get_schema(data[0]))
        else:
            return 'list_of_values'
    else:
        # We classify primitives and None just as 'value'
        # to focus purely on the structural fields present
        return 'value'

def schema_to_dict(schema_tuple):
    """Convert the tuple schema back to a dictionary for printing"""
    if isinstance(schema_tuple, tuple):
        # Check if it's a list representation
        if len(schema_tuple) == 2 and schema_tuple[0] == 'list_of_dicts':
            return [schema_to_dict(schema_tuple[1])]
            
        result = {}
        for k, v in schema_tuple:
            result[k] = schema_to_dict(v)
        return result
    return schema_tuple

def main():
    print("Fetching documents from residentialPortfolio...")
    docs = db.collection('residentialPortfolio').stream()
    
    schema_counter = Counter()
    schema_samples = {}
    sample_data = {}  # Added to store the actual data of the sample documents
    
    total_docs = 0
    for doc in docs:
        total_docs += 1
        data = doc.to_dict()
        schema_tuple = get_schema(data)
        schema_counter[schema_tuple] += 1
        if schema_tuple not in schema_samples:
            schema_samples[schema_tuple] = doc.id
            sample_data[schema_tuple] = data  # Store the actual data
            
    print(f"Scanned {total_docs} documents.")
    print(f"Found {len(schema_counter)} different schema variations.\n")
    
    if not schema_counter:
        print("No documents found.")
        return
        
    most_common_schema, count = schema_counter.most_common(1)[0]
    
    print(f"--- MOST COMMON SCHEMA ({count} occurrences out of {total_docs}) ---")
    print(f"Sample Document ID: {schema_samples[most_common_schema]}")
    printable_schema = schema_to_dict(most_common_schema)
    print("\n--- SCHEMA STRUCTURE ---")
    pprint.pprint(printable_schema, indent=2, sort_dicts=False)
    
    print("\n--- SAMPLE DATA ---")
    pprint.pprint(sample_data[most_common_schema], indent=2, sort_dicts=False)

if __name__ == '__main__':
    main()
