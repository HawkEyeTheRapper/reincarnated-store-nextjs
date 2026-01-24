import { NextPageContext } from 'next';
import React from 'react';

type ErrorProps = {
  statusCode?: number;
};

function Error({ statusCode }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Oops...</h1>
        <p className="text-lg">
          {statusCode
            ? `A ${statusCode} error occurred on the server.`
            : 'An error occurred on the client.'}
        </p>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;
  return { statusCode };
};

export default Error;
