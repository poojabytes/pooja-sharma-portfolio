import SectionHeading from "@/components/common/SectionHeading";
import { formatMonthYear } from "@/utils/format";
import type { Certificate } from "@/types/portfolio";

type Props = {
  certificates: Certificate[];
};

export default function CertificatesSection({ certificates }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <SectionHeading
        id="certificates"
        eyebrow="Credentials"
        title="Certifications"
      />
      {certificates.length === 0 ? (
        <p className="bento-card text-sm text-muted">
          Certificates uploaded in admin will display here.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <li key={cert.id} className="bento-card">
              {cert.image_url ? (
                <img
                  src={cert.image_url}
                  alt={cert.title}
                  className="mb-4 h-36 w-full rounded-lg object-cover ring-1 ring-border"
                  loading="lazy"
                />
              ) : null}
              <h3 className="font-semibold">{cert.title}</h3>
              {cert.issuer ? <p className="mt-1 text-sm text-muted">{cert.issuer}</p> : null}
              {cert.issue_date ? (
                <p className="mt-2 text-xs text-muted">{formatMonthYear(cert.issue_date)}</p>
              ) : null}
              {cert.pdf_url ? (
                <a
                  href={cert.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs text-accent hover:underline"
                >
                  View PDF
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}