import React, { useState } from 'react';

function App() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (name && email) {
            // You can also add validation for email format if necessary
            setVideoUrl('https://task-32-server.vercel.app/video');
        } else {
            alert('Please enter both name and email.');
        }
    };

    return (
        <div className="App">
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>
                        Name:
                        <input type="text" value={name}  onChange={(e) => setName(e.target.value)} required />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                </div>
                <button type="submit">Play Video</button>
            </form>
            {videoUrl && (
                <video controls width="600">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
}

export default App;
