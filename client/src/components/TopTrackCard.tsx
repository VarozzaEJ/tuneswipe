import { mdiCheckCircle, mdiPlus, mdiSpotify } from '@mdi/js'
import Icon from '@mdi/react'

import React, { useEffect, useState } from 'react'

export default function TopTrackCard({song, chosenSongCards}) {
    const [show, setShow] = useState(false)
    console.log(chosenSongCards)
    useEffect(() => {
      chosenSongCards.forEach(chosenSong => {
        song.id == chosenSong.id ? setShow(true) : {}
      })
    }, [chosenSongCards])
    return (
    <>
    <div
                      onClick={() => {
                        setShow(!show)
                }}
                        className="flex justify-between mb-4 cursor-pointer hover:bg-slate-700 transition-all ease-in-out rounded-sm"
                      >
                        <div className="flex">
                          <img
                            className="rounded-sm"
                            src={song.album.images[2].url}
                            alt={`Cover image for ${song.name}`}
                          />
                          <div className="flex flex-col justify-center ms-4">
                            <span>{song.name}</span>
                            <span className="flex text-slate-400">
                              <Icon path={mdiSpotify} color="white" size={1} />
                              {song.artists[0].name}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          {show || chosenSongCards.id == song.id ? <Icon path={mdiCheckCircle} color={"green"} size={1}/> : <Icon path={mdiPlus} color="white" size={1} />}
                        </div>
                      </div>
    </>
  )
}
