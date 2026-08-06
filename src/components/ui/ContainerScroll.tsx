import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ShieldCheck, CheckCircle2, Lock, ArrowUpRight, Cpu, Clock, Terminal, User } from 'lucide-react';

interface ContainerScrollProps {
  titleComponent: React.ReactNode;
}

export const ContainerScroll: React.FC<ContainerScrollProps> = ({ titleComponent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.95, 1] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.4], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.4], [0, -40]);

  return (
    <section
      ref={containerRef}
      className="py-12 px-4 lg:px-12 max-w-[1500px] mx-auto w-full relative flex flex-col items-center justify-center"
    >
      <div className="w-full relative" style={{ perspective: '1000px' }}>
        <Header translate={translate} titleComponent={titleComponent} />
        
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.15)',
          }}
          className="max-w-5xl mx-auto h-[450px] sm:h-[550px] w-full rounded-3xl bg-slate-950 border border-slate-800 p-3 sm:p-5 shadow-2xl relative overflow-hidden"
        >
          {/* Inner Mockup Frame */}
          <div className="h-full w-full rounded-2xl bg-slate-900 border border-slate-800/80 p-4 sm:p-6 flex flex-col justify-between font-sans text-slate-100 overflow-y-auto custom-scrollbar">
            
            {/* Top Workspace Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono font-bold text-slate-400 ml-2">kaevy.studio / client / order #KVS-20260731-001</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                  ESCROW LOCKED ($1,200.00)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                  IN PROGRESS (50%)
                </span>
              </div>
            </div>

            {/* Order Brief Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Active Commission Brief</span>
                  <span className="text-xs text-slate-400 font-mono">Deadline: Aug 12, 2026</span>
                </div>
                <h3 className="text-lg font-bold text-white">Custom Roblox Combat & Combo Replication System</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Luau module script featuring server-authoritative hitboxes, client prediction, raycast hit detection, custom animations, and RBXL place file delivery.
                </p>

                {/* Progress Checkpoints */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Milestone Checkpoints:</span>
                    <span className="text-cyan-400 font-bold">50% Completed</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-1/2 rounded-full" />
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1 text-[10px] font-mono text-center">
                    <div className="p-1.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">✓ 25% Architecture</div>
                    <div className="p-1.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">✓ 50% Hitboxes</div>
                    <div className="p-1.5 rounded bg-slate-900 text-slate-500 border border-slate-800">75% Replication</div>
                    <div className="p-1.5 rounded bg-slate-900 text-slate-500 border border-slate-800">100% Final .RBXL</div>
                  </div>
                </div>
              </div>

              {/* Verified Developer Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">Assigned Talent</span>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-cyan-400 font-mono text-base">
                      AS
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-white text-sm">AeroScript</h4>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Elite Scripter • 4.9★</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Queue Capacity:</span>
                    <span className="text-emerald-400 font-mono font-bold">2/3 Active</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Warranty:</span>
                    <span className="text-cyan-400 font-bold">30 Days Included</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Escrow Vault holds $1,200.00 securely until client approves final deliverables.</span>
              </div>
              <span className="text-cyan-400 font-mono font-bold">Kaevy Studio v1.1.1 Spec Approved</span>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Header = ({ translate, titleComponent }: { translate: any; titleComponent: any }) => {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="div max-w-5xl mx-auto text-center mb-6"
    >
      {titleComponent}
    </motion.div>
  );
};
