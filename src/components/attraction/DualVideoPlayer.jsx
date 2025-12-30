import React, { useRef } from "react";
import video1 from "../../assets/video/Untitled-design-4.mp4";
import video2 from "../../assets/video/videos.mp4";
import posterImg from "../../assets/videoHero.jpg"; // Thumbnail image

const videoData = [
  {
    id: 1,
    src: video1,
    title: "Left Side Adventure",
    fileName: "Left-Side-Adventure.mp4",
  },
  {
    id: 2,
    src: video2,
    title: "Right Side Exploration",
    fileName: "Right-Side-Exploration.mp4",
  },
];

const DualVideoPlayer = () => {
  const videoRefs = useRef({});

  const handleFullScreen = (id) => {
    const videoElement = videoRefs.current[id];
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.webkitRequestFullscreen) {
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
      videoElement.msRequestFullscreen();
    }
  };

  return (
    <div className="w-full">
      {/* Hero Thumbnail Section */}
      <div className="relative w-full pb-16">
        <img
          src={posterImg}
          alt="Video Hero Thumbnail"
          className="w-full h-[65vh] md:h-[80vh] object-cover"
        />
        <div className="absolute inset-0  flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to the Adventure
          </h1>
          <p className="text-lg md:text-xl">
            Experience immersive video journeys
          </p>
        </div>
      </div>

      {/* Dual Videos Section */}
      <div className="flex flex-col md:flex-row gap-4 w-full h-auto p-4">
        {videoData.map((video) => (
          <div
            key={video.id}
            className="w-full md:w-1/2 rounded-lg overflow-hidden shadow-md"
          >
            <video
              ref={(el) => (videoRefs.current[video.id] = el)}
              src={video.src}
              autoPlay
              loop
              muted
              playsInline
              onClick={() => handleFullScreen(video.id)}
              className="w-full h-auto object-cover cursor-pointer"
              title="Click to view fullscreen"
            />
            <div className="p-3 flex justify-center">
              {/* <a
                href={video.src}
                download={video.fileName}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
              >
                Download Video
              </a> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DualVideoPlayer;
