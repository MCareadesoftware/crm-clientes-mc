import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { MdClose } from "react-icons/md";

const ModalInDrawer = ({
  activeModal,
  onClose,
  noFade,
  disableBackdrop,
  className = "max-w-xl",
  children,
  footerContent,
  centered,
  scrollContent,
  themeClass = "bg-slate-100 ",
  title = "Basic Modal",
  uncontrol,
  label = "Basic Modal",
  labelClass,
  ref,
}) => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(!showModal);
  };
  const returnNull = () => {
    return null;
  };

  return (
    <>
      {uncontrol ? (
        <>
          <button
            type="button"
            onClick={openModal}
            className={`btn ${labelClass}`}
          >
            {label}
          </button>
          <Transition appear show={showModal} as={Fragment}>
            <Dialog
              as="div"
              style={{zIndex:9998}}
              className="relative "
              onClose={!disableBackdrop ? closeModal : returnNull}
            >
              {!disableBackdrop && (
                <Transition.Child
                  as={Fragment}
                  enter={noFade ? "" : "duration-300 ease-out"}
                  enterFrom={noFade ? "" : "opacity-0"}
                  enterTo={noFade ? "" : "opacity-100"}
                  leave={noFade ? "" : "duration-200 ease-in"}
                  leaveFrom={noFade ? "" : "opacity-100"}
                  leaveTo={noFade ? "" : "opacity-0"}
                >
                  <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                </Transition.Child>
              )}

              <div className="fixed inset-0 overflow-y-auto">
                <div
                  className={`flex min-h-full justify-center text-center p-6 ${
                    centered ? "items-center" : "items-start "
                  }`}
                >
                  <Transition.Child
                    as={Fragment}
                    enter={noFade ? "" : "duration-300  ease-out"}
                    enterFrom={noFade ? "" : "opacity-0 scale-95"}
                    enterTo={noFade ? "" : "opacity-100 scale-100"}
                    leave={noFade ? "" : "duration-200 ease-in"}
                    leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                    leaveTo={noFade ? "" : "opacity-0 scale-95"}
                  >
                    <Dialog.Panel
                      className={`w-full transform overflow-hidden rounded-md
                 bg-white  text-left align-middle shadow-xl transition-alll ${className}`}
                    >
                      <div
                        className={`relative overflow-hidden py-4 px-5 text-white flex justify-between  ${themeClass}`}
                      >
                        <h2 className="capitalize leading-6 tracking-wider font-medium text-base text-white">
                          {title}
                        </h2>
                        <button onClick={closeModal} className="text-[22px] ">
                          <MdClose  className="text-gray-700"/>
                        </button>
                      </div>
                      <div
                        className={`px-6 py-8 ${
                          scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                        }`}
                      >
                        {children}
                      </div>
                      {footerContent && (
                        <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 ">
                          {footerContent}
                        </div>
                      )}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
      ) : (
        <Transition appear show={activeModal} as={Fragment}>
          <Dialog as="div" style={{zIndex:9998}} className="relative " onClose={onClose}>
            <Transition.Child
              as={Fragment}
              enter={noFade ? "" : "duration-300 ease-out"}
              enterFrom={noFade ? "" : "opacity-0"}
              enterTo={noFade ? "" : "opacity-100"}
              leave={noFade ? "" : "duration-200 ease-in"}
              leaveFrom={noFade ? "" : "opacity-100"}
              leaveTo={noFade ? "" : "opacity-0"}
            >
              {!disableBackdrop && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
              )}
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div
                className={`flex min-h-full justify-center text-center p-6 ${
                  centered ? "items-center" : "items-start "
                }`}
              >
                <Transition.Child
                  as={Fragment}
                  enter={noFade ? "" : "duration-300  ease-out"}
                  enterFrom={noFade ? "" : "opacity-0 scale-95"}
                  enterTo={noFade ? "" : "opacity-100 scale-100"}
                  leave={noFade ? "" : "duration-200 ease-in"}
                  leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                  leaveTo={noFade ? "" : "opacity-0 scale-95"}
                >
                  <Dialog.Panel
                    className={`w-full transform overflow-hidden rounded-md
                 bg-white  text-left align-middle shadow-xl transition-alll ${className}`}
                  >
                    <div
                      className={`relative overflow-hidden py-4 px-5 text-white flex justify-between  ${themeClass}`}
                    >
                      <h2 className="capitalize leading-6 tracking-wider font-medium text-base text-gray-800 ">
                        {title}
                      </h2>
                      <button onClick={onClose} className="text-[22px] hover:bg-gray-200 p-1 rounded-lg">
                        <MdClose className=" text-gray-700"/>
                      </button>
                    </div>
                    <div
                      className={`px-6 py-8 ${
                        scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                      }`}
                    >
                      {children}
                    </div>
                    {footerContent && (
                      <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 ">
                        {footerContent}
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};

export default ModalInDrawer;
