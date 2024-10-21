import React from 'react'
import PropTypes from 'prop-types'
import { mdiCheckCircle, mdiSpotify } from '@mdi/js'
import Icon from '@mdi/react'


function AddedTopTrackCard({song}) {
    console.log(song)
  return (
    <>
    <div
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
                          <Icon path={mdiCheckCircle} color={"green"} size={1}/>
                        </div>
                      </div>
    </>
  )
}



export default AddedTopTrackCard
