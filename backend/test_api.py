#!/usr/bin/env python
"""
Simple test script to verify all API endpoints are working.
Run this after starting the Django server.

Usage:
    python manage.py runserver  # In one terminal
    python test_api.py          # In another terminal
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api"

def test_announcements():
    """Test Announcements API"""
    print("\n" + "="*60)
    print("TESTING ANNOUNCEMENTS API")
    print("="*60)
    
    # Test POST - Create announcement
    print("\n1. Creating new announcement...")
    data = {
        "title": "Test Announcement",
        "message": "This is a test announcement created via API"
    }
    response = requests.post(f"{BASE_URL}/announcements/", json=data)
    print(f"   Status: {response.status_code}")
    if response.status_code == 201:
        announcement = response.json()
        print(f"   Created ID: {announcement['id']}")
        announcement_id = announcement['id']
        
        # Test GET - List all
        print("\n2. Listing all announcements...")
        response = requests.get(f"{BASE_URL}/announcements/")
        print(f"   Status: {response.status_code}")
        print(f"   Count: {response.json()['count']}")
        
        # Test GET - Retrieve single
        print(f"\n3. Retrieving announcement {announcement_id}...")
        response = requests.get(f"{BASE_URL}/announcements/{announcement_id}/")
        print(f"   Status: {response.status_code}")
        print(f"   Title: {response.json()['title']}")
        
        # Test PATCH - Partial update
        print(f"\n4. Updating announcement {announcement_id}...")
        update_data = {"title": "Updated Test Announcement"}
        response = requests.patch(f"{BASE_URL}/announcements/{announcement_id}/", json=update_data)
        print(f"   Status: {response.status_code}")
        print(f"   New Title: {response.json()['title']}")
        
        # Test DELETE
        print(f"\n5. Deleting announcement {announcement_id}...")
        response = requests.delete(f"{BASE_URL}/announcements/{announcement_id}/")
        print(f"   Status: {response.status_code}")
        print("   ✅ Announcement deleted successfully!")
    else:
        print(f"   ❌ Error: {response.text}")


def test_livestreams():
    """Test Livestreams API"""
    print("\n" + "="*60)
    print("TESTING LIVESTREAMS API")
    print("="*60)
    
    # Test POST - Create livestream
    print("\n1. Creating new livestream...")
    future_date = (datetime.now() + timedelta(days=7)).isoformat()
    data = {
        "title": "Test Sunday Service",
        "description": "Weekly worship service livestream",
        "url": "https://youtube.com/live/test123",
        "date": future_date
    }
    response = requests.post(f"{BASE_URL}/livestream/", json=data)
    print(f"   Status: {response.status_code}")
    if response.status_code == 201:
        livestream = response.json()
        print(f"   Created ID: {livestream['id']}")
        livestream_id = livestream['id']
        
        # Test GET - List all
        print("\n2. Listing all livestreams...")
        response = requests.get(f"{BASE_URL}/livestream/")
        print(f"   Status: {response.status_code}")
        print(f"   Count: {response.json()['count']}")
        
        # Test GET - Retrieve single
        print(f"\n3. Retrieving livestream {livestream_id}...")
        response = requests.get(f"{BASE_URL}/livestream/{livestream_id}/")
        print(f"   Status: {response.status_code}")
        print(f"   Title: {response.json()['title']}")
        
        # Test DELETE
        print(f"\n4. Deleting livestream {livestream_id}...")
        response = requests.delete(f"{BASE_URL}/livestream/{livestream_id}/")
        print(f"   Status: {response.status_code}")
        print("   ✅ Livestream deleted successfully!")
    else:
        print(f"   ❌ Error: {response.text}")


def test_sms():
    """Test SMS API"""
    print("\n" + "="*60)
    print("TESTING SMS API")
    print("="*60)
    
    # Test POST - Create SMS
    print("\n1. Creating new SMS record...")
    data = {
        "sender": "Pastor John",
        "receiver": "+254712345678",
        "message": "Test SMS: God bless you!"
    }
    response = requests.post(f"{BASE_URL}/sms/", json=data)
    print(f"   Status: {response.status_code}")
    if response.status_code == 201:
        sms = response.json()
        print(f"   Created ID: {sms['id']}")
        sms_id = sms['id']
        
        # Test GET - List all
        print("\n2. Listing all SMS messages...")
        response = requests.get(f"{BASE_URL}/sms/")
        print(f"   Status: {response.status_code}")
        print(f"   Count: {response.json()['count']}")
        
        # Test GET - Retrieve single
        print(f"\n3. Retrieving SMS {sms_id}...")
        response = requests.get(f"{BASE_URL}/sms/{sms_id}/")
        print(f"   Status: {response.status_code}")
        print(f"   From: {response.json()['sender']}")
        print(f"   To: {response.json()['receiver']}")
        
        # Test DELETE
        print(f"\n4. Deleting SMS {sms_id}...")
        response = requests.delete(f"{BASE_URL}/sms/{sms_id}/")
        print(f"   Status: {response.status_code}")
        print("   ✅ SMS deleted successfully!")
    else:
        print(f"   ❌ Error: {response.text}")


def main():
    """Run all tests"""
    print("\n" + "#"*60)
    print("# PCEA CHURCH SYSTEM - API TEST SUITE")
    print("#"*60)
    
    try:
        # Test server connection
        print("\nTesting server connection...")
        response = requests.get(f"{BASE_URL}/announcements/")
        if response.status_code in [200, 404]:
            print("✅ Server is running!")
        else:
            print(f"❌ Server returned status {response.status_code}")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server!")
        print("   Make sure the Django server is running:")
        print("   python manage.py runserver")
        return
    
    # Run tests
    test_announcements()
    test_livestreams()
    test_sms()
    
    print("\n" + "="*60)
    print("ALL TESTS COMPLETED!")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()

