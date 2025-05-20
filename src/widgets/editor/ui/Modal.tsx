/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import { isDOMNode } from "lexical";
import * as React from "react";
import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
      if (event.key === "Escape") {
        onClose();
      }
    };
    const clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target;
      if (
        modalRef.current !== null &&
        isDOMNode(target) &&
        !modalRef.current.contains(target) &&
        closeOnClickOutside
      ) {
        onClose();
      }
    };
    const modelElement = modalRef.current;
    if (modelElement !== null) {
      modalOverlayElement = modelElement.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement.addEventListener("click", clickOutsideHandler);
      }
    }

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener("click", clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[rgba(40,40,40,0.6)]"
      role="dialog"
    >
      <div
        className="relative flex flex-col min-w-[300px] min-h-[100px] p-5 bg-white shadow-[0_0_20px_0_#444] rounded-[10px]"
        tabIndex={-1}
        ref={modalRef}
      >
        <h2 className="m-0 pb-[10px] border-b border-[#ccc] text-[#444]">
          {title}
        </h2>
        <button
          className="absolute right-[20px] w-[30px] h-[30px] flex items-center justify-center text-center cursor-pointer bg-[#eee] rounded-[20px] hover:bg-[#ddd] border-0"
          aria-label="Close modal"
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
    <PortalImpl
      onClose={onClose}
      title={title}
      closeOnClickOutside={closeOnClickOutside}
    >
      {children}
    </PortalImpl>,
    document.body
  );
}
