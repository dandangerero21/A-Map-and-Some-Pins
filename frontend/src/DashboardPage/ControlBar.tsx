import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { User } from './types';

interface ControlBarProps {
    isAddingPin: boolean;
    userFromState: User | null;
    draggable: { lng: number; lat: number };
    newPinData: {
        title: string;
        description: string;
        imageUrl: string;
    };
    onAddPinClick: () => void;
    onNewPinDataChange: (data: { title: string; description: string; imageUrl: string }) => void;
    onSubmitPin: () => void;
    onCancelPin: () => void;
}

export function ControlBar({
    isAddingPin,
    userFromState,
    draggable,
    newPinData,
    onAddPinClick,
    onNewPinDataChange,
    onSubmitPin,
    onCancelPin,
}: ControlBarProps) {
    return (
        <div className="absolute w-full bottom-0 z-[50]">
            {!isAddingPin ? (
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

                        <Button className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-white shadow-sm hover:bg-gray-800" onClick={onAddPinClick}>
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm font-medium">Add Pin</span>
                        </Button>
                    </div>
                </div>
            ) : (
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
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Title<span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                                    value={newPinData.title}
                                    onChange={(e) => onNewPinDataChange({ ...newPinData, title: e.target.value })}
                                    placeholder="Short, clear title"
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                                    value={newPinData.imageUrl}
                                    onChange={(e) => onNewPinDataChange({ ...newPinData, imageUrl: e.target.value })}
                                    placeholder="https://"
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Description<span className="text-red-500">*</span></label>
                                <textarea
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                                    value={newPinData.description}
                                    onChange={(e) => onNewPinDataChange({ ...newPinData, description: e.target.value })}
                                    placeholder="Why is this place special?"
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">* required fields</p>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={onCancelPin}>
                                    Cancel
                                </Button>
                                <Button onClick={onSubmitPin}>
                                    Save Pin
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
