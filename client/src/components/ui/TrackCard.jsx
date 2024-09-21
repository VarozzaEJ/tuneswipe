import React from "react";
import { Button } from "@/components/ui/button";
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
import { mdiDotsHorizontal, mdiSpotify } from "@mdi/js";
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
                <span className="flex">
                  <Icon path={mdiSpotify} size={1} />
                  {trackArtist}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <span>
                <Icon path={mdiDotsHorizontal} size={1} color="white" />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
