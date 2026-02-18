import { useQuery } from "@tanstack/react-query";
import {
    getAvailableCoursesBySlot,
    type AvailableCoursesBySlotParams,
} from "@/api/courses-api";

export type SlotQueryParams = AvailableCoursesBySlotParams | null;

export function buildAvailableCoursesBySlotQueryKey(
    params: SlotQueryParams,
) {
    return ["courses", "available", params?.weekDay ?? null, params?.startTime ?? null] as const;
}

export function useAvailableCoursesBySlot(params: SlotQueryParams) {
    return useQuery({
        queryKey: buildAvailableCoursesBySlotQueryKey(params),
        queryFn: () => getAvailableCoursesBySlot(params!),
        enabled: params !== null,
    });
}
