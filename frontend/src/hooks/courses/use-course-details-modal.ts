import { useState } from 'react';

type UseCourseDetailsModalParams = {
  selectedCourseId?: number | null;
  selectedSemesterId?: number | null;
  onCourseSelect?: (courseId: number, semesterId?: number) => void;
  onModalClose?: (open: boolean) => void;
};

export function useCourseDetailsModal({
  selectedCourseId: controlledSelectedCourseId,
  selectedSemesterId: controlledSelectedSemesterId,
  onCourseSelect,
  onModalClose,
}: UseCourseDetailsModalParams) {
  const [internalSelectedCourseId, setInternalSelectedCourseId] = useState<
    number | null
  >(null);
  const [internalSelectedSemesterId, setInternalSelectedSemesterId] = useState<
    number | null
  >(null);

  const selectedCourseId =
    controlledSelectedCourseId !== undefined
      ? controlledSelectedCourseId
      : internalSelectedCourseId;
  const selectedSemesterId =
    controlledSelectedSemesterId !== undefined
      ? controlledSelectedSemesterId
      : internalSelectedSemesterId;
  const modalOpen = selectedCourseId !== null;

  const handleCourseSelect = (courseId: number, semesterId?: number) => {
    if (onCourseSelect) {
      onCourseSelect(courseId, semesterId);
      return;
    }

    setInternalSelectedCourseId(courseId);
    setInternalSelectedSemesterId(semesterId ?? null);
  };

  const handleModalClose = (open: boolean) => {
    if (onModalClose) {
      onModalClose(open);
      return;
    }

    if (!open) {
      setInternalSelectedCourseId(null);
      setInternalSelectedSemesterId(null);
    }
  };

  return {
    selectedCourseId,
    selectedSemesterId,
    modalOpen,
    handleCourseSelect,
    handleModalClose,
  };
}
