import React from 'react'

export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <h2>Oops. Where's your money?</h2>
      <p>Looks like the page you're trying to access is unavailabe.</p>
      <a href={`/`}>
        <button>Go Back</button>
      </a>
    </div>
  );
}
