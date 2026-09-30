# PCEA Church System - API Documentation

## 📋 Project Overview

This is a fully functional Django REST Framework backend for the PCEA Church System. It provides a complete admin dashboard and RESTful API for managing church announcements, livestreams, and SMS messages.

---



##  Completed Features

###  **1. Announcements App**
- Full CRUD operations for church announcements
- Admin interface with search and filtering
- Paginated API responses

###  **2. Livestream App**
- Manage livestream events with titles, descriptions, URLs, and dates
- Date-based filtering in admin
- Complete REST API endpoints

###  **3. SMS App**
- Track SMS messages sent to church members
- Record sender, receiver, message, and timestamp
- Enhanced admin with message preview

###  **4. Django Admin Dashboard**
- Professional admin interface for all models
- Custom list displays, filters, and search
- Organized fieldsets for better UX

###  **5. REST Framework Integration**
- AllowAny permissions (ready for production customization)
- Pagination enabled (10 items per page)
- Browsable API interface
- JSON and Browsable API renderers

---

##  Files Modified/Created

### **Core Configuration**
-  `/backend/core/settings.py` - Updated REST Framework settings with pagination
-  `/backend/core/urls.py` - Already configured with all app routes

### **Announcements App**
-  `/backend/apps/announcements/models.py` - Announcement model
-  `/backend/apps/announcements/serializers.py` - AnnouncementSerializer
-  `/backend/apps/announcements/views.py` - AnnouncementViewSet
-  `/backend/apps/announcements/admin.py` - Admin configuration
-  `/backend/apps/announcements/urls.py` - Router configuration
-  `/backend/apps/announcements/migrations/0001_initial.py` - Database migration

### **Livestream App**
-  `/backend/apps/livestream/models.py` - Livestream model
-  `/backend/apps/livestream/serializers.py` - LivestreamSerializer
-  `/backend/apps/livestream/views.py` - LivestreamViewSet
-  `/backend/apps/livestream/admin.py` - Admin configuration
-  `/backend/apps/livestream/urls.py` - Router configuration
-  `/backend/apps/livestream/migrations/0001_initial.py` - Database migration

### **SMS App**
-  `/backend/apps/sms/models.py` - SMS model
-  `/backend/apps/sms/serializers.py` - SMSSerializer
-  `/backend/apps/sms/views.py` - SMSViewSet
-  `/backend/apps/sms/admin.py` - Admin configuration
-  `/backend/apps/sms/urls.py` - Router configuration
-  `/backend/apps/sms/migrations/0001_initial.py` - Database migration


---

##  API Endpoints

### **Base URL:** `http://localhost:8000/api/`

### **1. Announcements API** (`/api/announcements/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/announcements/` | List all announcements (paginated) |
| POST | `/api/announcements/` | Create a new announcement |
| GET | `/api/announcements/{id}/` | Retrieve specific announcement |
| PUT | `/api/announcements/{id}/` | Full update of announcement |
| PATCH | `/api/announcements/{id}/` | Partial update of announcement |
| DELETE | `/api/announcements/{id}/` | Delete an announcement |

**Model Fields:**
```json
{
  "id": 1,
  "title": "Sunday Service",
  "message": "Join us this Sunday for worship at 9 AM",
  "created_at": "2025-10-21T10:30:00Z"
}
```

---

### **2. Livestream API** (`/api/livestream/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/livestream/` | List all livestreams (paginated) |
| POST | `/api/livestream/` | Create a new livestream |
| GET | `/api/livestream/{id}/` | Retrieve specific livestream |
| PUT | `/api/livestream/{id}/` | Full update of livestream |
| PATCH | `/api/livestream/{id}/` | Partial update of livestream |
| DELETE | `/api/livestream/{id}/` | Delete a livestream |

**Model Fields:**
```json
{
  "id": 1,
  "title": "Sunday Worship Service",
  "description": "Live worship and sermon",
  "url": "https://youtube.com/live/xyz",
  "date": "2025-10-26T09:00:00Z"
}
```

---

### **3. SMS API** (`/api/sms/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sms/` | List all SMS messages (paginated) |
| POST | `/api/sms/` | Create a new SMS record |
| GET | `/api/sms/{id}/` | Retrieve specific SMS |
| PUT | `/api/sms/{id}/` | Full update of SMS |
| PATCH | `/api/sms/{id}/` | Partial update of SMS |
| DELETE | `/api/sms/{id}/` | Delete an SMS record |

**Model Fields:**
```json
{
  "id": 1,
  "sender": "Church Admin",
  "receiver": "+254712345678",
  "message": "Don't forget our prayer meeting on Wednesday",
  "sent_at": "2025-10-21T14:30:00Z"
}
```


### **Admin Features**

#### **Announcements Admin**
- **List View:** Shows title and creation date
- **Filters:** Filter by creation date
- **Search:** Search by title or message
- **Ordering:** Most recent first
- **Fieldsets:** Organized into "Announcement Details" and "Metadata"

#### **Livestreams Admin**
- **List View:** Shows title, date, and URL
- **Filters:** Filter by date
- **Search:** Search by title or description
- **Date Hierarchy:** Navigate by date
- **Ordering:** Most recent first

#### **SMS Messages Admin**
- **List View:** Shows sender, receiver, sent time, and message preview
- **Filters:** Filter by sent date and sender
- **Search:** Search by sender, receiver, or message
- **Date Hierarchy:** Navigate by sent date
- **Message Preview:** Shows first 50 characters
- **Ordering:** Most recent first



## Database Information

- **Database:** SQLite3 (`db.sqlite3`)
- **Location:** `/home/sam_gk/Documents/pcea_church_system/backend/db.sqlite3`
- **Tables Created:**
  - `announcements_announcement`
  - `livestream_livestream`
  - `sms_sms`

**For Production:** Consider switching to PostgreSQL (configuration example already in `settings.py`)



## Model Details

### **Announcement Model**
```python
class Announcement(models.Model):
    title = CharField(max_length=255)
    message = TextField()
    created_at = DateTimeField(auto_now_add=True)
```

### **Livestream Model**
```python
class Livestream(models.Model):
    title = CharField(max_length=255)
    description = TextField()
    url = URLField(max_length=500)
    date = DateTimeField()
```

### **SMS Model**
```python
class SMS(models.Model):
    sender = CharField(max_length=255)
    receiver = CharField(max_length=255)
    message = TextField()
    sent_at = DateTimeField(auto_now_add=True)
```



**Built with Django 5.2.7 and Django REST Framework 3.16.1**



