import { Download, FileText } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import { formatDateTime } from "@/utils/format";
import type { Resume } from "@/types/portfolio";

type Props = {
  resume: Resume | null;
};

export default function ResumeSection({ resume }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <SectionHeading id="resume" eyebrow="Resume" title="Download CV" />
      <ResumeCard resume={resume} />
    </section>
  );
}

function ResumeCard({ resume }: { resume: Resume | null }) {
  if (!resume) {
    return (
      <div className="bento-card flex items-center gap-4 text-sm text-muted">
        <FileText className="h-8 w-8 shrink-0 text-accent" aria-hidden />
        <p>Upload a PDF resume in the admin dashboard to enable download here.</p>
      </div>
    );
  }

  return (
    <div className="bento-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-accent/15 p-3 text-accent">
          <FileText className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <p className="font-medium">{resume.file_name}</p>
          <p className="mt-1 text-xs text-muted">
            Last updated {formatDateTime(resume.updated_at)}
          </p>
        </div>
      </div>
      <a
        href={resume.file_url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
      >
        <Download className="h-4 w-4" aria-hidden />
        Download PDF
      </a>
    </div>
  );
}