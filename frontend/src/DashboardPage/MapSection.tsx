
import {
    Map,
    MapMarker,
    MarkerContent,
    MarkerLabel,
    MarkerPopup,
    type MapRef,
} from "@/components/ui/map";
import { MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pin, User } from './types';



interface MapSectionProps {
    pins: Pin[];
    isAddingPin: boolean;
    draggable: { lng: number; lat: number };
    onDragEnd: (lngLat: { lng: number; lat: number }) => void;
    onPinSelect: (pin: Pin) => void;
    onEditPin: (pinId: number) => void;
    onDeletePin: (pinId: number) => void;
    onToggleComments: (pin: Pin) => void;
    userFromState: User | null;
    mapRef: React.RefObject<MapRef | null>;
}

export function MapSection({
    pins,
    isAddingPin,
    draggable,
    onDragEnd,
    onPinSelect,
    onEditPin,
    onDeletePin,
    onToggleComments,
    userFromState,
    mapRef,
}: MapSectionProps) {
    return (
        <Map
            ref={mapRef}
            center={[121.77, 12.88]}
            zoom={5}
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
                        <div className="flex items-center gap-1" onClick={() => onPinSelect(pin)}>
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
                                src={pin.imageUrl || 'https://via.placeholder.com/150'}
                                alt={pin.title}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        <div className="max-h-[calc(60vh-8rem)] overflow-auto p-2">
                            <div className="flex flex-col">
                                <h3 className="font-medium text-lg text-foreground">{pin.title}</h3>
                                <p className="text-md">by {pin.username || "anonymous"}</p>
                                <p className="text-xs text-muted-foreground">
                                    at {pin.createdAt ? new Date(pin.createdAt).toLocaleString() : "unknown time"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {pin.latitude.toFixed(4)}, {pin.longitude.toFixed(4)}
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200/80 p-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</p>
                                <div className="mt-2 text-sm break-words">{pin.description}</div>
                            </div>
                            
                            {!isAddingPin && userFromState?.username == pin.username && (
                                <div className="flex gap-2">
                                    <Button onClick={() => onEditPin(pin.id!)}>
                                        <p>Edit Pin</p>
                                    </Button>
                                    <Button onClick={() => onDeletePin(pin.id!)}>
                                        <p>Delete Pin</p>
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            className="absolute top-2 right-2 rounded-full p-1"
                            onClick={() => onToggleComments(pin)}
                        >
                            <MessageCircle className="h-4 w-4" />
                        </Button>
                    </MarkerPopup>
                </MapMarker>
            ))}

            {isAddingPin && (
                <MapMarker
                    draggable
                    longitude={draggable.lng}
                    latitude={draggable.lat}
                    onDragEnd={(lngLat) => {
                        onDragEnd({ lng: lngLat.lng, lat: lngLat.lat });
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
    );
}
