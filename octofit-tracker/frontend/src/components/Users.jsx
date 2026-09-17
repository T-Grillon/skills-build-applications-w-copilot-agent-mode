import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'
import { CollectionView, EmptyState } from './Activities.jsx'

function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { fetchCollection('users').then(setUsers).catch((loadError) => setError(loadError.message)) }, [])
  return <CollectionView title="Community" eyebrow="Your people" error={error}>
    {users.length ? users.map((user) => <article className="tile-row" key={user._id || user.email}><div className="person"><span className="avatar">{user.firstName?.[0] || '?'}</span><div><strong>{user.firstName} {user.lastName}</strong><span>{user.email}</span></div></div><b className="level">{user.fitnessLevel || 'beginner'}</b></article>) : <EmptyState error={error} label="No members found." />}
  </CollectionView>
}

export default Users