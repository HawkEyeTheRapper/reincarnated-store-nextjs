import React from 'react';

function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Oops...</h1>
        <p className="text-lg">
          An error occurred while loading this page.
        </p>
      </div>
    </div>
  );
}

export default Error;
