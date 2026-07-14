import { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/+$/, "");

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url || loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });

      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);

      const qr = await QRCodeGenerator.toDataURL(newShortUrl);
      setQrImage(qr);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
      console.error(err);
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message || "An error occurred on the server.");
      } else {
        alert("Something went wrong. Please try again.");
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDF7] text-[#14161B] font-sans">
      <style>{`
        @keyframes marquee {
          from { background-position: 0 0; }
          to { background-position: 80px 0; }
        }
        .stripe-bar {
          background-image: repeating-linear-gradient(
            -45deg,
            #2A4DFF 0px, #2A4DFF 18px,
            #FFCC00 18px, #FFCC00 36px,
            #FF5A1F 36px, #FF5A1F 54px,
            #14161B 54px, #14161B 58px
          );
          background-size: 80px 100%;
          animation: marquee 3.5s linear infinite;
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(10px) rotate(-1.5deg); }
          to { opacity: 1; transform: translateY(0) rotate(-1.5deg); }
        }
        .ticket-in { animation: popIn 0.35s ease-out both; }
        .hard-btn {
          box-shadow: 4px 4px 0 #14161B;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .hard-btn:hover:not(:disabled) {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 #14161B;
        }
        .hard-btn:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 #14161B;
        }
      `}</style>

      {/* animated stripe bar — signature motion element */}
      <div className="stripe-bar h-2.5 w-full shrink-0 sm:h-3" />

      <div className="flex flex-1 items-center justify-center px-5 py-6 sm:px-10">
        <div className="w-full max-w-5xl">
          {/* stamp badge */}
          <div className="mb-5 flex justify-center sm:justify-start">
            <div className="-rotate-3 rounded-full border-2 border-[#14161B] bg-[#FFCC00] px-4 py-1 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0_#14161B]">
              Fast &middot; Free &middot; No Signup
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            {/* left: form */}
            <div>
              <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl">
                Paste.{" "}
                <span className="relative inline-block -rotate-1 bg-[#2A4DFF] px-2 text-white">
                  Shrink.
                </span>{" "}
                Ship it.
              </h1>
              <p className="mt-3 max-w-md text-[15px] text-[#5B5F6B]">
                Drop in a long URL and get a short, trackable link with a
                scannable QR code — built for links that need to move fast.
              </p>

              <div className="mt-7">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[#5B5F6B]">
                  Destination URL
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    className="input w-full flex-1 rounded-none border-2 border-[#14161B] bg-white px-4 py-3 text-[15px] text-[#14161B] placeholder:text-[#A3A7B3] focus:outline-none focus:ring-0 focus:border-[#2A4DFF]"
                    placeholder="https://your-really-long-url.com/goes-here"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                  />
                  <button
                    onClick={handleShorten}
                    className="hard-btn w-full shrink-0 rounded-none border-2 border-[#14161B] bg-[#FF5A1F] px-7 py-3 font-bold uppercase tracking-wide text-white disabled:opacity-60 sm:w-auto"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Shipping
                      </span>
                    ) : (
                      "Shorten it"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* right: ticket */}
            <div className="lg:pt-1">
              {shortUrl ? (
                <div className="ticket-in rotate-[-1.5deg] rounded-md border-2 border-[#14161B] bg-[#FFF7DB] shadow-[6px_6px_0_#14161B]">
                  <div className="flex items-center justify-between px-5 pt-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#5B5F6B]">
                      Claim Ticket
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1FAA59]">
                      ● Ready
                    </span>
                  </div>

                  <div className="px-5 py-4">
                    <p className="truncate font-mono text-[11px] text-[#A3A7B3] line-through">
                      {url}
                    </p>
                    <a
                      className="mt-1 block truncate font-mono text-xl font-bold text-[#2A4DFF] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={shortUrl}
                    >
                      {shortUrl}
                    </a>
                  </div>

                  {/* perforation */}
                  <div className="relative border-t-2 border-dashed border-[#14161B]">
                    <span className="absolute -left-[13px] -top-[13px] h-6 w-6 rounded-full bg-[#FFFDF7] border-2 border-[#14161B]" />
                    <span className="absolute -right-[13px] -top-[13px] h-6 w-6 rounded-full bg-[#FFFDF7] border-2 border-[#14161B]" />
                  </div>

                  <div className="flex flex-col items-center gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col items-center gap-2">
                      <div className="rounded border-2 border-[#14161B] bg-white p-2">
                        <QRCode value={shortUrl} size={92} />
                      </div>
                      {qrImage && (
                        <a
                          className="hard-btn rounded-none border-2 border-[#14161B] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#14161B]"
                          download="qr-code.png"
                          href={qrImage}
                        >
                          Save QR
                        </a>
                      )}
                    </div>

                    <button
                      onClick={handleCopy}
                      className={`hard-btn w-full rounded-none border-2 border-[#14161B] px-5 py-3 font-bold uppercase tracking-wide sm:w-auto ${
                        copied ? "bg-[#1FAA59] text-white" : "bg-[#2A4DFF] text-white"
                      }`}
                    >
                      {copied ? "Copied ✓" : "Copy link"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rotate-[-1.5deg] rounded-md border-2 border-dashed border-[#C9CCD6] bg-white/60 px-6 py-14 text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#A3A7B3]">
                    Your ticket shows up here
                  </p>
                  <p className="mt-1 text-xs text-[#C9CCD6]">
                    Shorten a link to generate it
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;