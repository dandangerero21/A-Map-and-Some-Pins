import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Comment } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const fetchComments = async (pinId: number): Promise<Comment[]> => {
    const response = await fetch(`${API_BASE}/comments/pins/${pinId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch comments');
    }
    return response.json();
};

export const useCommentsAPI = (selectedPinId: number | undefined, enabled: boolean) => {
    const queryClient = useQueryClient();

    const commentsQuery = useQuery({
        queryKey: ['comments', selectedPinId],
        queryFn: () => fetchComments(selectedPinId!),
        enabled: Boolean(selectedPinId && enabled),
    });

    const createCommentMutation = useMutation({
        mutationFn: async ({ userId, pinId, text }: { userId: number; pinId: number; text: string }) => {
            const response = await fetch(`${API_BASE}/comments/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    pinId,
                    text,
                }),
            });
            if (!response.ok) {
                throw new Error('Error saving comment');
            }
            return response.json();
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.pinId] });
        },
    });

    const deleteCommentMutation = useMutation({
        mutationFn: async ({ commentId }: { commentId: number; pinId: number }) => {
            const response = await fetch(`${API_BASE}/comments/${commentId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error deleting comment');
            }
            return true;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.pinId] });
        },
    });

    return {
        commentsQuery,
        createCommentMutation,
        deleteCommentMutation,
    };
};
