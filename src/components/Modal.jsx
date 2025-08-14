import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0  z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-900 text-white w-full max-w-xl mx-4 rounded-lg shadow-lg relative p-6">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
        <div className="text-white max-h-[60vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
