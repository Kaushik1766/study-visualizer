import { useQuery } from '@tanstack/react-query';
import { StudyResponse } from '@/types/StudyResponse';

async function fetchStudiesAPI(): Promise<StudyResponse[]> {
    const res = await fetch('https://studiesapi.tikuntech.com/mf2/user/studies', {
        headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzEzMDA2MSwianRpIjoiOTg2MWFkMjgtNDNlMC00Y2QxLWFkNWQtNzhjNjgwOTQ0YzUzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwibmJmIjoxNzQ3MTMwMDYxLCJjc3JmIjoiMmZmNzllYjItNTdkNi00ZGE3LTk2ZTYtMWViMDE4ZTJkODZjIiwiZXhwIjoxNzQ5NzIyMDYxfQ.dS5Yw1MYpGtLKoCUjXsK5h5Rt8qsddX7WwINdkjkHm4`
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
