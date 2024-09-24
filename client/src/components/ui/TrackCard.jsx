import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Icon from "@mdi/react";
import {
  mdiDiameterVariant,
  mdiDotsHorizontal,
  mdiPlusCircle,
  mdiPlusCircleOutline,
  mdiSpotify,
} from "@mdi/js";
export default function TrackCard({ image, trackArtist, trackTitle }) {
  return (
    <>
      <Card className="w-full max-w-md bg-slate-800 text-white">
        <CardHeader className="px-0 pt-0">
          <img
            className="rounded-lg max-w-full"
            style={{ height: 350 }}
            src={image}
            alt=""
          />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div className=" block">
              <div>
                <span>{trackTitle}</span>
              </div>
              <div>
                <span className="flex text-slate-500">
                  <Icon path={mdiSpotify} size={1} />
                  {trackArtist}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <Drawer>
                <DrawerTrigger>
                  <span aria-label="Open drawer to see more actions">
                    <Icon
                      title="Open Options Menu"
                      path={mdiDotsHorizontal}
                      size={1.4}
                      color="white"
                      className="cursor-pointer"
                    />
                  </span>
                </DrawerTrigger>
                <DrawerContent className="bg-slate-800">
                  <div className="w-full mx-auto flex flex-col ">
                    <div className="flex flex-col justify-center items-center mt-3">
                      <img
                        style={{ height: 150, width: 150 }}
                        src={image}
                        alt={`${trackArtist}'s image'`}
                      />
                      <span>{trackTitle}</span>
                      <span className="text-slate-500">{trackArtist}</span>
                    </div>
                    <span className="flex mb-4 text-lg">
                      <Icon
                        path={mdiPlusCircleOutline}
                        color="white"
                        className="me-4"
                        size={1}
                      />
                      Save Song
                    </span>
                    <span className="flex mb-4 text-lg">
                      <Icon
                        path={mdiDiameterVariant}
                        color="red"
                        className="me-4"
                        size={1}
                      />
                      Skip this Song
                    </span>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
