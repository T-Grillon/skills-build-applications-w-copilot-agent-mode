import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'
import { CollectionView, EmptyState } from './Activities.jsx'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { fetchCollection('workouts').then(setWorkouts).catch((loadError) => setError(loadError.message)) }, [])
  return <CollectionView title="Workout library" eyebrow="Train smarter" error={error}>
    {workouts.length ? workouts.map((workout) => <article className="workout-card" key={workout._id || workout.name}><div className="workout-top"><span className="type-label">{workout.type || 'Training'}</span><span className={`difficulty ${workout.difficulty || 'beginner'}`}>{workout.difficulty || 'beginner'}</span></div><h3>{workout.name}</h3><p>{workout.description}</p><span className="workout-meta">{workout.durationMinutes || 0} min · {(workout.targetMuscles || []).join(', ') || 'Full body'}</span></article>) : <EmptyState error={error} label="No workouts available yet." />}
  </CollectionView>
}

export default Workouts