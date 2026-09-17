import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'
import { CollectionView, EmptyState } from './Activities.jsx'

const API_ENDPOINT = '/api/teams/'

function Teams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { fetchCollection(API_ENDPOINT).then(setTeams).catch((loadError) => setError(loadError.message)) }, [])
  return <CollectionView title="Teams" eyebrow="Find your people" error={error}>
    {teams.length ? teams.map((team) => <article className="tile-row" key={team._id || team.name}><div><strong>{team.name}</strong><span>{team.description || 'A team with shared goals.'}</span></div><b>{team.members?.length || 0}<small> members</small></b></article>) : <EmptyState error={error} label="No teams have been created yet." />}
  </CollectionView>
}

export default Teams