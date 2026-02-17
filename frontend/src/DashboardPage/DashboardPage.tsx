import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { type MapRef } from "@/components/ui/map";

import type { Pin, User } from './types';
import { usePinsAPI } from './usePinsAPI';
import { useCommentsAPI } from './useCommentsAPI';
import { MapSection } from './MapSection';
import { CommentsPanel } from './CommentsPanel';
import { ControlBar } from './ControlBar';


function DashboardPage() {
    const location = useLocation();
    const userFromState = location.state?.userData as User | null;
    const mapRef = useRef<MapRef | null>(null);

    // State Management
    const [isAddingPin, setIsAddingPin] = useState(false);
    const [draggable, setDraggableMarker] = useState<{ lng: number; lat: number }>({ lng: 0, lat: 0 });
    const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
    const [error, setError] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [messageClicked, setMessageClicked] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [newPinData, setNewPinData] = useState({
        title: '',
        description: '',
        imageUrl: ''
    });

    // API Hooks
    const { pinsQuery, createPinMutation, editPinMutation, deletePinMutation } = usePinsAPI();
    const { commentsQuery, createCommentMutation, deleteCommentMutation } = useCommentsAPI(
        selectedPin?.id,
        messageClicked
    );

    // Pin Handlers
    const handleAddPinClick = () => {
        setIsAddingPin(true);
        const center = mapRef.current?.getCenter();
        setDraggableMarker({
            lng: center?.lng ?? 0,
            lat: center?.lat ?? 0,
        });
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

        await createPinMutation.mutateAsync(newPin);
        setIsAddingPin(false);
        setNewPinData({ title: '', description: '', imageUrl: '' });
    };

    const editPin = async (pinId: number) => {
        const newTitle = prompt('Enter new title:');
        const newDescription = prompt('Enter new description:');
        const newImageUrl = prompt('Enter new image URL (optional):');

        if (!newTitle || !newDescription) {
            alert('Title and description cannot be empty');
            return;
        }

        await editPinMutation.mutateAsync({
            pinId,
            title: newTitle,
            description: newDescription,
            imageUrl: newImageUrl || undefined,
        });
    };

    const deletePin = async (pinId: number) => {
        if (!confirm("Are you sure you want to delete this pin?")) {
            return;
        } else if (pinId && commentsQuery.data && commentsQuery.data.length > 0) {
            if (!confirm('Comments are associated with this pin. Deleting it will also delete all comments. Do you want to proceed?')) {
                return;
            }
        }

        await deletePinMutation.mutateAsync(pinId);
        alert('Pin deleted successfully');
    };

    // Comment Handlers
    const saveComment = async (userId: number, pinId: number) => {
        if (!commentText.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        if (commentText.length > 500) {
            setError('Comment cannot exceed 500 characters.');
            return;
        }

        await createCommentMutation.mutateAsync({
            userId,
            pinId,
            text: commentText.trim(),
        });
        setCommentText('');
        setError('');
    };

    const deleteComment = async (commentId: number, pinId: number) => {
        if (!confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        await deleteCommentMutation.mutateAsync({ commentId, pinId });
    };

    const handlePinSelect = (pin: Pin) => {
        setSelectedPin(pin);
        setCommentText('');
        setError('');
    };

    const handleSubmitComment = () => {
        if (!userFromState?.id || !selectedPin?.id) {
            alert('Please log in and select a pin before commenting.');
            return;
        }
        setIsCommenting(false);
        saveComment(userFromState.id, selectedPin.id);
    };

    return (
        <div>
            <div className="h-screen w-full relative">
                <MapSection
                    pins={pinsQuery.data ?? []}
                    isAddingPin={isAddingPin}
                    draggable={draggable}
                    onDragEnd={(lngLat) => setDraggableMarker(lngLat)}
                    onPinSelect={handlePinSelect}
                    onEditPin={editPin}
                    onDeletePin={deletePin}
                    onToggleComments={(pin) => {
                        setSelectedPin(pin);
                        setCommentText('');
                        setError('');
                        setMessageClicked(true);
                    }}
                    userFromState={userFromState}
                    mapRef={mapRef}
                />

                <CommentsPanel
                    selectedPin={selectedPin}
                    messageClicked={messageClicked}
                    onClosePanel={() => setMessageClicked(false)}
                    isCommenting={isCommenting}
                    onToggleCommenting={() => {
                        setIsCommenting(!isCommenting);
                        setError('');
                    }}
                    commentText={commentText}
                    onCommentTextChange={setCommentText}
                    error={error}
                    comments={commentsQuery.data ?? []}
                    userFromState={userFromState}
                    onSubmitComment={handleSubmitComment}
                    onDeleteComment={deleteComment}
                />
            </div>

            <ControlBar
                isAddingPin={isAddingPin}
                userFromState={userFromState}
                draggable={draggable}
                newPinData={newPinData}
                onAddPinClick={handleAddPinClick}
                onNewPinDataChange={setNewPinData}
                onSubmitPin={handleSubmitPin}
                onCancelPin={handleCancelPin}
            />
        </div>
    );
}

export default DashboardPage;

