import { useState } from 'react';

type UseCourseDetailsModalParams = {
  selectedCourseId?: number | null;
  onCourseSelect?: (courseId: number) => void;
  onModalClose?: (open: boolean) => void;
};

export function useCourseDetailsModal({
  selectedCourseId: controlledSelectedCourseId,
  onCourseSelect,
  onModalClose,
}: UseCourseDetailsModalParams) {
  const [internalSelectedCourseId, setInternalSelectedCourseId] = useState<
    number | null
  >(null);

  const selectedCourseId =
    controlledSelectedCourseId !== undefined
      ? controlledSelectedCourseId
      : internalSelectedCourseId;
  const modalOpen = selectedCourseId !== null;

  const handleCourseSelect = (courseId: number) => {
    if (onCourseSelect) {
      onCourseSelect(courseId);
      return;
    }

    setInternalSelectedCourseId(courseId);
  };

  const handleModalClose = (open: boolean) => {
    if (onModalClose) {
      onModalClose(open);
      return;
    }

    if (!open) {
      setInternalSelectedCourseId(null);
    }
  };

  return {
    selectedCourseId,
    modalOpen,
    handleCourseSelect,
    handleModalClose,
  };
}
