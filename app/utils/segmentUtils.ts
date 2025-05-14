// Helper to get a cleaner display name for segments
export const getSegmentDisplayName = (key: string): string => {
    let name = key.replace(/\(B\)|\(R\)|\(T\)/g, "").trim(); // Remove prefixes
    name = name.replace(/segments?|groups?/gi, "").trim(); // Remove "segments", "groups"
    if (name.toLowerCase() === 'mindsets') return 'Market Segments';
    if (name.toLowerCase() === 'prelim-answer') return 'Prelim';
    return name.charAt(0).toUpperCase() + name.slice(1);
};

// Format date string to a consistent format
export const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
        // Handle cases like "Completed / 05/10/2024"
        const datePart = dateString.includes('/') ? dateString.split('/').slice(-3).join('/') : dateString;
        const cleanedDateString = datePart.replace(/[a-zA-Z]+/g, '').trim(); // Remove any textual part like "Completed"
        if (!cleanedDateString) return dateString; // If only text was present
        return new Date(cleanedDateString).toLocaleDateString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
        });
    } catch (e) {
        return dateString; // Return original if parsing fails
    }
};