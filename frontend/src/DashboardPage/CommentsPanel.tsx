import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { Comment, Pin, User } from './types';

interface CommentsPanelProps {
    selectedPin: Pin | null;
    messageClicked: boolean;
    onClosePanel: () => void;
    isCommenting: boolean;
    onToggleCommenting: () => void;
    commentText: string;
    onCommentTextChange: (text: string) => void;
    error: string;
    comments: Comment[];
    userFromState: User | null;
    onSubmitComment: () => void;
    onDeleteComment: (commentId: number, pinId: number) => void;
}

export function CommentsPanel({
    selectedPin,
    messageClicked,
    onClosePanel,
    isCommenting,
    onToggleCommenting,
    commentText,
    onCommentTextChange,
    error,
    comments,
    userFromState,
    onSubmitComment,
    onDeleteComment,
}: CommentsPanelProps) {
    if (!messageClicked || !selectedPin) {
        return null;
    }

    return (
        <div className="absolute top-4 right-4 z-[60] w-80">
            <div className="rounded-2xl border border-gray-200/80 bg-white/95 shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur">
                <div className="flex items-start justify-between border-b border-gray-100 px-4 py-3">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500">Pin Details</p>
                        <h3 className="text-base font-semibold text-gray-900">{selectedPin.title}</h3>
                        <p className="text-xs text-gray-500">by {selectedPin.username || "anonymous"}</p>
                    </div>

                    <Button variant="outline" size="icon" onClick={onClosePanel}>
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
                            <Button variant="outline" onClick={onToggleCommenting}>
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-xs">Add Comment</span>
                            </Button>
                        </div>

                        <p className="text-red-500 text-sm">{error}</p>

                        <div className="mt-2 space-y-2">
                            {isCommenting && (
                                <div className="space-y-2">
                                    <textarea
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                                        placeholder="Write your comment here..."
                                        rows={3}
                                        value={commentText}
                                        onChange={(e) => onCommentTextChange(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={onToggleCommenting}>
                                            Cancel
                                        </Button>
                                        <Button variant="outline" onClick={onSubmitComment}>
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
                                                <Button variant="outline" onClick={() => onDeleteComment(comment.id!, selectedPin.id!)}>
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
    );
}
