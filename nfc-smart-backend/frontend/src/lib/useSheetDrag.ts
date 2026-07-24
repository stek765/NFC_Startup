import { useDragControls, type PanInfo } from 'motion/react';

// Wires up real swipe-down-to-dismiss for a bottom sheet's drag handle. Only
// the handle starts the drag (via dragControls + dragListener: false on the
// panel), so a finger scrolling the sheet's own content never fights it —
// the gesture only exists where the little grey bar visually promises it.
export function useSheetDrag(onClose: () => void) {
  const controls = useDragControls();

  function startDrag(event: React.PointerEvent) {
    controls.start(event);
  }

  function onDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.y > 100 || info.velocity.y > 600) onClose();
  }

  return {
    startDrag,
    panelProps: {
      drag: 'y' as const,
      dragListener: false,
      dragControls: controls,
      dragConstraints: { top: 0, bottom: 0 },
      dragElastic: { top: 0, bottom: 1 },
      onDragEnd,
    },
  };
}
