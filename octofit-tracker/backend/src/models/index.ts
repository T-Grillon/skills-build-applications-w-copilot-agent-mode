import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  team?: mongoose.Types.ObjectId;
  avatarUrl?: string;
}

export interface ITeam extends Document {
  name: string;
  description: string;
  captain?: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  goals: string[];
}

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned?: number;
  date: Date;
  notes?: string;
}

export interface ILeaderboardEntry extends Document {
  user: mongoose.Types.ObjectId;
  score: number;
  rank: number;
  streak: number;
}

export interface IWorkout extends Document {
  name: string;
  type: string;
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  targetMuscles: string[];
  description: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    avatarUrl: { type: String },
  },
  { timestamps: true },
);

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    captain: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    goals: [{ type: String }],
  },
  { timestamps: true },
);

const activitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    caloriesBurned: { type: Number, min: 0 },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true },
);

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: true, min: 1 },
    streak: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const workoutSchema = new Schema<IWorkout>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 10 },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    equipment: [{ type: String }],
    targetMuscles: [{ type: String }],
    description: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', userSchema);
export const Team = mongoose.model<ITeam>('Team', teamSchema);
export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
export const LeaderboardEntry = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);
export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);

export default {
  User,
  Team,
  Activity,
  LeaderboardEntry,
  Workout,
};
