import { ArrowUpRight } from "lucide-react";
import Section from "@/components/common/Section";
import SectionHeading from "@/components/common/SectionHeading";
import CertificatesEditor from "@/components/owner/editors/CertificatesEditor";
import { formatMonthYear } from "@/utils/format";
import type { Certificate } from "@/types/portfolio";

type Props = {
  certificates: Certificate[];
};

export default function CertificatesSection({ certificates }: Props) {
  return (
    <Section id="certificates" tone="cyan" side="left">
      <SectionHeading eyebrow="Credentials" title="Certificates" highlight={["Certificates"]} />
      {certificates.length === 0 ? (
        <p className="bento-card is-static text-sm text-muted">Certificates will display here once added.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <li key={cert.id}>
              <article className="bento-card is-static flex h-full flex-col">
                {cert.image_url ? (
                  <div className="mb-4 overflow-hidden rounded-xl border border-border">
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      className="h-36 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <h3 className="font-display font-bold">{cert.title}</h3>
                {cert.issuer ? <p className="mt-1 text-sm text-muted">{cert.issuer}</p> : null}
                {cert.issue_date ? (
                  <p className="mt-2 text-xs text-muted">{formatMonthYear(cert.issue_date)}</p>
                ) : null}
                {cert.pdf_url ? (
                  <a
                    href={cert.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    View PDF <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      )}

      <CertificatesEditor certificates={certificates} />
    </Section>
  );
}