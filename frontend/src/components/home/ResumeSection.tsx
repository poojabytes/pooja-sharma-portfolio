import { Download, FileText } from "lucide-react";
import Section from "@/components/common/Section";
import SectionHeading from "@/components/common/SectionHeading";
import ResumeEditor from "@/components/owner/editors/ResumeEditor";
import { formatDateTime } from "@/utils/format";
import { mediaUrl } from "@/utils/mediaUrl";
import type { Resume } from "@/types/portfolio";

type Props = {
  resume: Resume | null;
};

export default function ResumeSection({ resume }: Props) {
  return (
    <Section id="resume" tone="violet" side="left" className="!py-16 md:!py-20">
      <SectionHeading eyebrow="Resume" title="Download CV" highlight={["CV"]} />
      {resume ? (
        <article className="bento-card is-static max-w-3xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="shrink-0 rounded-2xl bg-accent/10 p-3 text-accent">
                <FileText className="h-7 w-7" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-bold sm:text-lg" title={resume.file_name}>
                  {resume.file_name}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Last updated {formatDateTime(resume.updated_at)}
                </p>
              </div>
            </div>
            <a
              href={mediaUrl(resume.file_url)}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="btn-primary group w-full shrink-0 justify-center sm:w-auto sm:min-w-[11.5rem]"
            >
              <Download
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden
              />
              Download PDF
            </a>
          </div>
        </article>
      ) : (
        <div className="bento-card is-static flex max-w-3xl items-center gap-4 text-sm text-muted">
          <FileText className="h-8 w-8 shrink-0 text-accent" aria-hidden />
          <p>A resume download will appear here once a PDF is uploaded.</p>
        </div>
      )}

      <ResumeEditor resume={resume} />
    </Section>
  );
}