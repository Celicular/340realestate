import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json

# Load Firebase Admin credentials
cred = credentials.Certificate('./firestore-scripts/serviceAccountKey.json')

# Initialize Firebase Admin
try:
    firebase_admin.delete_app(firebase_admin.get_app('portfolio_restore'))
except:
    pass

firebase_admin.initialize_app(cred, name='portfolio_restore')

# Get Firestore database instance
db = firestore.client(app=firebase_admin.get_app('portfolio_restore'))

def get_current_portfolio():
    """Get all current documents in residentialPortfolio"""
    current = {}
    docs = db.collection('residentialPortfolio').stream()
    for doc in docs:
        current[doc.id] = doc.to_dict()
    return current

def load_backup():
    """Load the backup from portfolio_analysis.json"""
    with open('portfolio_analysis.json', 'r') as f:
        data = json.load(f)
    
    backup = {}
    for prop in data['properties']:
        backup[prop['doc_id']] = prop['data']
    return backup

def compare_and_restore():
    """Compare backup with current and restore missing documents"""
    
    print("\n" + "="*80)
    print("PORTFOLIO RESTORATION TOOL")
    print("="*80)
    
    # Load both versions
    backup = load_backup()
    current = get_current_portfolio()
    
    print(f"\nBackup documents: {len(backup)}")
    print(f"Current documents: {len(current)}")
    
    # Find missing documents
    missing = {}
    for doc_id, data in backup.items():
        if doc_id not in current:
            missing[doc_id] = data
    
    if not missing:
        print("\n✓ No missing documents found. Everything is in sync!")
        return
    
    print(f"\n{'!'*80}")
    print(f"FOUND {len(missing)} DELETED DOCUMENT(S) TO RESTORE:")
    print(f"{'!'*80}")
    
    # Display missing documents
    for idx, (doc_id, data) in enumerate(missing.items(), 1):
        print(f"\n{idx}. Document ID: {doc_id}")
        print(f"   Title: {data.get('title', 'N/A')}")
        print(f"   Address: {data.get('address', 'N/A')}")
        print(f"   Price: {data.get('price', 'N/A')}")
        print(f"   Status: {data.get('status', 'N/A')}")
    
    print(f"\n{'!'*80}")
    confirm = input("\nRestore ALL these deleted documents? (YES/no): ").strip().upper()
    
    if confirm not in ['YES', 'Y']:
        print("✗ Restore cancelled.")
        return
    
    # Restore documents
    print("\n→ Restoring documents...\n")
    restored_count = 0
    
    for doc_id, data in missing.items():
        try:
            db.collection('residentialPortfolio').document(doc_id).set(data)
            print(f"  ✓ Restored: {doc_id} - {data.get('title', 'Unknown')}")
            restored_count += 1
        except Exception as e:
            print(f"  ✗ Error restoring {doc_id}: {str(e)}")
    
    print(f"\n{'='*80}")
    print(f"RESTORATION COMPLETE")
    print(f"Restored: {restored_count}/{len(missing)} documents")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    compare_and_restore()
