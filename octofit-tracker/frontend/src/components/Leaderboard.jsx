import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'
import { CollectionView, EmptyState } from './Activities.jsx'

const API_ENDPOINT = '/api/leaderboard/'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { fetchCollection(API_ENDPOINT).then(setEntries).catch((loadError) => setError(loadError.message)) }, [])
  return <CollectionView title="Leaderboard" eyebrow="Compete kindly" error={error}>
    {entries.length ? entries.map((entry, index) => <article className="rank-row" key={entry._id || entry.rank}><span className="rank-number">{entry.rank || index + 1}</span><div><strong>{entry.user ? `${entry.user.firstName} ${entry.user.lastName}` : 'Athlete'}</strong><span>{entry.streak || 0} day streak</span></div><b>{entry.score || 0}<small> pts</small></b></article>) : <EmptyState error={error} label="The leaderboard is waiting for its first scores." />}
  </CollectionView>
}

export default Leaderboard