import Icon from "@mdi/react";
import React from "react";

export default function GenreCard({ name, fromColor, toColor, icon }) {
  return (
    <div className="group  flex justify-center">
      <div
        className={`bg-gradient-to-br ${fromColor} ${toColor} p-4 rounded-xl flex flex-col items-center justify-center aspect-square shadow-lg transform transition-transform group-hover:scale-105  w-full cursor-pointer`}
      >
        <Icon path={icon} className="h-10 w-10 text-white mb-3 opacity-90" />
        <span className="font-medium text-white text-center">{name}</span>
      </div>
    </div>
  );
}
