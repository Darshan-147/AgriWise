/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaSatellite,
  FaWhatsapp,
  FaChartLine,
  FaMapMarkedAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaRegFileAlt,
  FaShieldAlt,
  FaUsers,
  FaGlobe,
} from 'react-icons/fa';
import { HiOutlineChartBar, HiMenu, HiX } from 'react-icons/hi';
import { TbPlant, TbCloudRain, TbBug, TbSunset, TbCreditCard, TbChartBar } from 'react-icons/tb';
import {
  MdOutlineWaterDrop,
  MdNotifications,
  MdOutlineInsights,
  MdOutlineMonetizationOn,
} from 'react-icons/md';
import { BsGraphUp, BsCalendarCheck, BsBank2, BsShield } from 'react-icons/bs';
import { RiGovernmentLine, RiPlantLine, RiMoneyDollarCircleLine } from 'react-icons/ri';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const heroParticles = Array.from({ length: 50 }, (_, i) => ({
  top: `${((i * 37) % 100) + 0.5}%`,
  left: `${((i * 61) % 100) + 0.5}%`,
  opacity: 0.2 + ((i * 13) % 50) / 100,
  duration: 3 + (i % 5) * 0.4,
}));

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Get the typewriter words from translation
  const typewriterWords = t('hero.typewriter', { returnObjects: true }) || [
    'Farmer-Focused Evaluation',
    'Alternative Credit Scoring',
    'Data-Driven Loan Approval',
    'Fair Financial Access',
  ];

  const [text] = useTypewriter({
    words: Array.isArray(typewriterWords) ? typewriterWords : [typewriterWords],
    loop: true,
    delaySpeed: 2000,
  });

  // Update typewriter when language changes
  useEffect(() => {
    // This will force the typewriter to restart with new language
  }, [i18n.language]);

  // Helper function to ensure we always have an array
  const ensureArray = (item) => {
    if (!item) return [];
    return Array.isArray(item) ? item : [item];
  };

  return (
    <main className="w-full overflow-x-hidden bg-gray-900 text-white">
      {/* Hero Section - Redesigned without 3D model */}
      <section id="home" className="relative min-h-screen w-full bg-[#0B1120] pt-24">
        <div className="absolute inset-0 overflow-hidden">
          {/* Background patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-gray-900/70 to-[#0B1120]" />

          {/* Animated dots */}
          {heroParticles.map((particle, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute h-1 w-1 bg-emerald-400 rounded-full"
              style={{
                top: particle.top,
                left: particle.left,
                opacity: particle.opacity,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}

          {/* Animated farm-themed elements */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-900/20 to-transparent" />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-7xl mx-auto"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8">
                <span className="text-emerald-400">{text}</span>
                <Cursor cursorColor="#10b981" />
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-emerald-100 mb-10 max-w-3xl mx-auto">
                {t('hero.subtitle')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
              >
                {t('hero.getStarted')}
              </motion.button>

              {/* Statistics cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
                {[
                  { value: '40%', label: t('hero.stats.approvalRate') },
                  { value: '60+', label: t('hero.stats.dataPoints') },
                  { value: '5x', label: t('hero.stats.riskAssessment') },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                    className="bg-gray-800 border border-emerald-500/40 rounded-xl p-6 shadow-lg shadow-emerald-500/5"
                  >
                    <h3 className="text-4xl font-bold text-emerald-400 mb-2">{stat.value}</h3>
                    <p className="text-emerald-100">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Integration Section */}
      <section id="data-integration" className="relative py-32 w-full bg-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          {/* Circular gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-800/30 via-gray-800 to-gray-800" />

          {/* Farm-themed background patterns */}
          <div className="absolute bottom-0 left-0 right-0 h-40 opacity-10 bg-[url('https://pattern.monster/assets/img/patterns/farm-pattern.png')]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-emerald-400">
              {t('dataIntegration.title')}
            </h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">{t('dataIntegration.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaMapMarkedAlt,
                title: t('dataIntegration.sections.gis.title'),
                description: t('dataIntegration.sections.gis.description'),
              },
              {
                icon: TbCloudRain,
                title: t('dataIntegration.sections.weather.title'),
                description: t('dataIntegration.sections.weather.description'),
              },
              {
                icon: RiPlantLine,
                title: t('dataIntegration.sections.crop.title'),
                description: t('dataIntegration.sections.crop.description'),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl transform -rotate-6 group-hover:rotate-0 transition-transform" />
                <div className="relative bg-gray-900 p-8 rounded-2xl border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-lg">
                  <div className="bg-emerald-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="text-3xl text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-emerald-400">{item.title}</h3>
                  <p className="text-emerald-100">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Scoring Section */}
      <section id="credit-scoring" className="relative py-32 w-full bg-[#0B1120]">
        <div className="absolute inset-0">
          {/* Grid Effect */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"
                style={{
                  top: `${(i + 1) * 10}%`,
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scaleX: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`vertical-${i}`}
                className="absolute h-full w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent"
                style={{
                  left: `${(i + 1) * 10}%`,
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scaleY: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-emerald-400">{t('creditScoring.title')}</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">{t('creditScoring.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[
              {
                title: t('creditScoring.sections.riskAssessment.title'),
                description: t('creditScoring.sections.riskAssessment.description'),
                metrics: ensureArray(
                  t('creditScoring.sections.riskAssessment.metrics', { returnObjects: true })
                ),
              },
              {
                title: t('creditScoring.sections.yieldAnalysis.title'),
                description: t('creditScoring.sections.yieldAnalysis.description'),
                metrics: ensureArray(
                  t('creditScoring.sections.yieldAnalysis.metrics', { returnObjects: true })
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gray-900 p-8 rounded-2xl border border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-4 text-emerald-400">{item.title}</h3>
                <p className="text-emerald-100 mb-6">{item.description}</p>
                <div className="grid grid-cols-3 gap-4">
                  {item.metrics.map((metric, i) => (
                    <div
                      key={i}
                      className="text-center p-3 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 transition-all duration-300"
                    >
                      <span className="text-emerald-300 font-semibold">{metric}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Access Section */}
      <section id="user-access" className="relative py-32 w-full bg-gray-900">
        <div className="absolute inset-0">
          {/* Wave pattern background */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  border: '2px solid #10b981',
                  transform: `scale(${1 + i * 0.1})`,
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1 + i * 0.1, 1.1 + i * 0.1, 1 + i * 0.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-emerald-400">{t('userAccess.title')}</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">{t('userAccess.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaUsers,
                title: t('userAccess.sections.farmerPortal.title'),
                description: t('userAccess.sections.farmerPortal.description'),
              },
              {
                icon: BsBank2,
                title: t('userAccess.sections.lenderDashboard.title'),
                description: t('userAccess.sections.lenderDashboard.description'),
              },
              {
                icon: MdOutlineInsights,
                title: t('userAccess.sections.creditInsights.title'),
                description: t('userAccess.sections.creditInsights.description'),
              },
              {
                icon: FaWhatsapp,
                title: t('userAccess.sections.mobileAccess.title'),
                description: t('userAccess.sections.mobileAccess.description'),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-800 p-6 rounded-xl border border-emerald-500/40 hover:border-emerald-400 shadow-lg"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-emerald-500/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                >
                  <item.icon className="text-2xl text-emerald-400" />
                </motion.div>
                <h3 className="text-lg font-bold mb-2 text-emerald-400">{item.title}</h3>
                <p className="text-emerald-100 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section id="compliance" className="relative py-32 w-full bg-[#0B1120]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5" />
          {/* Animated lines */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-1/3 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"
              style={{
                top: `${(i + 1) * 20}%`,
                left: `${i % 2 === 0 ? 0 : 'auto'}`,
                right: `${i % 2 === 0 ? 'auto' : 0}`,
              }}
              animate={{
                x: i % 2 === 0 ? ['-100%', '100%'] : ['100%', '-100%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 1,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-emerald-400">{t('compliance.title')}</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">{t('compliance.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: t('compliance.sections.dataSecurity.title'),
                description: t('compliance.sections.dataSecurity.description'),
                metrics: ensureArray(
                  t('compliance.sections.dataSecurity.metrics', { returnObjects: true })
                ),
              },
              {
                title: t('compliance.sections.regulatory.title'),
                description: t('compliance.sections.regulatory.description'),
                metrics: ensureArray(
                  t('compliance.sections.regulatory.metrics', { returnObjects: true })
                ),
              },
              {
                title: t('compliance.sections.regional.title'),
                description: t('compliance.sections.regional.description'),
                metrics: ensureArray(
                  t('compliance.sections.regional.metrics', { returnObjects: true })
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl transform group-hover:scale-105 transition-transform" />
                <div className="relative bg-gray-900 p-8 rounded-2xl border border-emerald-500/40 hover:border-emerald-400 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-emerald-400">{item.title}</h3>
                  <p className="text-emerald-100 mb-6">{item.description}</p>
                  <div className="space-y-3">
                    {item.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-emerald-200">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 w-full bg-emerald-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-700 to-emerald-800" />

          {/* Farm-themed elements */}
          <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20 bg-[url('https://pattern.monster/assets/img/patterns/farm-pattern.png')]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{t('cta.title')}</h2>
              <p className="text-emerald-100 mb-8 text-lg">{t('cta.subtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="bg-white text-emerald-800 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold shadow-lg"
                >
                  {t('cta.applyCredit')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="bg-transparent text-white border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold"
                >
                  {t('cta.partnerWithUs')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 border-t border-emerald-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold text-emerald-400 mb-4">FarmCredit</h3>
                <p className="text-emerald-100 mb-4">{t('footer.description')}</p>
                <div className="flex space-x-4">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="#"
                    className="text-emerald-300 hover:text-emerald-400"
                  >
                    <FaGithub className="text-2xl" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="#"
                    className="text-emerald-300 hover:text-emerald-400"
                  >
                    <FaLinkedin className="text-2xl" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="#"
                    className="text-emerald-300 hover:text-emerald-400"
                  >
                    <FaTwitter className="text-2xl" />
                  </motion.a>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-emerald-300">
                  {t('footer.quickLinks')}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-emerald-100 hover:text-emerald-400">
                      {t('footer.links.aboutUs')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-emerald-100 hover:text-emerald-400">
                      {t('footer.links.howItWorks')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-emerald-100 hover:text-emerald-400">
                      {t('footer.links.forLenders')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-emerald-100 hover:text-emerald-400">
                      {t('footer.links.forFarmers')}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-emerald-300">
                  {t('footer.resources')}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-emerald-100 hover:text-emerald-400">
                      {t('footer.links.documentation')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-emerald-100 hover:text-emerald-400">
                      {t('footer.links.financialEducation')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-emerald-100 hover:text-emerald-400">
                      {t('footer.links.successStories')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-emerald-100 hover:text-emerald-400">
                      {t('footer.links.support')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-emerald-800/50 text-center text-emerald-100">
              <p>
                &copy; {new Date().getFullYear()} FarmCredit. {t('footer.copyright')}
              </p>
              <p className="mt-2 text-sm">{t('footer.tagline')}</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
