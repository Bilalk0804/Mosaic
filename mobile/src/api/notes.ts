// Multipart upload, fetch note status
import { apiClient } from './client';

export const uploadNote = async (title: string, fileUri: string, fileName: string, fileType: string) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: fileType || 'text/plain',
    } as any);

    return (await apiClient.post('/api/notes/upload/', formData, {
        // Leave Content-Type unset so React Native/Axios can add the multipart boundary.
        timeout: 120000,
    })).data;
};

export const getNoteStatus = async (noteId: number) => {
    return (await apiClient.get(`/api/notes/${noteId}/`)).data;
};

export const getExtractedClaims = async (noteId: number) => {
    return (await apiClient.get(`/api/notes/${noteId}/claims/`)).data;
};

export const verifyClaim = async (claimId: number) => {
    return (await apiClient.post(`/api/verification/claims/${claimId}/verify/`)).data;
};

export const getNotes = async () => {
    return (await apiClient.get('/api/notes/')).data;
};
