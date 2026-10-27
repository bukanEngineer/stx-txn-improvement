import type { ReactNode } from "react";
import { Modal } from "stxdesign-sandbox";

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  footer: ReactNode;
  children: ReactNode;
  className?: string;
  size?: "small" | "large";
}

/** Title / body / footer dialog on top of the design system's `Modal` parts. */
export function AppModal({ open, onClose, title, footer, children, className, size }: AppModalProps) {
  return (
    <Modal.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Modal.Popup size={size} className={className}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
          <Modal.Close />
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>{footer}</Modal.Footer>
      </Modal.Popup>
    </Modal.Root>
  );
}
