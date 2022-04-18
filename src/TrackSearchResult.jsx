import React from 'react'

export const TrackSearchResult = ({track,chooseTrack}) => {
  function handlePlay() {
    chooseTrack(track)
    console.log("track selected");
  }

  return (
    <>
      <div 
        className="d-flex m-2 align-items-center"
        style = {{cursor : "pointer"}}
        onClick = {handlePlay}
      >
        <img src={track.albumUrl} styel={{height:"64px", width:"64px"}} alt="" />
        <div className="ml-3">
          <div>{track.title}</div>
          <div className="text-muted">{track.artist}</div>
        </div>
      </div>
    </>
  )
}
