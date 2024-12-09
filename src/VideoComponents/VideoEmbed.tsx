import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import './video-embed.css';

interface VideoEmbedProps {
    videoUrl: string;
    height: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoUrl, height }) => {
    const [videoProgress, setVideoProgress] = useState(0);
    const playerRef = React.useRef<ReactPlayer>(null);
    const [modifiedVideoUrl, setModifiedVideoUrl] = useState<string>(videoUrl);

    useEffect(() => {
        const fetchVideoProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                const videoKey = `videoProgress_${videoUrl}`;

                //Check if progress exists in localStorage
                const savedProgress = localStorage.getItem(videoKey);
                console.log('Saved progress:', savedProgress);
                let progress = 0;
                if (savedProgress) {
                    progress = parseFloat(savedProgress);
                    setVideoProgress(progress);
                } else if (token) {
                    // Fetch from backend if not in localStorage
                    const response = await axios.get(`http://localhost:8080/api/videos/progress`, {
                        params: { videoUrl },
                        headers: { Authorization: token }
                    });
                    console.log('Video progress response:', response);
                    progress = response.data.progress;
                    setVideoProgress(response.data.progress);
                }

                if (progress > 0) {
                    const urlWithTime = `${videoUrl}?t=${Math.floor(progress)}s`;
                    setModifiedVideoUrl(urlWithTime);
                } else {
                    setModifiedVideoUrl(videoUrl);
                }
            } catch (error: any) {
                console.error('Failed to fetch video progress from backend:', error);
            }
        };

        fetchVideoProgress();
    }, [videoUrl]);

    const handleProgress = (state: { playedSeconds: number}) => {
        const currentProgress = state.playedSeconds;
        setVideoProgress(currentProgress);

        const videoKey = `videoProgress_${videoUrl}`;
        localStorage.setItem(videoKey, currentProgress.toString());

        //Save to backend periodically
        if (currentProgress % 30 < 1) {
            saveProgressToBackend(currentProgress);
        }
    };

    const handlePause = () => {
        saveProgressToBackend(videoProgress);
    };

    const saveProgressToBackend = async (progress: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.post(`http://localhost:8080/api/videos/progress`, 
                { videoUrl, progress },
                { headers: { Authorization: token } }
            );
            //console.log(`Successfuly saved ${videoUrl} with progress ${progress} to server`);
        } catch (error: any) {
            console.error('Failed to save video progress to backend:', error);
        }
    }

    return (
        <div className="video-container" style={{ height }}>
            <ReactPlayer
                ref={playerRef}
                url={modifiedVideoUrl}
                width="100%"
                height="100%"
                controls={true}
                playing={false}
                onProgress={handleProgress}
                onPause={handlePause}
                progressInterval={1000} // Progress event fired every second    
            />
        </div>
    );
}

export default VideoEmbed;