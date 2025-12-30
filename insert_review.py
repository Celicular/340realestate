import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import datetime
import json

# Load Firebase Admin credentials
cred = credentials.Certificate('./firestore-scripts/serviceAccountKey.json')

# Initialize Firebase Admin
firebase_admin.initialize_app(cred)

# Get Firestore database instance
db = firestore.client()

def insert_review(review_data):
    """
    Insert a single review document into the reviews collection
    
    Args:
        review_data (dict): Dictionary containing review fields
            - body (str): Review text
            - createdAt (timestamp): Creation timestamp
            - name (str): Reviewer name
            - rating (int): Rating (1-5)
            - status (str): Status (e.g., "approved")
            - title (str): Review title
            - updatedAt (timestamp): Update timestamp
    """
    try:
        # Add document to reviews collection
        # Firestore will auto-generate a document ID if not provided
        doc_ref = db.collection('reviews').document()
        doc_ref.set(review_data)
        
        print(f"✓ Review inserted successfully with ID: {doc_ref.id}")
        return doc_ref.id
    except Exception as e:
        print(f"✗ Error inserting review: {str(e)}")
        return None

def insert_multiple_reviews(reviews_list):
    """
    Insert multiple review documents into the reviews collection
    
    Args:
        reviews_list (list): List of review dictionaries
    """
    inserted_ids = []
    for idx, review in enumerate(reviews_list, 1):
        doc_id = insert_review(review)
        if doc_id:
            inserted_ids.append(doc_id)
        print(f"Processed review {idx}/{len(reviews_list)}")
    
    print(f"\n✓ Successfully inserted {len(inserted_ids)} reviews")
    return inserted_ids

# Example usage
if __name__ == "__main__":
    # Sample review document based on your data
    sample_review = {
        "body": "I have now worked with Tammy Donnelly for a few years and the work she has done has been outstanding in both the management of my property at Lavender Hill and the sale of my Villa in Coral Bay.I have worked with a few realtors and property managers in St John in the past and to me she stands head and shoulders above all the others.I consider myself lucky to have found her as my representative on real estate issues in St John.Thank you Tammy",
        "createdAt": firestore.SERVER_TIMESTAMP,
        "name": "Alex",
        "rating": 5,
        "status": "approved",
        "title": "Thank you Tammy",
        "updatedAt": firestore.SERVER_TIMESTAMP
    }
    
    # Insert the sample review
    review_id = insert_review(sample_review)
    
    # Optional: Insert multiple reviews at once
    # multiple_reviews = [sample_review, another_review, ...]
    # inserted_ids = insert_multiple_reviews(multiple_reviews)
    
    # Clean up
    firebase_admin.delete_app(firebase_admin.get_app())
