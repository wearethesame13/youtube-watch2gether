import Head from "next/head";
import YouTube from "react-youtube";
import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  Container,
  CircularProgress,
} from "@material-ui/core";

export default function Home() {
  const [linkVideo, setlinkVideo] = useState("");
  const [videoID, setvideoID] = useState("");
  const [playlistInfo, setplaylistInfo] = useState(null);
  const [loading, setloading] = useState(false);
  // const [playlistId, setplaylistId] = useState("");

  const processLink = (url) => {
    var regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      //error
      // openNotificationWithIcon("error");
    }
  };

  // useEffect(() => {
  //   if (linkVideo) {
  //     setvideoID(processLink(linkVideo));
  //   }
  // }, [linkVideo]);

  // const openNotificationWithIcon = (type) => {
  //   notification[type]({
  //     message: "Link youtube không đúng",
  //     description: "Sử dụng một link chính xác cần xem",
  //   });
  // };

  const fetchPlaylist = async () => {
    const YOUTUBE_PLAYLIST_ITEMS_API =
      "https://www.googleapis.com/youtube/v3/playlistItems";
    const res = await fetch(
      `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&maxResults=100&playlistId=PLI1JPzGwNY3WuG9C2fDIlN4WMrb8m2ZBj&key=AIzaSyAJGBhsuQn0nJwNSv1dMRgSImHPmWo-WzM`
    );
    const data = await res.json();
    setplaylistInfo(data);
  };

  useEffect(() => {
    setloading(true);
    fetchPlaylist().then(() => {
      setvideoID(playlistInfo?.items[0].snippet.resourceId.videoId);
      setloading(false);
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Phim cho Ngọc coi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Container
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 60,
            }}
          >
            {/* <Input
          placeholder="Nhập vào link Youtube"
          value={linkVideo}
          onChange={(e) => setlinkVideo(e.target.value)}
        />{" "}
        <Input
          placeholder="Nhập vào ID playlist"
          value={playlistId}
          onChange={(e) => setplaylistId(e.target.value)}
          onBlur={() => fetchPlaylist()}
        /> */}
            <YouTube videoId={videoID} />
            {playlistInfo && (
              <Select
                variant="outlined"
                onChange={(e) => {
                  setvideoID(e.target.value);
                }}
                style={{ marginTop: 20, width: "50%" }}
                value={videoID}
              >
                {playlistInfo?.items?.map(({ id, snippet = {} }) => {
                  const { title, resourceId = {} } = snippet;
                  return (
                    <MenuItem value={resourceId.videoId} key={id}>
                      {title}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
          </Container>
        )}
      </main>
    </div>
  );
}
