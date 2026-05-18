import { motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageProvider';
import { useLocationDraft } from '../../context/LocationDraftContext';
import { Section, SectionInner } from '../Section';
import { useApprovedWaterSites } from '../../hooks/useApprovedWaterSites';
import { WaterMap } from '../map/WaterMap';

export function Atlas() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const { sites: approvedSites } = useApprovedWaterSites();
  const { setDraftFromMap, draftPin, resolving } = useLocationDraft();

  return (
    <Section id="atlas" className="!min-h-0 py-32">
      <SectionInner>
        <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">{t('atlas.label')}</span>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-ink md:text-6xl">
          {t('atlas.title')}
        </h2>
        <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-dim">{t('atlas.p1')}</p>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-dim">{t('atlas.p2')}</p>

        <motion.div
          className="mt-12"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <WaterMap
            extraSites={approvedSites}
            draftPin={draftPin}
            resolving={resolving}
            onMapClick={(lat, lng) => void setDraftFromMap(lat, lng)}
          />
        </motion.div>

        <motion.div className="mt-16 border-t border-border pt-12 md:mt-20 md:pt-16">
          <h3 className="font-serif text-2xl text-ink md:text-3xl">{t('atlas.ctaTitle')}</h3>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
            {t('atlas.ctaP1')}
          </p>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
            {t('atlas.ctaP2')}
          </p>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-dim md:text-lg">
            {t('atlas.ctaP3')}
          </p>
          <a href="#contribute" className="btn-primary btn-ripple mt-8 inline-flex">
            <Plus className="h-4 w-4" aria-hidden />
            {t('atlas.addSite')}
          </a>
        </motion.div>
      </SectionInner>
    </Section>
  );
}
