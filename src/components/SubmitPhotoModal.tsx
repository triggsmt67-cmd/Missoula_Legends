'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export function SubmitPhotoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0d1a14]/85 backdrop-blur-sm animate-fade-in text-left">
      {/* Modal Backdrop Click Area */}
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      
      <div className="relative bg-[#17231D] border border-warm-limestone/20 rounded-[2rem] shadow-2xl w-full max-w-[600px] max-h-[85vh] flex flex-col z-10 animate-fade-in-up overflow-hidden">
        
        {/* Scrollable Content Area */}
        <div className="p-6 sm:p-10 overflow-y-auto overflow-x-hidden">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-20"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-aged-brass/20 border border-aged-brass/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-aged-brass" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-serif text-2xl font-semibold leading-snug mb-1">
                Submit a Photo
              </h2>
              <p className="text-white/60 text-xs font-mono uppercase tracking-wider">
                Hand-Picked
              </p>
            </div>
          </div>

          <ol className="flex flex-col gap-6 mb-8">
            {[
              {
                step: '01',
                title: 'Take a Great Shot',
                desc: 'Photos should be of Missoula — any neighborhood, business, event, or moment that captures the spirit of the Garden City.',
              },
              {
                step: '02',
                title: 'Email It to Us',
                desc: 'Send your best photo(s) to photos@missoulalegends.com with your name, where it was taken, and a brief caption.',
              },
              {
                step: '03',
                title: 'We Review & Feature',
                desc: 'Trevor personally reviews every submission. Selected photos are published with full credit to the photographer.',
              },
            ].map(item => (
              <li key={item.step} className="flex gap-4 items-start">
                <span className="font-mono text-aged-brass text-xs sm:text-sm font-bold tracking-widest w-6 flex-shrink-0 pt-0.5">
                  {item.step}
                </span>
                <div>
                  <span className="text-white text-base font-semibold font-serif block leading-snug mb-1">
                    {item.title}
                  </span>
                  <span className="text-white/60 text-sm leading-relaxed font-normal block">
                    {item.desc}
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <div className="border-t border-white/10 pt-6">
            <p className="text-white/40 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-white/50">Guidelines:</span> Original photos only. By submitting, you grant Missoula Legends the right to publish your photo with credit. High-resolution JPG preferred (3MB+).
            </p>
          </div>
        </div>

        {/* Sticky Bottom Footer */}
        <div className="p-6 sm:px-10 sm:pb-10 sm:pt-4 border-t border-white/5 bg-[#17231D]/95 backdrop-blur-md">
          <a
            href="mailto:photos@missoulalegends.com?subject=Gallery%20Photo%20Submission&body=Hi%20Trevor%2C%0A%0AI'd%20like%20to%20submit%20a%20photo%20for%20the%20Missoula%20Legends%20Gallery.%0A%0ACaption%3A%0ALocation%2FNeighborhood%3A%0ADate%20Taken%3A%0A%0A(Please%20attach%20your%20photo%20to%20this%20email)"
            onClick={() => setIsOpen(false)}
            className="group flex items-center justify-center gap-3 w-full bg-aged-brass hover:bg-[#C8A46A] text-[#17231D] px-8 py-4.5 rounded-xl font-mono text-xs sm:text-sm uppercase tracking-widest font-bold transition-all shadow-lg hover:shadow-aged-brass/30 active:scale-[0.98]"
          >
            Send a Photo
            <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-3 bg-aged-brass hover:bg-[#C8A46A] text-[#17231D] px-8 py-4 rounded-xl font-mono text-sm sm:text-base uppercase tracking-widest font-bold transition-all shadow-[0_0_30px_rgba(200,164,106,0.3)] hover:shadow-[0_0_40px_rgba(200,164,106,0.5)] active:scale-[0.98]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
        </svg>
        Submit a Photo
      </button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  )
}
