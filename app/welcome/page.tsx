"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, getSession, switchDemoRole, uid } from "@/lib/portal/store";
import { GreenBtn } from "@/components/portal/ui";
import { BubbleMark } from "@/components/Wordmark";

/**
 * The setup link a new hire lands on after the GM invites them.
 * Four steps, under a minute, ends inside their staff app.
 */

const SIZE = 512; // square photos, downscaled before they hit the roster

function cropToSquare(source: CanvasImageSource, sw: number, sh: number, mirror: boolean): string {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  const side = Math.min(sw, sh);
  const sx = (sw - side) / 2;
  const sy = (sh - side) / 2;
  if (mirror) {
    ctx.translate(SIZE, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(source, sx, sy, side, side, 0, 0, SIZE, SIZE);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function PhotoStep({ photo, onPhoto }: { photo: string | null; onPhoto: (p: string | null) => void }) {
  const [mode, setMode] = useState<"choose" | "camera">(photo ? "choose" : "choose");
  const [camErr, setCamErr] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const stopCam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => stopCam, []);

  const startCam = async () => {
    setCamErr("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      setMode("camera");
      // the video node exists after the mode flips
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setCamErr("Camera is blocked on this device. Upload a photo instead.");
    }
  };

  const capture = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    onPhoto(cropToSquare(v, v.videoWidth, v.videoHeight, true));
    stopCam();
    setMode("choose");
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      onPhoto(cropToSquare(img, img.naturalWidth, img.naturalHeight, false));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  };

  if (mode === "camera") {
    return (
      <div>
        <div className="relative mx-auto aspect-square w-full max-w-[340px] overflow-hidden rounded-[28px] bg-ink">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="h-full w-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
          {/* head-alignment frame: darken everything outside the oval */}
          <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <mask id="face-hole">
                <rect width="100" height="100" fill="white" />
                <ellipse cx="50" cy="46" rx="27" ry="34" fill="black" />
              </mask>
            </defs>
            <rect width="100" height="100" fill="rgb(11 53 39 / 0.55)" mask="url(#face-hole)" />
            <ellipse cx="50" cy="46" rx="27" ry="34" fill="none" stroke="#0ecf7f" strokeWidth="1.2" strokeDasharray="3 2.4" />
          </svg>
          <p className="absolute inset-x-0 bottom-3 text-center text-[12.5px] font-extrabold text-white drop-shadow">
            Line your face up with the oval
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <button
            onClick={() => { stopCam(); setMode("choose"); }}
            className="text-[13.5px] font-bold text-ink/45"
          >
            Cancel
          </button>
          <button
            onClick={capture}
            aria-label="Take the photo"
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-green bg-white shadow-lift transition-transform active:scale-90"
          >
            <span className="h-11 w-11 rounded-full bg-green" />
          </button>
          <span className="w-[46px]" aria-hidden />
        </div>
      </div>
    );
  }

  return (
    <div>
      {photo ? (
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt="Your profile photo"
            className="mx-auto h-40 w-40 rounded-full border-4 border-green object-cover shadow-lift"
          />
          <p className="mt-3 text-[13.5px] font-bold text-ink/50">Looking good. This is what the crew sees.</p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={startCam}
              className="rounded-full border-2 border-ink/10 px-4 py-2 text-[13px] font-extrabold text-ink/60"
            >
              Retake
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-full border-2 border-ink/10 px-4 py-2 text-[13px] font-extrabold text-ink/60"
            >
              Choose another
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          <button
            onClick={startCam}
            className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-pop transition-transform hover:scale-[1.01]"
          >
            <span aria-hidden className="text-[22px]">🤳</span>
            <span className="text-[15px] font-extrabold text-ink">
              Take a selfie
              <span className="block text-[12.5px] font-semibold text-ink/45">
                Front camera, with a frame so your head lines up
              </span>
            </span>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-pop transition-transform hover:scale-[1.01]"
          >
            <span aria-hidden className="text-[22px]">🖼️</span>
            <span className="text-[15px] font-extrabold text-ink">
              Upload a photo
              <span className="block text-[12.5px] font-semibold text-ink/45">
                A clear, recent one of your face
              </span>
            </span>
          </button>
          {camErr && <p className="text-[13px] font-bold text-coral">{camErr}</p>}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}

export default function WelcomePage() {
  const { state, dispatch } = usePortal();
  const router = useRouter();

  const meId = getSession()?.personId ?? "tyler";
  const me = state.staff.find((s) => s.id === meId) ?? state.staff[0];

  const [step, setStep] = useState(0);
  const [first, setFirst] = useState(me.first === "Hey" ? "" : me.first);
  const [last, setLast] = useState(me.name.split(" ").slice(1).join(" "));
  const [photo, setPhoto] = useState<string | null>(null);
  const [avail, setAvail] = useState("Anytime");
  const [agreed, setAgreed] = useState(false);

  const finish = () => {
    dispatch({
      type: "STAFF_PATCH",
      id: me.id,
      patch: {
        status: "active",
        first: first.trim() || me.first,
        name: `${first.trim() || me.first} ${last.trim()}`.trim(),
        availNote: avail,
        ...(photo ? { photo } : {}),
      },
    });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "onboard", who: me.id, text: `${first.trim() || me.first} finished setup`, sub: `photo added · availability: ${avail.toLowerCase()}`, when: "Just now" },
    });
    switchDemoRole("staff", me.id);
    router.push("/me");
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="mx-auto flex h-16 w-full max-w-[460px] items-center gap-2.5 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green">
          <BubbleMark size={18} className="text-white" />
        </span>
        <span className="font-display text-[19px] font-extrabold text-ink">tagout</span>
        <span className="ml-auto text-[12px] font-bold text-ink/35">Step {step + 1} of 4</span>
      </header>

      {/* progress */}
      <div className="mx-auto w-full max-w-[460px] px-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-ink/8">
          <motion.div
            animate={{ width: `${((step + 1) / 4) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full rounded-full bg-green"
          />
        </div>
      </div>

      <main className="mx-auto w-full max-w-[460px] flex-1 px-5 pb-10 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {step === 0 && (
              <>
                <h1 className="font-display text-[28px] font-extrabold leading-tight text-ink">
                  You&apos;re joining {state.houseName}
                </h1>
                <p className="mt-2 text-[14.5px] font-semibold text-ink/50">
                  {state.gmFirst} added you as a {me.role.toLowerCase()}. Confirm your name so the
                  schedule reads right.
                </p>
                <div className="mt-6 space-y-2.5">
                  <input
                    value={first}
                    onChange={(e) => setFirst(e.target.value)}
                    placeholder="First name"
                    className="w-full rounded-xl border-2 border-ink/10 bg-white px-4 py-3 text-[15px] font-bold text-ink outline-none focus:border-green"
                  />
                  <input
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
                    placeholder="Last name"
                    className="w-full rounded-xl border-2 border-ink/10 bg-white px-4 py-3 text-[15px] font-bold text-ink outline-none focus:border-green"
                  />
                  <div className="rounded-xl bg-white px-4 py-3 text-[14px] font-semibold text-ink/45">
                    Phone · <span className="font-extrabold text-ink">{me.phone}</span>
                    <span className="block text-[11.5px] text-ink/35">verified when you opened this link</span>
                  </div>
                </div>
                <GreenBtn className="mt-6 w-full" disabled={!first.trim()} onClick={() => setStep(1)}>
                  Next
                </GreenBtn>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="font-display text-[28px] font-extrabold leading-tight text-ink">
                  Put a face on the schedule
                </h1>
                <p className="mt-2 text-[14.5px] font-semibold text-ink/50">
                  Your photo shows next to your shifts so the crew knows who&apos;s on.
                </p>
                <div className="mt-6">
                  <PhotoStep photo={photo} onPhoto={setPhoto} />
                </div>
                <GreenBtn className="mt-6 w-full" disabled={!photo} onClick={() => setStep(2)}>
                  Next
                </GreenBtn>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="font-display text-[28px] font-extrabold leading-tight text-ink">
                  When can you work?
                </h1>
                <p className="mt-2 text-[14.5px] font-semibold text-ink/50">
                  Tagout only offers you shifts that fit. Change this any time in your profile.
                </p>
                <div className="mt-6 space-y-2">
                  {["Anytime", "Not Sundays", "Weeknights only", "Days only"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAvail(opt)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-[15px] font-extrabold transition-colors ${
                        avail === opt ? "bg-green-dark text-white" : "bg-white text-ink shadow-pop"
                      }`}
                    >
                      {opt}
                      {avail === opt && <span aria-hidden>✓</span>}
                    </button>
                  ))}
                </div>
                <GreenBtn className="mt-6 w-full" onClick={() => setStep(3)}>
                  Next
                </GreenBtn>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="font-display text-[28px] font-extrabold leading-tight text-ink">
                  How shifts reach you
                </h1>
                <div className="mt-5 space-y-2.5">
                  {[
                    ["💬", "Texts come from one number", "Save it. Schedule, pickups, and swaps all happen there."],
                    ["👍", "Reply YES to take a shift", "First yes wins. No group threads, no pile-ons."],
                    ["🌙", "Quiet hours are respected", `No texts overnight unless ${state.gmFirst} marks it urgent.`],
                  ].map(([icon, title, sub]) => (
                    <div key={title} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-pop">
                      <span aria-hidden className="text-[20px]">{icon}</span>
                      <p className="text-[14.5px] font-extrabold leading-snug text-ink">
                        {title}
                        <span className="block text-[12.5px] font-semibold text-ink/45">{sub}</span>
                      </p>
                    </div>
                  ))}
                </div>
                <label className="mt-5 flex items-start gap-3 rounded-2xl bg-white p-4 shadow-pop">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-5 w-5 accent-[#0ecf7f]"
                  />
                  <span className="text-[13px] font-semibold leading-snug text-ink/60">
                    OK to text me about my schedule at {me.phone}. Reply STOP any time; message rates may apply.
                  </span>
                </label>
                <GreenBtn className="mt-6 w-full" disabled={!agreed} onClick={finish}>
                  Finish setup
                </GreenBtn>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
