import React from 'react';

const ProgressScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-400">
            <h1 className="text-2xl font-bold text-amber-500 mb-2">My Progress</h1>
            <p>Track your belt journey and stats.</p>
        </div>
    );
};

export default ProgressScreen;
