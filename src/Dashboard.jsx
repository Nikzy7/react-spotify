import React, { useState } from "react";
import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import { TrackSearchResult } from "./TrackSearchResult";
import { Player } from "./Player";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "dcbb76ddcd6940c1b97d9a420c251216",
});

export const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics,setLyrics] = useState("");

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  useEffect(() => {
    if(!playingTrack) return;
    axios
      .get("http://localhost:3001/lyrics", {
        params: { track: playingTrack.title, artist: playingTrack.artist },
      })
      .then((res) => {
        console.log(res);
        setLyrics(res.data.lyrics);
      });
  },[playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;

    spotifyApi.searchTracks(search).then((res) => {
      if(cancel) return;

      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })

    return () => cancel = true;
  }, [search, accessToken]);

  return (
    <>
      <Container
        className="d-flex flex-column py-2"
        style={{ height: "100vh" }}
      >
        <Form.Control
          type="search"
          placeholder="Search Song/Artists"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
          {
            searchResults.map(track => {
              // console.log(track);
              return <TrackSearchResult track={track} chooseTrack={chooseTrack} key={track.uri} />
            })
          }
        </div>

        {searchResults.length === 0 && (
          <div className="text-center" style={{whitespace:"pre"}}>
            {lyrics}
          </div>
        )}
        <div>
          <Player accessToken={accessToken} trackUri={playingTrack?.uri}/>
        </div>
      </Container>
    </>
  );
}
