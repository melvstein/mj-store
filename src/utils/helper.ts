export const formatDateTime = (dateString: string | Date) => {
    return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
};