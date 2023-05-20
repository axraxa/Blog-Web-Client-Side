import React from 'react'
import { Link } from 'react-router-dom'

export default function LostUser() {
  return (
    <section className="loadingScreen">
      <Link to="/home">
        <button>Homepage</button>
      </Link>
    </section>
  )
}
