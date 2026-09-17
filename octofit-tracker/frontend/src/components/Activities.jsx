import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection('activities').then(setActivities).catch((loadError) => setError(loadError.message))
  }, [])

  return <CollectionView title="Recent activity" eyebrow="Momentum" error={error}>
    {activities.length ? activities.map((activity) => (
      <article className="metric-row" key={activity._id || `${activity.type}-${activity.date}`}>
        <div><strong>{activity.type || 'Training session'}</strong><span>{activity.user?.firstName || 'Member'} · {activity.date ? new Date(activity.date).toLocaleDateString() : 'No date'}</span></div>
        <b>{activity.durationMinutes || 0} min</b>
      </article>
    )) : <EmptyState error={error} label="No activities recorded yet." />}
  </CollectionView>
}

export function CollectionView({ title, eyebrow, error, children }) {
  return <section className="view-section"><div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><span className="count-badge">Live data</span></div><div className="collection-list">{children}</div>{error && <p className="error-message">{error}. Check that the API is running.</p>}</section>
}

export function EmptyState({ error, label }) {
  return <p className="empty-state">{error ? 'Unable to reach the API.' : label}</p>
}

export default Activities