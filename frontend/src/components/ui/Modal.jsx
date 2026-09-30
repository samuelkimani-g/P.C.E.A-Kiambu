import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const Modal = ({ open, onClose, title, description, children, footer }) => (
  <Transition.Root show={open} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-slate-900/40 transition-opacity" />
      </Transition.Child>

      <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-12">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <Dialog.Panel className="card w-full max-w-lg p-8">
            <Dialog.Title className="text-lg font-semibold text-slate-900">{title}</Dialog.Title>
            {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
            <div className="mt-6 space-y-4 text-sm text-slate-700">{children}</div>
            {footer ? <div className="mt-8 flex justify-end gap-3">{footer}</div> : null}
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition.Root>
);

export default Modal;
