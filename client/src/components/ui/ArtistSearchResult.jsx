import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Icon from "@mdi/react";
import { mdiCheck } from "@mdi/js";
import { motion } from "framer-motion";

export default function ArtistSearchResult({ artist }) {
  const [show, setShow] = useState(false);
  return (
    <>
      {show ? (
        <motion.div
          whileInView={{ scale: 0.9 }}
          onClick={() => setShow(!show)}
          className="sm:flex relative max-sm:flex-col justify-start sm:items-center border border-slate-500 md:w-3/4 w-96 cursor-pointer my-4 hover:bg-slate-300 transition-all ease-in-out delay-100 hover:bg-opacity-5 rounded"
        >
          <div className="absolute -top-3 -right-6">
            <Badge className={"ease-in-out transition-all delay-75"}>
              <Icon path={mdiCheck} color="white" size={1} />
            </Badge>
          </div>
          <div className="w-100 flex justify-center">
            {artist.image ? (
              <img
                className="rounded m-2"
                src={artist.image.url}
                alt={artist.artist + "'s Picture"}
                style={{ height: 160, width: 160 }}
              />
            ) : (
              <div
                style={{ height: 160, width: 160 }}
                className="bg-slate-600 rounded m-2 flex items-center justify-center"
              >
                <span>No Image Given</span>
              </div>
            )}
          </div>
          <div className=" w-100 md:ms-5 text-3xl flex justify-center">
            {artist.artist}
          </div>
        </motion.div>
      ) : (
        <div
          onClick={() => setShow(!show)}
          className="sm:flex relative max-sm:flex-col justify-start sm:items-center border border-slate-500 md:w-3/4 w-96 cursor-pointer my-4 hover:bg-slate-300 transition-all ease-in-out delay-100 hover:bg-opacity-5 rounded"
        >
          <div className="absolute -top-3 -right-6"></div>
          <div className="w-100 flex justify-center">
            {artist.image ? (
              <img
                className="rounded m-2"
                src={artist.image.url}
                alt={artist.artist + "'s Picture"}
                style={{ height: 160, width: 160 }}
              />
            ) : (
              <div
                style={{ height: 160, width: 160 }}
                className="bg-slate-600 rounded m-2 flex items-center justify-center"
              >
                <span>No Image Given</span>
              </div>
            )}
          </div>
          <div className=" w-100 md:ms-5 text-3xl flex justify-center">
            {artist.artist}
          </div>
        </div>
      )}
    </>
  );
}
