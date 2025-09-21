"use client"

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  const BACKEND_BASE = ["http://127.0.0.1:8000"]
  // const BACKEND_BASE = ["https://video-downloader-backend-5sm7.onrender.com"]

  // URL validation function
  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return false;

    try {
      const urlObj = new URL(url);
      // Check if it's a valid HTTP/HTTPS URL and contains video platform indicators
      const validProtocol = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      const hasVideoIndicators = url.includes('youtube.com') ||
        url.includes('youtu.be') ||
        url.includes('vimeo.com') ||
        url.includes('tiktok.com') ||
        url.includes('instagram.com') ||
        url.includes('twitter.com') ||
        url.includes('x.com') ||
        url.includes('facebook.com') ||
        url.includes('dailymotion.com') ||
        url.includes('twitch.tv');

      return validProtocol && hasVideoIndicators;
    } catch {
      return false;
    }
  };

  const isButtonEnabled = isValidUrl(link) && !loading;

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const resetForm = () => {
    setLink("");
    setDownloadUrl(null);
    setTitle("");
    setAlert(null);
  };

  const handleDownload = async () => {
    if (!isValidUrl(link)) {
      showAlert('error', 'Please enter a valid video URL');
      return;
    }

    setLoading(true);
    setDownloadUrl(null);
    setTitle("");
    setAlert(null);

    try {
      const form = new FormData();
      form.append("url", link);

      const resp = await axios.post(`${BACKEND_BASE}/download`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (resp.data.status === "success") {
        setDownloadUrl(`${BACKEND_BASE}/file/${resp.data.filename}`);
        setTitle(resp.data.title || "Video");
        showAlert('success', 'Video downloaded successfully!');
      } else {
        showAlert('error', `Error: ${resp.data.detail}`);
      }
    } catch (err: any) {
      console.error(err);
      showAlert('error', `Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Alert Component */}
      {alert && (
        <div className={`fixed top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-50 p-3 sm:p-4 rounded-2xl shadow-2xl transform transition-all duration-300 backdrop-blur-sm ${alert.type === 'success' ? 'bg-emerald-500/90 text-white border border-emerald-400' :
          alert.type === 'error' ? 'bg-red-500/90 text-white border border-red-400' :
            'bg-blue-500/90 text-white border border-blue-400'
          }`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center min-w-0 flex-1">
              {alert.type === 'success' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {alert.type === 'error' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium text-sm sm:text-base truncate">{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert(null)}
              className="ml-2 text-white/80 hover:text-white transition-colors flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto min-h-screen flex flex-col px-2 sm:px-4 md:px-6">
        {/* Header */}
        <div className="relative px-6 sm:px-10 py-10 sm:py-14 text-center mt-14">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700/30 via-pink-500/10 to-blue-700/30 rounded-3xl shadow-2xl"></div>
          <div className="absolute inset-0 opacity-40">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}
            ></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center py-8 sm:py-10 mt-2 sm:mt-6">
            {/* App Icon */}
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 shadow-2xl shadow-purple-500/30 mb-5">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h1 className="font-extrabold text-2xl sm:text-3xl mb-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent tracking-tight drop-shadow">
              Video Downloader
            </h1>
            <p className="font-semibold text-base sm:text-lg text-pink-100 mb-4 tracking-wide drop-shadow">
              Download videos from any platform
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-6 sm:gap-10 mt-4">
              <div className="text-center">
                <div className="font-extrabold text-lg sm:text-2xl text-white drop-shadow">
                  1000+
                </div>
                <div className="text-sm sm:text-base text-purple-200 font-medium mt-1 tracking-wide">Downloads</div>
              </div>
              <div className="text-center">
                <div className="font-extrabold text-lg sm:text-2xl text-white drop-shadow">
                  50+
                </div>
                <div className="text-sm sm:text-base text-purple-200 font-medium mt-1 tracking-wide">Platforms</div>
              </div>
              <div className="text-center">
                <div className="font-extrabold text-lg sm:text-2xl text-white drop-shadow">
                  HD
                </div>
                <div className="text-sm sm:text-base text-purple-200 font-medium mt-1 tracking-wide">Quality</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-3 sm:p-4 md:p-6 border border-white/20">
            {/* Input Section */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Paste Video Link</h2>
              </div>

              <div className="relative">
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className={`w-full pl-12 pr-12 sm:pl-14 sm:pr-14 py-4 sm:py-5 border-2 rounded-2xl text-sm sm:text-base font-medium focus:outline-none focus:ring-4 transition-all duration-300 ${link.trim() && !isValidUrl(link)
                    ? 'border-red-400 focus:ring-red-100 bg-red-50/50 text-red-700'
                    : link.trim() && isValidUrl(link)
                      ? 'border-emerald-400 focus:ring-emerald-100 bg-emerald-50/50 text-emerald-700'
                      : 'border-gray-200 focus:ring-purple-100 bg-gray-50/50 text-gray-700'
                    }`}
                  disabled={loading}
                />

                {/* URL Icon */}
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>

                {link.trim() && (
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                    <button
                      onClick={() => setLink("")}
                      className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                      disabled={loading}
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {link.trim() && !isValidUrl(link) && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-xs sm:text-sm text-red-700 flex items-center">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Please enter a valid video URL (YouTube, Vimeo, TikTok, etc.)
                  </p>
                </div>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!isButtonEnabled}
              className={`w-full py-4 sm:py-5 px-4 sm:px-6 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform ${!isButtonEnabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white hover:from-purple-700 hover:via-pink-700 hover:to-red-600 active:scale-95 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-2 sm:mr-3"></div>
                  <span className="text-base sm:text-lg">Processing Video...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-base sm:text-lg">Download Video</span>
                </div>
              )}
            </button>

            {/* Download Result */}
            {downloadUrl && (
              <div className="mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-3xl shadow-lg">
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-emerald-800 mb-1 sm:mb-2">Download Complete! 🎉</h3>
                    <p className="text-xs sm:text-sm md:text-base text-emerald-700 font-medium mb-3 sm:mb-4 flex items-start">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="break-words leading-relaxed">{title}</span>
                    </p>
                    <div className="flex flex-col min-[480px]:flex-row gap-2 sm:gap-3">
                      <a
                        href={downloadUrl}
                        download
                        className="flex-1 inline-flex items-center justify-center px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm md:text-base"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                        </svg>
                        <span className="whitespace-nowrap">Download Now</span>
                      </a>
                      <button
                        onClick={resetForm}
                        className="flex-1 inline-flex items-center justify-center px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white text-emerald-700 font-bold rounded-2xl border-2 border-emerald-300 hover:bg-emerald-50 transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm md:text-base"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="whitespace-nowrap">New Video</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 sm:p-3 md:p-4 text-center shadow-lg border border-white/20">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-1.5 sm:mb-2 md:mb-3 flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-bold">Lightning Fast</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 sm:p-3 md:p-4 text-center shadow-lg border border-white/20">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl mx-auto mb-1.5 sm:mb-2 md:mb-3 flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-bold">HD Quality</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 sm:p-3 md:p-4 text-center shadow-lg border border-white/20">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-1.5 sm:mb-2 md:mb-3 flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-bold">Secure</p>
            </div>
          </div>

          {/* Supported Platforms */}
          <div className="mt-3 sm:mt-4 md:mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 md:p-4 shadow-lg border border-white/20">
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 mb-2 sm:mb-3 text-center">Supported Platforms</h3>
            <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-4 flex-wrap">
              <div className="flex items-center space-x-1 bg-red-50 px-2 sm:px-2.5 md:px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium text-red-700">YouTube</span>
              </div>
              <div className="flex items-center space-x-1 bg-blue-50 px-2 sm:px-2.5 md:px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium text-blue-700">Vimeo</span>
              </div>
              <div className="flex items-center space-x-1 bg-purple-50 px-2 sm:px-2.5 md:px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium text-purple-700">TikTok</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 md:p-4 border border-white/20">
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-medium">Made with Jihadul Islam @jihad-dev ❤️ </p>
            <p className="text-xs sm:text-sm text-white/60 mt-1">© 2024 Video Downloader Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
}





