import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        firstName: 'Ava',
        lastName: 'Martinez',
        email: 'ava.martinez@octofit.io',
        fitnessLevel: 'advanced',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      },
      {
        firstName: 'Leo',
        lastName: 'Chen',
        email: 'leo.chen@octofit.io',
        fitnessLevel: 'intermediate',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      },
      {
        firstName: 'Mila',
        lastName: 'Johnson',
        email: 'mila.johnson@octofit.io',
        fitnessLevel: 'beginner',
        avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
      },
      {
        firstName: 'Noah',
        lastName: 'Patel',
        email: 'noah.patel@octofit.io',
        fitnessLevel: 'advanced',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      },
    ]);

    const skylineTeam = await Team.create({
      name: 'Skyline Striders',
      description: 'Cardio-focused runners and endurance athletes.',
      captain: users[0]._id,
      members: users.slice(0, 2).map((user) => user._id),
      goals: ['Run a 10K', 'Increase weekly mileage', 'Improve recovery'],
    });

    const peakTeam = await Team.create({
      name: 'Peak Performers',
      description: 'Strength and mobility specialists aiming for peak power.',
      captain: users[2]._id,
      members: users.slice(2).map((user) => user._id),
      goals: ['Increase squat strength', 'Improve mobility consistency', 'Hit weekly training targets'],
    });

    await User.updateMany({}, { $set: { team: null } });
    await User.findByIdAndUpdate(users[0]._id, { team: skylineTeam._id });
    await User.findByIdAndUpdate(users[1]._id, { team: skylineTeam._id });
    await User.findByIdAndUpdate(users[2]._id, { team: peakTeam._id });
    await User.findByIdAndUpdate(users[3]._id, { team: peakTeam._id });

    const workoutSeed = await Workout.insertMany([
      {
        name: 'Tempo Run Intervals',
        type: 'cardio',
        durationMinutes: 35,
        difficulty: 'intermediate',
        equipment: ['Running shoes'],
        targetMuscles: ['legs', 'core'],
        description: 'A controlled interval session blending steady effort and faster surges.',
      },
      {
        name: 'Upper Body Strength Circuit',
        type: 'strength',
        durationMinutes: 45,
        difficulty: 'advanced',
        equipment: ['Dumbbells', 'Bench'],
        targetMuscles: ['chest', 'back', 'shoulders', 'arms'],
        description: 'Compound lifting work to build upper-body power and stability.',
      },
      {
        name: 'Mobility Reset Flow',
        type: 'mobility',
        durationMinutes: 20,
        difficulty: 'beginner',
        equipment: ['Yoga mat'],
        targetMuscles: ['hips', 'hamstrings', 'shoulders'],
        description: 'A low-impact flow to improve range of motion and recovery.',
      },
    ]);

    await Activity.insertMany([
      {
        user: users[0]._id,
        type: 'running',
        durationMinutes: 42,
        distanceKm: 8.4,
        caloriesBurned: 510,
        date: new Date('2026-09-15T06:15:00Z'),
        notes: 'Strong hill repeats with consistent pacing.',
      },
      {
        user: users[1]._id,
        type: 'cycling',
        durationMinutes: 50,
        distanceKm: 24,
        caloriesBurned: 620,
        date: new Date('2026-09-14T18:00:00Z'),
        notes: 'Good endurance effort on the flats.',
      },
      {
        user: users[2]._id,
        type: 'strength',
        durationMinutes: 38,
        caloriesBurned: 430,
        date: new Date('2026-09-13T17:30:00Z'),
        notes: 'Completed push-focused session with clean form.',
      },
      {
        user: users[3]._id,
        type: 'mobility',
        durationMinutes: 25,
        caloriesBurned: 180,
        date: new Date('2026-09-12T07:00:00Z'),
        notes: 'Focused on hip mobility and breathing cadence.',
      },
    ]);

    await LeaderboardEntry.insertMany([
      { user: users[0]._id, score: 1280, rank: 1, streak: 12 },
      { user: users[1]._id, score: 1165, rank: 2, streak: 8 },
      { user: users[2]._id, score: 1080, rank: 3, streak: 5 },
      { user: users[3]._id, score: 1010, rank: 4, streak: 6 },
    ]);

    console.log(`Seeded ${users.length} users, ${2} teams, ${workoutSeed.length} workouts, and activity/leaderboard data.`);
    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
