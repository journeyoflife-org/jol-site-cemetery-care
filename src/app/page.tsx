import type { Metadata } from "next";
import tenant from "@/fixtures/tenant.json";
import { resolveLocale, buildHreflang, buildCanonical } from "@/lib/resolve-locale";
import { buildChurchEntity, buildBreadcrumb } from "@/lib/json-ld";

const locales = ["lt", "en", "ru"] as const;

export function generateMetadata(): Metadata {
  const name = resolveLocale(tenant.name, "lt");
  return {
    title: `${name} — Cemetery Services | ${tenant.slug}`,
    alternates: {
      canonical: buildCanonical(tenant.identity.domain),
      languages: buildHreflang(tenant.identity.domain, locales),
    },
  };
}

export default function CemeteryCarePage() {
  const locale = "lt";
  const t = (obj: Record<string, string>) => resolveLocale(obj, locale);
  const churchEntity = buildChurchEntity({
    name: t(tenant.name),
    address: tenant.identity.address,
    phone: tenant.identity.phone,
    geo: { lat: 54.6872, lng: 25.2797 },
    parentOrganization: tenant.identity.jurisdiction || "",
    
  });
  const breadcrumb = buildBreadcrumb([
    { name: t(tenant.name), url: `https://${tenant.identity.domain}/` },
  ]);
  const page = tenant.pages[0];

  const hero = page.contentBlocks[0] as any;
  const kv = page.contentBlocks[1] as any;
  const services = page.contentBlocks[2] as any;
  const stats = page.contentBlocks[3] as any;
  const cta = page.contentBlocks[4] as any;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(churchEntity) } }
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(breadcrumb) } }
      />

      {/* Hero */}
      <section aria-label="Hero" className="bg-liturgical-green/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t(hero.heading)}</h1>
          {hero.subheading && <p className="text-xl text-gray-700 mb-2">{t(hero.subheading)}</p>}
        </div>
      </section>

      {/* Contact + Hours */}
      <section aria-label="Contact and hours" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{t(kv.heading)}</h2>
          <dl className="space-y-2">
            {kv.items.map((item: any, i: number) => (
              <div key={i} className="flex gap-2">
                <dt className="font-medium text-gray-700 min-w-[120px]">{t(item.label)}:</dt>
                <dd className="text-gray-600">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Services */}
      <section aria-label="Services" className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">{t(services.heading)}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.items.map((item: any, i: number) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold">{t(item.title)}</h3>
                {item.description && <p className="text-gray-600 text-sm mt-1">{t(item.description)}</p>}
                {item.price && <p className="text-lg font-bold text-liturgical-green mt-2">{item.price} EUR</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Statistics" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t(stats.heading)}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.items.map((item: any, i: number) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-liturgical-green">{item.value}</div>
                <div className="text-sm text-gray-600 mt-1">{t(item.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-label="Quick links" className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <nav className="flex flex-wrap gap-4 justify-center">
            {cta.links.map((link: any, i: number) => (
              <a key={i} href={link.href} className="px-6 py-3 bg-liturgical-green/20 rounded-lg hover:bg-liturgical-green/30 transition-colors font-medium">{t(link.label)}</a>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
