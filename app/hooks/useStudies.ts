import { useQuery } from '@tanstack/react-query';
import { StudyResponse } from '@/types/StudyResponse';

async function fetchStudiesAPI(): Promise<StudyResponse[]> {
    const res = await fetch('https://studiesapi.tikuntech.com/mf2/user/studies', {
        headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzI3ODkwNywianRpIjoiMTdlYWIwODctMGNhMC00NzVkLWEwMWQtMmFhYmU5ZjY2NWRkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3RAZ21haWwuY29tIiwibmJmIjoxNzQ3Mjc4OTA3LCJjc3JmIjoiMGIzYzg5YTktZjc1NC00NzE3LTliNDctZjI5ZmE2OWU5N2Q1IiwiZXhwIjoxNzQ5ODcwOTA3fQ.7xfZwtAhLIbcJmJCv7ZOV88fKEUOM0i_75Pz3ALGsiI`
        }
    });
    if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
    }
    const responseJson = await res.json();
    return responseJson.studies || responseJson;
}

export function useStudies() {
    return useQuery<StudyResponse[], Error>({
        queryKey: ['studies'],
        queryFn: fetchStudiesAPI,
        staleTime: 5 * 60 * 1000,
    });
}
