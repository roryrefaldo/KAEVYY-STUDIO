import React from 'react';
import { ShieldCheck, Lock, Award, FileCode, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface FeaturesProps {
  onLearnMore?: () => void;
}

export const Features: React.FC<FeaturesProps> = () => {
  const { language } = useLanguage();

  const featurePillarsEn = [
    {
      icon: ShieldCheck,
      title: 'Verified Developers',
      tagline: 'Talent Fleet Verification',
      description: "Work with developers reviewed through KAEVY's talent verification process, portfolio checks, and skill certifications.",
      stats: 'Verified Developer Network',
      color: 'text-emerald-400',
      border: 'border-emerald-800/60',
      bg: 'bg-emerald-950/30'
    },
    {
      icon: Lock,
      title: 'Escrow-Based Protection',
      tagline: 'Milestone Locked Vault',
      description: 'Payments follow a structured protection workflow instead of unmanaged direct transfers. Funds release on milestone signoff.',
      stats: 'Escrow-Based Vault',
      color: 'text-cyan-400',
      border: 'border-cyan-800/60',
      bg: 'bg-cyan-950/30'
    },
    {
      icon: Award,
      title: '30-Day Bug Warranty',
      tagline: 'Post-Delivery Coverage',
      description: 'Eligible delivered work includes a defined post-delivery bug warranty covering original scope defects at zero extra charge.',
      stats: '30-Day Bug Warranty',
      color: 'text-teal-400',
      border: 'border-teal-800/60',
      bg: 'bg-teal-950/30'
    },
    {
      icon: FileCode,
      title: 'Structured Workflow',
      tagline: 'Checkpoint Milestones',
      description: 'Briefs, milestones (25%, 50%, 75%, 100%), revisions, deliverables, and status updates stay organized in one workspace.',
      stats: 'Structured Milestones',
      color: 'text-blue-400',
      border: 'border-blue-800/60',
      bg: 'bg-blue-950/30'
    }
  ];

  const featurePillarsId = [
    {
      icon: ShieldCheck,
      title: 'Developer Terverifikasi',
      tagline: 'Jaringan Talent Terkurasi',
      description: 'Setiap developer melalui proses pemeriksaan portofolio dan sertifikasi keahlian sebelum menangani project.',
      stats: 'Developer Terverifikasi',
      color: 'text-emerald-400',
      border: 'border-emerald-800/60',
      bg: 'bg-emerald-950/30'
    },
    {
      icon: Lock,
      title: 'Perlindungan Pembayaran',
      tagline: 'Alur Pembayaran Teratur',
      description: 'Pembayaran diproses mengikuti alur perlindungan KAEVY. Dana dirilis secara bertahap sesuai persetujuan kamu.',
      stats: 'Perlindungan Pembayaran',
      color: 'text-cyan-400',
      border: 'border-cyan-800/60',
      bg: 'bg-cyan-950/30'
    },
    {
      icon: Award,
      title: 'Garansi Bug 30 Hari',
      tagline: 'Perbaikan Bebas Biaya',
      description: 'Setiap pekerjaan mencakup garansi perbaikan bug selama 30 hari pasca serah terima tanpa biaya tambahan.',
      stats: 'Garansi Bug 30 Hari',
      color: 'text-teal-400',
      border: 'border-teal-800/60',
      bg: 'bg-teal-950/30'
    },
    {
      icon: FileCode,
      title: 'Tahapan Project Jelas',
      tagline: 'Checkpoints Terstruktur',
      description: 'Detail pekerjaan, tahapan progress (25%, 50%, 75%, 100%), revisi, dan hasil pekerjaan terpantau di satu tempat.',
      stats: 'Tahapan Project',
      color: 'text-blue-400',
      border: 'border-blue-800/60',
      bg: 'bg-blue-950/30'
    }
  ];

  const featurePillars = language === 'id' ? featurePillarsId : featurePillarsEn;

  return (
    <section className="px-4 lg:px-12 max-w-[1500px] mx-auto w-full space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> {language === 'id' ? 'Kenapa Memilih KAEVY?' : 'Why Choose KAEVY Studio'}
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {language === 'id'
            ? 'Proses Kerja Teratur & Pembayaran Lebih Terpercaya'
            : 'Engineered For Roblox Studio Excellence & Financial Trust'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {language === 'id'
            ? 'Menggantikan transaksi langsung tanpa kepastian dengan sistem perlindungan pembayaran, developer terverifikasi, dan tahapan project yang jelas.'
            : 'Replaces unverified Discord DM deals with transparent escrow vaults, talent verification, and structured Roblox development milestones.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featurePillars.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-slate-900 border ${feature.border} space-y-4 hover:border-cyan-500/50 transition-all flex flex-col justify-between group`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl ${feature.bg} ${feature.color} border ${feature.border}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {feature.tagline}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className={`text-xs font-mono font-bold ${feature.color}`}>
                  {feature.stats}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
