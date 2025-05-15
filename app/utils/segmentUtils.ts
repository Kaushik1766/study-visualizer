export const getSegmentDisplayName = (key: string): string => {
    let name = key.replace(/\(B\)|\(R\)|\(T\)/g, "").trim();
    name = name.replace(/segments?|groups?/gi, "").trim();
    if (name.toLowerCase() === 'mindsets') return 'Market Segments';
    if (name.toLowerCase() === 'prelim-answer') return 'Prelim';
    return name.charAt(0).toUpperCase() + name.slice(1);
};

export const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
        const datePart = dateString.includes('/') ? dateString.split('/').slice(-3).join('/') : dateString;
        const cleanedDateString = datePart.replace(/[a-zA-Z]+/g, '').trim();
        if (!cleanedDateString) return dateString;
        return new Date(cleanedDateString).toLocaleDateString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
        });
    } catch (e) {
        return dateString;
    }
};