import Head from "next/head";
import YouTube from "react-youtube";
import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  Container,
  CircularProgress,
  Typography,
} from "@material-ui/core";



const PLAYLIST_ID = "PLI1JPzGwNY3WuG9C2fDIlN4WMrb8m2ZBj";

const YOUTUBE_PLAYLIST_ITEMS_API =
  "https://www.googleapis.com/youtube/v3/playlistItems";

export default function Home() {
  const [playlistInfo, setplaylistInfo] = useState([]);
  const [loading, setloading] = useState(false);
  const [videoInfo, setvideoInfo] = useState({});
  const [episode, setepisode] = useState(0);

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

  console.log(process.env.YOUTUBE_API)
  console.log(process.env.YOUTUBE_API_KEY)

  useEffect(() => {
    let canLoadMore = false;
    let result = [];
    let currentPageToken = null;
    const fetchPlaylist = async () => {
      do {
        const fetchAPI = `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${process.env.YOUTUBE_API || process.env.YOUTUBE_API_KEY || 'AIzaSyDNCLnEHTWOkeq_tyNmtxNWAiCSBEdbMmU'}`;
        const res = await fetch(
          canLoadMore ? fetchAPI + `&pageToken=` + currentPageToken : fetchAPI
        );
        const data = await res.json();
        result = result.concat(data.items);
        if (data?.items?.length === 50) {
          canLoadMore = true;
          currentPageToken = data.nextPageToken;
        } else {
          canLoadMore = false;
        }
      } while (canLoadMore);
      setplaylistInfo(result);
      setvideoInfo(result[0]);
      setepisode(0);
    };
    setloading(true);
    fetchPlaylist().then(() => {
      setloading(false);
    });
  }, []);

  useEffect(() => {
    setvideoInfo(playlistInfo[episode]);
  }, [episode, playlistInfo]);

  return (
    <div>
      <Head>
        <title>Phim cho Ngọc coi</title>
        <link rel="icon" href="/kiss.svg" />
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
          <div
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
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
            <YouTube
              videoId={videoInfo?.snippet?.resourceId?.videoId}
              onEnd={() => setepisode(episode + 1)}
              opts={{
                playerVars: {
                  autoplay: 1,
                },
              }}
            />
            <Typography
              style={{ marginTop: 24, width: "50%" }}
              align="center"
              variant="h6"
            >
              {videoInfo?.snippet?.title}
            </Typography>
            {playlistInfo && (
              <Select
                variant="outlined"
                onChange={(e) => {
                  setvideoInfo(e.target.value);
                }}
                style={{ marginTop: 20, width: "50%" }}
                value={videoInfo}
              >
                {playlistInfo?.map((item) => {
                  return (
                    <MenuItem
                      value={item}
                      key={item.snippet.resourceId.videoId}
                    >
                      {item.snippet.title}
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
