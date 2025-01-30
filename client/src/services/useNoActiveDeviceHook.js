import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
    clientId: `${import.meta.env.VITE_CLIENT_ID}`,
});
export default function useNoActiveDeviceHook(noActiveDeviceError) {
    const [changeDeviceFormOpen, setChangeDeviceFormOpen] = useState(false);
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
        setAccessToken(localStorage.getItem("accessToken"))
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken]);


    useEffect(() => {
        if (!accessToken || !noActiveDeviceError) return
        fetchDevices()
        //TODO This is only called one time per TrackImageInPost. I am not sure why that is considering the noActiveDeviceError prop is getting changed. This means that a user has to click on a seperate track each time to get the toast asking them to change their active device.
    }, [accessToken, noActiveDeviceError])

    async function fetchDevices() {
        const devices = await spotifyApi.getMyDevices();
        const activeDevice = devices.body.devices.filter((device) => {
            device.is_active === true;
        });
        if (activeDevice.length == 0) {
            //TODO playing music on Spotify might not be how this gets fixed. You might need to change the active device on the form.
            toast.error(
                "You do not have a currently active device, please change your active device",
                {
                    action: {
                        label: "Change Device",
                        onClick: () => {
                            setChangeDeviceFormOpen(true);
                        },
                    },
                }
            );
        } else if (activeDevice.length == 1) {
            toast.error(
                `Your current active device is: ${activeDevice[0].name}. Please start playing any song in Spotify on this device OR change your active device.`,
                {
                    action: {
                        label: "Change Device",
                        onClick: () => {
                            setChangeDeviceFormOpen(true);
                        },
                    },
                }
            );
        }
    }
    return changeDeviceFormOpen
}
