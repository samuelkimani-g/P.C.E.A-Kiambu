from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

class AccountsAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = "/accounts/users/register/"
        self.login_url = "/accounts/users/login/"
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "StrongPassw0rd!",
            "password2": "StrongPassw0rd!",
        }

    def test_register_user(self):
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("tokens", response.data)

    def test_login_user(self):
        # register first
        self.client.post(self.register_url, self.user_data, format="json")
        # login
        response = self.client.post(self.login_url, {"username": "testuser", "password": "StrongPassw0rd!"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", response.data)
