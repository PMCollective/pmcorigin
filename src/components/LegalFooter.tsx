import React, { useState } from 'react';
import Modal from './Modal';
import TermsOfService from './Tos';
import PrivacyPolicy from './Privacy';
import RefundPolicy from './Refund';

const LegalFooter = () => {
  const [activeModal, setActiveModal] = useState(null);

  const renderContent = () => {
    switch (activeModal) {
      case 'terms':
        return <TermsOfService />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'refund':
        return <RefundPolicy />;
      default:
        return null;
    }
  };

  return (
    <>
      <footer className="bg-slate-900 text-white py-6 text-center">
  <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm">
    <button onClick={() => setActiveModal('terms')} className="text-blue-400 hover:underline">
      Terms of Service
    </button>
    <button onClick={() => setActiveModal('privacy')} className="text-blue-400 hover:underline">
      Privacy Policy
    </button>
    <button onClick={() => setActiveModal('refund')} className="text-blue-400 hover:underline">
      Refund Policy
    </button>
  </div>
  <p className="mt-4 text-slate-400 text-sm">
    &copy; {new Date().getFullYear()} PM Collective. All rights reserved.
  </p>
</footer>


      {activeModal && (
        <Modal
          title={
            activeModal === 'terms'
              ? 'Terms of Service'
              : activeModal === 'privacy'
              ? 'Privacy Policy'
              : 'Refund Policy'
          }
          onClose={() => setActiveModal(null)}
        >
          {renderContent()}
        </Modal>
      )}
    </>
  );
};

export default LegalFooter;
