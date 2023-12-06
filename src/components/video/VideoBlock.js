import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";

import "./VideoBlock.scss";
import ReactPlayer from "react-player";
import api from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  postVideoDuration,
  updateCorporateVideoDuration,
} from "../../services/eddiServices";

function VideoBlock(props) {
  const playerRef = useRef();
  const state = useSelector((state) => state?.Eddi);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!props?.normalVideo) {
      playerRef.current.seekTo(Number(props?.url?.watched_time || 0));
    }
  }, [props]);

  useEffect(() => {
    if (!props?.normalVideo) {
      var a = document.getElementsByTagName("video")[0];
      if (a) return (a.controlsList = "nodownload");
    }
  }, [isPlaying]);

  const onProgress = async (e) => {
    try {
      let played = e?.played * 100;
      played = played.toFixed();
      if (played == 0) return;
      var a = document.getElementsByTagName("video")[0];
      if (a) a.controlsList = "nodownload";
      let formData = new FormData();

      formData.append("video_watched_time ", e?.playedSeconds);
      formData.append("progress_status ", Number(played || 0));
      formData.append("course_type ", props.courseType);
      await updateCorporateVideoDuration(props?.url?.uuid, formData);
    } catch (err) {
      console.log(">>>err", err);
    }
  };

  const onEndVideo = async (e) => {
    if (props?.material.length > 0) {
      let formData = new FormData();
      // duration
      formData.append("progress_status ", Number(100));
      formData.append("video_watched_time ", 0);
      formData.append("course_type ", props.courseType);
      await updateCorporateVideoDuration(props?.url?.uuid, formData);
      props?.getMaterial();
      setIsPlaying(false);
    }
  };

  const onMainDivClick = () => {
    var a = document.getElementsByTagName("video")[0];
    a.controlsList = "nodownload";
  };

  return (
    <div
      className="video-main"
      onMouseEnter={onMainDivClick}
      onMouseLeave={onMainDivClick}
    >
      {props?.normalVideo === true ? (
        <ReactPlayer
          controls={true}
          className="react-player"
          style={{ width: "100%", height: "460px" }}
          url={`${props?.url?.url}`}
        />
      ) : (
        <ReactPlayer
          // light = {true}
          ref={playerRef}
          progressInterval={10000}
          className="react-player"
          url={
            props?.url
              ? `${props?.url?.url}`
              : "https://player.vimeo.com/video/76979871?pip=1&speed=1"
          }
          controls={true}
          controlsList="nodownload"
          playing={isPlaying}
          onEnded={onEndVideo}
          onProgress={(e) => onProgress(e)}
          loop={false}
          style={{ width: "100%", height: "460px" }}
          onPlay={() => setIsPlaying(true)}
        />
      )}
    </div>
  );
}

export default VideoBlock;
