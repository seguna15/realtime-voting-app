import React from 'react'

const MainContent = ({title}) => {
  return (
    <main>
      <section className="px-4 py-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-slate-800">{title}</h1>
        <p className="mb-4 text-slate-700">
          This is a full-stack web application is built with the MERN (MongoDB,
          Express, React, Node.js) stack & Socket.io. It includes authentication
          features that allow users to sign up, log in, and log out, and
          provides access to protected routes only for authenticated users.
        </p>
        <p className="mb-4 text-slate-700">
          The front-end of the application is built with React, uses React
          Router for client-side routing, Redux toolkit for state management and
          Socket.io-client for frontend websocket connection. The back-end is
          built with Node.js and Express, uses MongoDB as the database and
          Socket.io for websocket connection. Authentication is implemented
          using JSON Web Tokens (JWT). The application also uses firebase as the
          storage bucket for images.
        </p>
        <p className="mb-4 text-slate-700">
          This application is intended to showcase the ability of web socket to
          monitor realtime changes. Socket.io was used to track and display
          votes as soon as they occur.
        </p>
      </section>
    </main>
  );
}

export default MainContent;