import express from 'express';
import { connectDatabase } from './config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

const app = express();
const port = Number(process.env.PORT) || 8000;
const apiBaseUrl = getApiBaseUrl();

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'octofit-tracker-api',
    baseUrl: apiBaseUrl,
  });
});

app.get('/api/users/', async (_request, response) => {
  try {
    const users = await User.find().populate('team').lean();
    response.json({ baseUrl: apiBaseUrl, count: users.length, data: users });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    response.status(500).json({ message: 'Unable to fetch users', error: message });
  }
});

app.post('/api/users/', async (request, response) => {
  try {
    const user = await User.create(request.body);
    response.status(201).json({ baseUrl: apiBaseUrl, data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    response.status(400).json({ message: 'Unable to create user', error: message });
  }
});

app.get('/api/teams/', async (_request, response) => {
  try {
    const teams = await Team.find().populate('members').populate('captain').lean();
    response.json({ baseUrl: apiBaseUrl, count: teams.length, data: teams });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    response.status(500).json({ message: 'Unable to fetch teams', error: message });
  }
});

app.post('/api/teams/', async (request, response) => {
  try {
    const team = await Team.create(request.body);
    response.status(201).json({ baseUrl: apiBaseUrl, data: team });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    response.status(400).json({ message: 'Unable to create team', error: message });
  }
});

app.get('/api/activities/', async (_request, response) => {
  try {
    const activities = await Activity.find().populate('user').sort({ date: -1 }).lean();
    response.json({ baseUrl: apiBaseUrl, count: activities.length, data: activities });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    response.status(500).json({ message: 'Unable to fetch activities', error: message });
  }
});

app.post('/api/activities/', async (request, response) => {
  try {
    const activity = await Activity.create(request.body);
    response.status(201).json({ baseUrl: apiBaseUrl, data: activity });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    response.status(400).json({ message: 'Unable to create activity', error: message });
  }
});

app.get('/api/leaderboard/', async (_request, response) => {
  try {
    const board = await LeaderboardEntry.find().populate('user').sort({ score: -1 }).lean();
    response.json({ baseUrl: apiBaseUrl, count: board.length, data: board });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    response.status(500).json({ message: 'Unable to fetch leaderboard', error: message });
  }
});

app.post('/api/leaderboard/', async (request, response) => {
  try {
    const entry = await LeaderboardEntry.create(request.body);
    response.status(201).json({ baseUrl: apiBaseUrl, data: entry });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    response.status(400).json({ message: 'Unable to create leaderboard entry', error: message });
  }
});

app.get('/api/workouts/', async (_request, response) => {
  try {
    const workouts = await Workout.find().sort({ difficulty: 1, durationMinutes: 1 }).lean();
    response.json({ baseUrl: apiBaseUrl, count: workouts.length, data: workouts });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    response.status(500).json({ message: 'Unable to fetch workouts', error: message });
  }
});

app.post('/api/workouts/', async (request, response) => {
  try {
    const workout = await Workout.create(request.body);
    response.status(201).json({ baseUrl: apiBaseUrl, data: workout });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    response.status(400).json({ message: 'Unable to create workout', error: message });
  }
});

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`OctoFit Tracker API listening on port ${port}`);
      console.log(`API base URL: ${apiBaseUrl}`);
    });
  } catch (error) {
    console.error('Failed to start OctoFit Tracker API:', error);
    process.exit(1);
  }
};

function getApiBaseUrl(): string {
  const codespaceName = process.env.CODESPACE_NAME;

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
}


startServer();

export default app;
