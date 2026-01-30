import { Link } from 'react-router-dom'
import {useEffect, useState, useId} from 'react'
import { useLocation } from 'react-router-dom'
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "@/components/ui/map";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Star, Navigation, Clock, ExternalLink } from "lucide-react";

interface Pin {
    userId: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    imageUrl?: string;
}

function DashboardPage() {
    const location = useLocation();
    const userFromState = location.state?.userData;
    const [pins, setPins] = useState<Array<Pin>>([]);

    const fetchPins = async () => {
        try {
            const response = await fetch('http://localhost:8080/pins');
            const data = await response.json();
            setPins(data);
        } catch (error) {
            console.error('Error fetching pins:', error);
        } finally {
            // Optionally, you can set a loading state here
        }
    }

    const fetchPinsByUserId = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/pins/user/${userId}`);
            const data = await response.json();
            setPins(data);
        } catch (error) {
            console.error('Error fetching pins by user ID:', error);
        } finally {
            // Optionally, you can set a loading state here
        }

    }

    const createPin = async (newPin: Pin) => {
        try {
            const response = await fetch('http://localhost:8080/pins/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPin),
            });
            if (response.ok) {
                // Pin created successfully
                fetchPins(); // Refresh the pins list
            } else {
                console.error('Error creating pin:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating pin:', error);

        } finally {
            // Optionally, you can set a loading state here
        }
    }

    useEffect(() => {
        fetchPins();
    }, [Button]);

    return (
        <div>
            <div className="h-screen w-full">
                <Map
                    center={[0, 0]}
                    zoom={2}
                    >
                    {pins.map((pin, index) => (
                        
                        <MapMarker
                            key={index}
                            longitude={pin.longitude}
                            latitude={pin.latitude}
                        >
                            <MarkerContent>
                                <MapPin />
                                <MarkerLabel>{pin.title}</MarkerLabel>
                                <MarkerPopup>{pin.description}</MarkerPopup>
                            </MarkerContent>
                        </MapMarker>
                    ))}
                </Map>
            </div>
            <div className="absolute w-full bottom-0 z-[50] flex flex-row justify-between items-center gap-4 bg-white p-2 p-4">
                <span>
                    {userFromState ? `Welcome, ${userFromState.username}!` : 'Not logged in'}
                </span>

                <Button className="flex items-center space-x-2" onClick={() => {
                        const newPin: Pin = {
                            title: 'A Pin',
                            description: 'This is a new pin added from the dashboard.',
                            latitude: Math.random() * 180 - 90, // Random latitude between -90 and 90
                            longitude: Math.random() * 360 - 180, // Random longitude between -180 and 180
                            imageUrl: undefined,
                            userId: userFromState ? userFromState.id : undefined
                        };
                        createPin(newPin);
                        }}>

                        <MapPin />
                        <span>Add Pin</span>
                </Button>
            </div>
        </div>

    )
}

export default DashboardPage