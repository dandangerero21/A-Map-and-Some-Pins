import {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "@/components/ui/map";
import { MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type MapLibreGL from 'maplibre-gl';

interface Comment {
    id?: number;
    userId: number;
    pinId: number;
    text: string;
    createdAt?: string;
    username?: string;
}

interface Pin {
    id?: number;
    userId: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    imageUrl?: string;
    username?: string;
    createdAt?: string;
}

function DashboardPage() {
    const location = useLocation();
    const userFromState = location.state?.userData;
    const [pins, setPins] = useState<Array<Pin>>([]);
    const [isAddingPin, setIsAddingPin] = useState(false);
    const [draggable, setDraggableMarker] = useState<{lng: number; lat: number}>({lng: 0, lat: 0});
    const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
    const [comments, setComments] = useState<Array<Comment>>([]);
    const [error, setError] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [messageClicked, setMessageClicked] = useState(false);
    const [commentText, setCommentText] = useState('');
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

    const fetchComments = async (pinId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/comments/pins/${pinId}`);
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    const saveComment = async (userId: number, pinId: number) => {
        if (!commentText.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        if(commentText.length > 500) {
            setError('Comment cannot exceed 500 characters.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/comments/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    pinId: pinId,
                    text: commentText.trim(),
                }),
            });
            if (response.ok) {
                fetchComments(pinId);
                setCommentText('');
            } else {
                console.error('Error saving comment:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving comment:', error);
        }
    }

    const deleteComment = async (commentId: number, pinId: number) => {
        try {
            if (!confirm("Are you sure you want to delete this comment?")) {
                return;
            }

            const response = await fetch(`http://localhost:8080/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchComments(pinId);
            } else {
                console.error('Error deleting comment:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }

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
            <div className="h-screen w-full relative">
                <Map
                    center={[0, 0]}
                    zoom={2}
                    projection={{ type: "globe" }}
                    >
                    {!isAddingPin && pins.map((pin, index) => (
                            <MapMarker
                                key={index}
                                longitude={pin.longitude}
                                latitude={pin.latitude}
                                minZoom={3}
                            >
                                <MarkerContent>
                                    <div className="flex items-center gap-1" onClick={() => { setSelectedPin(pin); fetchComments(pin.id!); setCommentText(''); setError(''); }}>
                                        {pin.username === userFromState?.username ? (
                                            <MapPin className="fill-emerald-500 stroke-white" size={28} />
                                        ) : (
                                            <MapPin className="fill-rose-500 stroke-white" size={28} />
                                        )}
                                        
                                        <MarkerLabel className='text-white'>{pin.title}</MarkerLabel>
                                    </div>
                                </MarkerContent>
                                    <MarkerPopup className="w-72 max-h-[60vh] overflow-hidden p-0">
                                        <div className="relative h-32 overflow-hidden rounded-t-md">
                                            <img
                                                src ={pin.imageUrl || 'https://via.placeholder.com/150'}
                                                alt={pin.title}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>

                                        <div className="max-h-[calc(60vh-8rem)] overflow-auto p-2">
                                            <div className="flex flex-col">
                                                <h3 className="font-medium text-lg text-foreground">{pin.title}</h3>
                                                <p className="text-md">by {pin.username || "anonymous"}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    at {pin.createdAt ? new Date(pin.createdAt).toLocaleString() : ''}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {pin.latitude.toFixed(4)}, {pin.longitude.toFixed(4)}
                                                </p>
                                            </div>

            
                                            <div className="rounded-lg border border-gray-200/80 p-2">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</p>
                                                <div className="mt-2 text-sm break-words">{pin.description}</div>
                                            </div>

                                            
                                        </div>

                                        <Button variant="outline" className="absolute bottom-2 right-2 rounded-full p-1" onClick={() => { setMessageClicked(!messageClicked); fetchComments(pin.id!); }}>
                                            <MessageCircle className="h-4 w-4" />
                                        </Button>

                                        {!isAddingPin && userFromState.username == pin.username && (
                                            <div className="px-2 pb-2">
                                                <div className="flex gap-2">
                                                    <Button onClick = {() => editPin(pin.id!)}>
                                                        <p>Edit Pin</p>
                                                    </Button>
                                                    <Button onClick= {() => deletePin(pin.id!)}>
                                                        <p>Delete Pin</p>
                                                    </Button>
                                                </div>
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

                {!isAddingPin && selectedPin && messageClicked && (
                    <div className="absolute top-4 right-4 z-[60] w-80">
                        <div className="rounded-2xl border border-gray-200/80 bg-white/95 shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur">
                            <div className="flex items-start justify-between border-b border-gray-100 px-4 py-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500">Pin Details</p>
                                    <h3 className="text-base font-semibold text-gray-900">{selectedPin.title}</h3>
                                    <p className="text-xs text-gray-500">by {selectedPin.username || "anonymous"}</p>
                                </div>

                                <Button variant="outline" size="icon" onClick={() => setMessageClicked(false)}>
                                    <span className="sr-only">Close</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </Button>
                            </div>

                            <div className="max-h-[70vh] overflow-auto px-4 py-3">
                                <div className="rounded-lg border border-gray-200/80 p-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</p>
                                    <p className="mt-2 text-sm text-gray-800 break-words">{selectedPin.description}</p>
                                </div>

                                <div className="mt-3 rounded-lg border border-gray-200/80 p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Comments</p>
                                        <Button variant="outline" onClick={() => { setIsCommenting(!isCommenting); setError(''); }}>
                                            <MessageCircle className="h-4 w-4" />
                                            <span className="text-xs">Add Comment</span>
                                        </Button>
                                    </div>

                                    <p className="text-red-500 text-sm">{error}</p>

                                    <div className="mt-2 space-y-2">

                                        { isCommenting && (
                                            <div className="space-y-2">
                                                <textarea
                                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                                                    placeholder="Write your comment here..."
                                                    rows={3}
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                ></textarea>
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" onClick={() => setIsCommenting(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            if (!userFromState?.id || !selectedPin?.id) {
                                                                alert('Please log in and select a pin before commenting.');
                                                                return;
                                                            }
                                                            setIsCommenting(false);
                                                            saveComment(userFromState.id, selectedPin.id);
                                                        }}
                                                    >
                                                        Submit
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        {comments.length === 0 ? (
                                            <p className="text-sm text-gray-600">No comments yet. Be the first to comment!</p>
                                        ) : (
                                            comments.map((comment, index) => (
                                                <div key={index} className="rounded-md bg-gray-50 p-2">
                                                    <p className="text-xs text-gray-500"> <span className="font-semibold">{comment.username || "anonymous"}</span> commented:</p>
                                                    <p className='text-xs text-muted-foreground'>at {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "unknown time"}</p>
                                                    <p className="text-sm text-gray-800">{comment.text}</p>
                                                    {userFromState?.username === comment.username && (
                                                        <div className="mt-1">
                                                            <Button variant="outline" onClick={() => deleteComment(comment.id!, selectedPin.id!)}>
                                                                <span className='text-xs text-muted-foreground'>Delete Comment</span>
                                                            </Button>
                                                        </div>
                                                    )}

                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {!isAddingPin ? (
                <div className="absolute w-full bottom-0 z-[50]">
                    <div className="mx-4 mb-4 rounded-2xl border border-gray-200/70 bg-white/90 px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur">
                        <div className="flex flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-rose-200">
                                    <MapPin className="h-5 w-5 text-rose-700" />
                                </div>
                                <div className="leading-tight">
                                    <span className="block text-xs uppercase tracking-wider text-gray-500">Map Dashboard</span>
                                    <span className="block text-sm font-semibold text-gray-900">
                                        {userFromState ? `Welcome, ${userFromState.username}!` : 'Not logged in'}
                                    </span>
                                </div>
                            </div>

                            <Button className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-white shadow-sm hover:bg-gray-800" onClick={handleAddPinClick}>
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm font-medium">Add Pin</span>
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="absolute w-full bottom-0 z-[50]">
                    <div className="mx-4 mb-4 rounded-2xl border border-gray-200/70 bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur">
                        <div className="flex flex-col gap-4 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-200 to-cyan-200">
                                        <MapPin className="h-4 w-4 text-emerald-700" />
                                    </div>
                                    <div className="leading-tight">
                                        <h2 className="text-base font-semibold text-gray-900">Add a New Pin</h2>
                                        <p className="text-xs text-gray-600">Drag the red marker to place it on the map.</p>
                                    </div>
                                </div>
                                <div className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                                    {draggable.lat.toFixed(4)}, {draggable.lng.toFixed(4)}
                                </div>
                            </div>

                            <div className="grid gap-3 md:grid-cols-3">
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Title*</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                                        value={newPinData.title}
                                        onChange={(e) => setNewPinData({ ...newPinData, title: e.target.value })}
                                        placeholder="Short, clear title"
                                    />
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                                        value={newPinData.imageUrl}
                                        onChange={(e) => setNewPinData({ ...newPinData, imageUrl: e.target.value })}
                                        placeholder="https://"
                                    />
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description*</label>
                                    <textarea
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                                        value={newPinData.description}
                                        onChange={(e) => setNewPinData({ ...newPinData, description: e.target.value })}
                                        placeholder="Why is this place special?"
                                        rows={2}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">* required fields</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={handleCancelPin}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSubmitPin}>
                                        Save Pin
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

export default DashboardPage

