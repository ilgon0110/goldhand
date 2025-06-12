/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isDOMNode } from 'lexical';
import type { JSX, ReactNode } from 'react';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function PortalImpl({
  onClose,
  children,
  title,
  closeOnClickOutside,
}: {
  children: ReactNode;
  closeOnClickOutside: boolean;
  onClose: () => void;
  title: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current !== null) {
      modalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    const clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target;
      if (modalRef.current !== null && isDOMNode(target) && !modalRef.current.contains(target) && closeOnClickOutside) {
        onClose();
      }
    };
    const modelElement = modalRef.current;
    if (modelElement !== null) {
      modalOverlayElement = modelElement.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement.addEventListener('click', clickOutsideHandler);
      }
    }

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener('click', clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[rgba(40,40,40,0.6)]"
      role="dialog"
    >
      <div
        className="relative flex min-h-[100px] min-w-[300px] flex-col rounded-[10px] bg-white p-5 shadow-[0_0_20px_0_#444]"
        ref={modalRef}
        tabIndex={-1}
      >
        <h2 className="m-0 border-b border-[#ccc] pb-[10px] text-[#444]">{title}</h2>
        <button
          aria-label="Close modal"
          className="absolute right-[20px] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[20px] border-0 bg-[#eee] text-center hover:bg-[#ddd]"
          type="button"
          onClick={onClose}
        >
          X
        </button>
        <div className="pt-[20px]">{children}</div>
      </div>
    </div>
  );
}

export default function Modal({
  onClose,
  children,
  title,
  closeOnClickOutside = false,
}: {
  children: ReactNode;
  closeOnClickOutside?: boolean;
  onClose: () => void;
  title: string;
}): JSX.Element {
  return createPortal(
    <PortalImpl closeOnClickOutside={closeOnClickOutside} title={title} onClose={onClose}>
      {children}
    </PortalImpl>,
    document.body,
  );
}
