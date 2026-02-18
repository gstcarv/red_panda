import { getEnrollments } from "@/api/enrollments-api";
import { useQuery } from "@tanstack/react-query";

export function buildEnrollmentsQueryKey() {
    return ["enrollments"] as const;
}

export function useEnrollments() {
    return useQuery({
        queryKey: buildEnrollmentsQueryKey(),
        queryFn: getEnrollments,
    });
}
