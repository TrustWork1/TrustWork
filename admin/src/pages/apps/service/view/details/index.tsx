import React from 'react'

const index = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const query = params.get("serviceId");

  return (
    <div>
      hello
      <h1>id:{query}</h1>
    </div>
  )
}

export default index
