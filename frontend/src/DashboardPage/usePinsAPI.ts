import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Pin } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const fetchPins = async (): Promise<Pin[]> => {
    const response = await fetch(`${API_BASE}/pins`);
    if (!response.ok) {
        throw new Error('Failed to fetch pins');
    }
    return response.json();
};

export const usePinsAPI = () => {
    const queryClient = useQueryClient();

    const pinsQuery = useQuery({
        queryKey: ['pins'],
        queryFn: fetchPins,
    });

    const createPinMutation = useMutation({
        mutationFn: async (newPin: Pin) => {
            const response = await fetch(`${API_BASE}/pins/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPin),
            });
            if (!response.ok) {
                throw new Error('Error creating pin');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pins'] });
        },
    });

    const editPinMutation = useMutation({
        mutationFn: async ({ pinId, title, description, imageUrl }: { pinId: number; title: string; description: string; imageUrl?: string }) => {
            const response = await fetch(`${API_BASE}/pins/${pinId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl: imageUrl || undefined,
                }),
            });
            if (!response.ok) {
                throw new Error('Error editing pin');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pins'] });
        },
    });

    const deletePinMutation = useMutation({
        mutationFn: async (pinId: number) => {
            const response = await fetch(`${API_BASE}/pins/${pinId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error deleting pin');
            }
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pins'] });
        },
    });

    return {
        pinsQuery,
        createPinMutation,
        editPinMutation,
        deletePinMutation,
    };
};
