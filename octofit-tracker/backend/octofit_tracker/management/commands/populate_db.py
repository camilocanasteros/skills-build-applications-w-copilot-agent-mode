from django.core.management.base import BaseCommand
from django.conf import settings
from djongo import models
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        # Drop collections if they exist
        db.users.drop()
        db.teams.drop()
        db.activities.drop()
        db.leaderboard.drop()
        db.workouts.drop()

        # Users (superheroes)
        users = [
            {"name": "Superman", "email": "superman@dc.com", "team": "DC"},
            {"name": "Batman", "email": "batman@dc.com", "team": "DC"},
            {"name": "Wonder Woman", "email": "wonderwoman@dc.com", "team": "DC"},
            {"name": "Iron Man", "email": "ironman@marvel.com", "team": "Marvel"},
            {"name": "Captain America", "email": "cap@marvel.com", "team": "Marvel"},
            {"name": "Black Widow", "email": "widow@marvel.com", "team": "Marvel"},
        ]
        db.users.insert_many(users)
        db.users.create_index([("email", 1)], unique=True)

        # Teams
        teams = [
            {"name": "Marvel", "members": ["ironman@marvel.com", "cap@marvel.com", "widow@marvel.com"]},
            {"name": "DC", "members": ["superman@dc.com", "batman@dc.com", "wonderwoman@dc.com"]},
        ]
        db.teams.insert_many(teams)

        # Activities
        activities = [
            {"user_email": "superman@dc.com", "activity": "Flying", "duration": 60},
            {"user_email": "batman@dc.com", "activity": "Martial Arts", "duration": 45},
            {"user_email": "ironman@marvel.com", "activity": "Flight Suit Training", "duration": 50},
            {"user_email": "cap@marvel.com", "activity": "Shield Throwing", "duration": 40},
        ]
        db.activities.insert_many(activities)

        # Leaderboard
        leaderboard = [
            {"team": "Marvel", "points": 300},
            {"team": "DC", "points": 250},
        ]
        db.leaderboard.insert_many(leaderboard)

        # Workouts
        workouts = [
            {"name": "Strength Training", "suggested_for": ["Superman", "Captain America"]},
            {"name": "Agility Drills", "suggested_for": ["Black Widow", "Batman"]},
        ]
        db.workouts.insert_many(workouts)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
