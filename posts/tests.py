from django.contrib.auth.models import User
from .models import Post
from rest_framework import status
from rest_framework.test import APITestCase


class PostListViewTests(APITestCase):
    def setUp(self):
        User.objects.create_user(
            username='testuser', password='testpassword'
        )
    
    def test_can_list_posts(self):
        testuser = User.objects.get(username='testuser')
        Post.objects.create(
            owner=testuser, title='Test Post', body='Test body'
        )

        response = self.client.get('/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_create_post(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.post(
            '/posts/', {'title': 'Test Post', 'body': 'Test body'}
        )
        count = Post.objects.count()
        self.assertEqual(count, 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_unauthenticated_user_cannot_create_post(self):
        response = self.client.post(
            '/posts/', {'title': 'Test Post', 'body': 'Test body'}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class PostDetailViewTests(APITestCase):
    def setUp(self):
        alpha = User.objects.create_user(
            username='alpha', password='alpha'
        )
        beta = User.objects.create_user(
            username='beta', password='beta'
        )
        Post.objects.create(
            owner=beta, title='Test Post', body='Test body'
        )

    def test_can_retrieve_post_with_valid_id(self):
        response = self.client.get('/posts/1/')
        self.assertEqual(response.data['title'], 'Test Post')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cannot_retrieve_post_with_invalid_id(self):
        response = self.client.get('/posts/99/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_update_own_post(self):
        self.client.login(username='beta', password='beta')
        response = self.client.put('/posts/1/', {'title': 'New Title'})
        post = Post.objects.filter(pk=1).first()
        self.assertEqual(post.title, 'New Title')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cannot_update_anothers_post(self):
        self.client.login(username='alpha', password='alpha')
        response = self.client.put('/posts/1/', {'title': 'New Title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)