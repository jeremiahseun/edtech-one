'use client';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="relative w-full max-w-6xl bg-white dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-border-dark max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors z-50">
          <span className="material-symbols-outlined">close</span>
        </button>
        {/* Left Side: Value Proposition & Comparison */}
        <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 dark:border-border-dark bg-gray-50/50 dark:bg-[#0c121d]">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-white text-xl">school</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">APEX <span className="text-primary">PRO</span></span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
              Level Up Your Learning with APEX Pro
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Transform your notes into mastery without limits.
            </p>
          </div>
          {/* Features Comparison Table */}
          <div className="@container">
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-background-dark">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#1c1f27]">
                    <th className="px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Feature</th>
                    <th className="px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Free</th>
                    <th className="px-4 py-4 text-xs font-semibold text-primary uppercase tracking-wider">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-border-dark">
                  <tr>
                    <td className="px-4 py-5 text-sm font-medium text-gray-700 dark:text-gray-200">AI Model</td>
                    <td className="px-4 py-5 text-sm text-gray-500 dark:text-gray-400">Standard</td>
                    <td className="px-4 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        DeepSeek Reasoning
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-5 text-sm font-medium text-gray-700 dark:text-gray-200">Knowledge Base</td>
                    <td className="px-4 py-5 text-sm text-gray-500 dark:text-gray-400">Limited Context</td>
                    <td className="px-4 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        Unlimited RAG
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-5 text-sm font-medium text-gray-700 dark:text-gray-200">Engagement</td>
                    <td className="px-4 py-5 text-sm text-gray-500 dark:text-gray-400">0 Freezes</td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-1.5 text-primary text-sm font-semibold">
                        <span className="material-symbols-outlined text-[18px]">ac_unit</span>
                        3 Streak Freezes
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-5 text-sm font-medium text-gray-700 dark:text-gray-200">Daily Limits</td>
                    <td className="px-4 py-5 text-sm text-gray-500 dark:text-gray-400">10 Queries</td>
                    <td className="px-4 py-5 text-sm text-gray-900 dark:text-white font-bold">Unlimited</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex -space-x-2">
              <img alt="User 1" className="h-8 w-8 rounded-full border-2 border-surface-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfiDHhBoGg6BlkzCJ4RZXU7693L2jFmD6YmRk5Jltc2IthBx5GL6RNOeAPEf4XU6CkOtEm1eXeV20ZtfMyz8jphjJ8WCR4Dr3puQsyS1XnGNgV8psH0EKm7dXsP8bls7SBoBUCqS2V7A-MdahA3A2ZbqfaO2wCVns9BAzfz2f-1dms0BlNcfRT0hB23vTj0ZOgrCJfICdaoYViVyfRDib6zA01mItw3E7yulrbeufHPbXVrG4F3hSA8KFEeKF5im_CWUyIS9ZtmW8" />
              <img alt="User 2" className="h-8 w-8 rounded-full border-2 border-surface-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvFFtWVvwN2fCrZta-5ZughlTeXHQWXG-sYUTd3wxMkNO4GRlwRiPoDNFpz6NRhWCYiHEKMz9tY0TJDGeH6DfsCxtrs8c4lD656_6yNJi37dneyXQ7Qd7h2T4AHqLxm0lrmov5yQ_Iw-tKT_oRYOpZ5m82gG865_PFpDW6sCTY_LrtCzps89SQpxSLSOkiL_FKKR_1_8d1Gk0XXboZSFxHbZfEEwpE7l037KDePYClzlOQ5z2Xkpl_0ouCJHIuWaH7RMWJCRcRwiI" />
              <img alt="User 3" className="h-8 w-8 rounded-full border-2 border-surface-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkfYaNA9SwB5fNN_f8sJId9QSmcdJR4uHwO3Oozkqo8FXRseMD2ef5je5MV3L36lGcUgeSYqGKPgb1XoyVNJVUpHxjylh6XYRtTHj3H7YX2u0BDt3vuU93Ur4SZYOk4U1gOSDHg4nLLzIwOtX157_I7QdjJCP3W1Sod_-134UFeXv-NnEvTBcEOwqWUx8CCdGs0yDoV6BzFzDZEZhHxbgaCNPUjrcM6sM7gcEuEDz9w9EP4Zb4xuJesEBvXkoZhwfW4Ib94R_nsGY" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Join <span className="font-bold text-gray-900 dark:text-white">5,000+ students</span> mastering their courses.
            </p>
          </div>
        </div>
        {/* Right Side: Pricing & Stripe Form */}
        <div className="w-full md:w-[420px] p-8 md:p-12 flex flex-col bg-white dark:bg-surface-dark">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Subscription Details</h3>
            {/* Pricing Card */}
            <div className="mb-8 p-6 rounded-xl border-2 border-primary bg-primary/5 pro-glow">
              <div className="flex justify-between items-start mb-1">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Pro Plan</span>
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Best Value</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">$12</span>
                <span className="text-gray-500 dark:text-gray-400 font-medium">/mo</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">Billed monthly. Cancel anytime with one click.</p>
            </div>
            {/* Payment Form */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Card Information</label>
                <div className="relative">
                  <input className="w-full bg-gray-50 dark:bg-[#1c1f27] border border-gray-200 dark:border-border-dark rounded-lg px-4 py-3.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="1234 5678 1234 5678" type="text" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <span className="material-symbols-outlined">credit_card</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expiry</label>
                  <input className="w-full bg-gray-50 dark:bg-[#1c1f27] border border-gray-200 dark:border-border-dark rounded-lg px-4 py-3.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="MM / YY" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CVC</label>
                  <div className="relative">
                    <input className="w-full bg-gray-50 dark:bg-[#1c1f27] border border-gray-200 dark:border-border-dark rounded-lg px-4 py-3.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="123" type="text" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <span className="material-symbols-outlined text-[20px]">help</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* CTA */}
            <button className="w-full mt-8 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group">
              <span>Upgrade to Pro</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                Secure payment via Stripe
              </div>
              <div className="flex gap-4 opacity-50 grayscale dark:invert">
                <img alt="Visa" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFTCXsR6lquZh2iYTTNowvmsGjpw1OMRu4Ahzebl-tWuFnZgwR_OSi378JV5pGY7K_KPM7A55w9GbIvDbcrbZBTmZigQWWmSDmW4mq22CDUKpKYFbvE0yNmkju8o3naFw4cT508_ZaWgeeWsZSYYZZ0mlAnUUaLR_uzA3iA3Un3BsEbb5UPc4IQ3ciYsgahlneG55UHtGLztBiRo9Y_ZBG9VzJItVeoDRMffTwwhHIGm1Lo72nW_EnCi-SekY1N0HWg65LIfWTXIk" />
                <img alt="Mastercard" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbyWx36DpBNliDhSnQacEIRw0RVfVA0k6ts3bf7pGPmBLCAwc0ji3u_btCAmoeBHvCiYb5TLYwQs8D0V56SYetWuJZZbe35KromIWxtni0swYzmIoBy239qSnsus70EkSdWB52IXsWUmrc1H5ypSoGGjSiplC_PorjebDFL1nvOqM6B8Wlx9_wuLLDQlWdzLgCttn2-pVdwNSsUcRkYaf6WHtjPjJOJD3O7BZJVfZtSnGlnIcvVulqqGLzCwvHyslOo7K9s60BasE" />
                <img alt="PayPal" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxG1-F8Tg8-ghXXzJ2E2BCJ24U0Mt9-PeFZz-NqdRCtIyOfI70B6U_1hvqHraZlZt5M15zPuk1xTtIXzhlbUSOqYkhB9vheWOzpWpDfG0cfJpi7LDxdJQ6loCpuZCyuEFBEndKNQYt-dyNgsGb5Mr9NPyewfOkqYUY4eSdB0td1PZR5dNV47cE0V3cIhDzZQgoY_4qBlHr9X78WBCrKgNW4IzR7SzqD4HjX4knmF6bQmH0bjDoThWrec1kJZmB43kuuZjxl3qhxFM" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
