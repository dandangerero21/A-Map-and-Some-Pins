import {useEffect, useState} from 'react'
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


interface Pin {
    id?: number;
    userId: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    imageUrl?: string;
    username?: string;
    createdAt?: Date;
}

function DashboardPage() {
    const location = useLocation();
    const userFromState = location.state?.userData;
    const [pins, setPins] = useState<Array<Pin>>([]);
    const [isAddingPin, setIsAddingPin] = useState(false);
    const [draggable, setDraggableMarker] = useState<{lng: number; lat: number}>({lng: 0, lat: 0});
    const [newPinData, setNewPinData] = useState({
        title: '',
        description: '',
        imageUrl: ''
    });

    const handleAddPinClick = () => {
        setIsAddingPin(true);
        setDraggableMarker({ lng: 0, lat: 0 });
    };

    const handleCancelPin = () => {
        setIsAddingPin(false);
        setNewPinData({ title: '', description: '', imageUrl: '' });
    };

    const handleSubmitPin = async () => {
        if (!newPinData.title || !newPinData.description) {
            alert('Please fill in title and description');
            return;
        }

        const newPin: Pin = {
            userId: userFromState?.id || 0,
            title: newPinData.title,
            description: newPinData.description,
            latitude: draggable.lat,
            longitude: draggable.lng,
            imageUrl: newPinData.imageUrl || undefined,
        };

        await createPin(newPin);
        setIsAddingPin(false);
        setNewPinData({ title: '', description: '', imageUrl: '' });
    };

    const fetchPins = async () => {
        try {
            const response = await fetch('http://localhost:8080/pins');
            const data = await response.json();
            setPins(data);
        } catch (error) {
            console.error('Error fetching pins:', error);
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
                fetchPins();
            } else {
                console.error('Error creating pin:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating pin:', error);

        }
    }

    const editPin = async (pinId: number) => {
        try {
            const newTitle = prompt('Enter new title:');
            const newDescription = prompt('Enter new description:');
            const newImageUrl = prompt('Enter new image URL (optional):');

            if (!newTitle || !newDescription) {
                alert('Title and description cannot be empty');
                return;
            }
            
            const response = await fetch(`http://localhost:8080/pins/${pinId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription,
                    imageUrl: newImageUrl || undefined,
                })
            });
            if (response.ok) {
                fetchPins();
            } else {
                console.error('Error editing pin:', response.statusText);
            }
        } catch (error) {
            console.error('Error editing pin:', error);
        }
    }

    const deletePin = async (pinId: number) => {
        try { 
            if(!confirm("Are you sure you want to delete this pin?")) {
                return;
            }

            const response = await fetch(`http://localhost:8080/pins/${pinId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Pin deleted successfully');
                fetchPins();
            } else {
                console.error('Error deleting pin:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting pin:', error);
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
                    {!isAddingPin && pins.map((pin, index) => (
                        
                        <MapMarker
                            key={index}
                            longitude={pin.longitude}
                            latitude={pin.latitude}
                            minZoom={3}
                        >
                            <MarkerContent>
                                <MapPin />
                                <MarkerLabel>{pin.title}</MarkerLabel>
                            </MarkerContent>
                                <MarkerPopup>
                                    <div className="relative h-32 overflow-hidden rounded-t-md">
                                        <img
                                            src ={pin.imageUrl || 'https://via.placeholder.com/150'}
                                            alt={pin.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="p-2">
                                        <h3 className="font-medium text-lg text-foreground">{pin.title}</h3>
                                        <p className="text-md">by {pin.username || "anonymous"}</p>
                                        <p className="text-xs text-muted-foreground">
                                            at {pin.createdAt ? new Date(pin.createdAt).toLocaleString() : ''}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {pin.latitude.toFixed(4)}, {pin.longitude.toFixed(4)}
                                        </p>
                                        <br />
                                        <p className="text-sm">{pin.description}</p>
                                    </div>

                                    {!isAddingPin && userFromState.username == pin.username && (
                                        <div className="bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-100">
                                            <Button onClick = {() => editPin(pin.id!)}>
                                                <p>Edit Pin</p>
                                            </Button>
                                            <Button onClick= {() => deletePin(pin.id!)}>
                                                <p>Delete Pin</p>
                                            </Button>
                                        </div>
                                    )}
                                </MarkerPopup>
                        </MapMarker>
                    ))}
                    
                    {isAddingPin && (
                        <MapMarker
                          draggable
                          longitude={draggable.lng}
                          latitude={draggable.lat}
                          onDragEnd={(lngLat) => {
                            setDraggableMarker({ lng: lngLat.lng, lat: lngLat.lat });
                          }}
                        >
                          <MarkerContent>
                            <div className="cursor-move">
                              <MapPin
                                className="fill-red-500 stroke-white"
                                size={32}
                              />
                            </div>
                          </MarkerContent>
                          <MarkerPopup>
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">New Pin Location</p>
                              <p className="text-xs text-muted-foreground">
                                {draggable.lat.toFixed(4)},{" "}
                                {draggable.lng.toFixed(4)}
                              </p>
                            </div>
                          </MarkerPopup>
                        </MapMarker>
                    )}
                </Map>
            </div>
            {!isAddingPin ? (
                <div className="absolute w-full bottom-0 z-[50] flex flex-row justify-between items-center gap-4 bg-white p-2 p-4">
                    <span>
                        {userFromState ? `Welcome, ${userFromState.username}!` : 'Not logged in'}
                    </span>

                    <Button className="flex items-center space-x-2 cursor-pointer" onClick={handleAddPinClick}>
                            <MapPin />
                            <span>Add Pin</span>
                    </Button>
                </div>
            ) : (
                <div className="absolute w-full bottom-0 z-[50] bg-white p-4 shadow-lg">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <h2 className="text-xl font-bold">Add New Pin</h2>
                        <p className="text-sm text-gray-600">Drag the red marker to your desired location on the map</p>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title*</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={newPinData.title}
                                    onChange={(e) => setNewPinData({ ...newPinData, title: e.target.value })}
                                    placeholder="Enter pin title"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Description*</label>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    value={newPinData.description}
                                    onChange={(e) => setNewPinData({ ...newPinData, description: e.target.value })}
                                    placeholder="Enter pin description"
                                    rows={3}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={newPinData.imageUrl}
                                    onChange={(e) => setNewPinData({ ...newPinData, imageUrl: e.target.value })}
                                    placeholder="Enter image URL"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={handleCancelPin}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitPin}>
                                Save Pin
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

export default DashboardPage