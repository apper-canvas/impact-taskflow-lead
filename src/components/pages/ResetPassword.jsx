import { useEffect } from 'react';

const ResetPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showResetPassword('#authentication-reset-password');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div id="authentication-reset-password" className="w-full max-w-md p-8 bg-white rounded-lg shadow-md"></div>
    </div>
  );
};

export default ResetPassword;