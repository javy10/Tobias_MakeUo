import { Facebook, Instagram } from 'lucide-react';
import { Logo } from '../shared/Logo';
import Link from 'next/link';
import { useAppContext } from '@/app/layout';
import { motion } from 'framer-motion';
import { useVisibleSectionsOnly } from '@/hooks/use-visible-sections';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.52.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.85-.38-6.75-1.77-2.05-1.51-3.2-3.9-3.2-6.32.01-4.42 3.6-7.99 8.04-7.99.12 0 .24.01.36.02v4.03c-1.31-.02-2.61-.01-3.91-.02-.25-.01-.5-.02-.75-.02-.03 1.15.22 2.31.81 3.36.53.94 1.34 1.63 2.34 1.95.95.31 2 .31 2.95.02.9-.27 1.71-.85 2.25-1.6s.8-1.67.74-2.72c-.05-1.29-.11-2.58-.17-3.87z" />
  </svg>
);


export function Footer() {
  const { appState } = useAppContext();
  const visibleSections = useVisibleSectionsOnly(appState);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.footer 
      className="style-3-bg text-gray-800 py-12 mt-16 text-center border-t border-gray-200"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <motion.div className="space-y-4 flex flex-col items-center" variants={itemVariants}>
            <Logo />
            <p className="text-sm text-gray-600">
              Belleza que Transforma. Tu estilo personal, realzado con el arte del maquillaje profesional.
            </p>
          </motion.div>
          <motion.div className="flex flex-col items-center" variants={itemVariants}>
            <h3 className="font-headline text-lg font-semibold mb-4 text-gray-800">Navegación</h3>
            <ul className="space-y-2 text-sm">
              {visibleSections.map((section) => (
                <li key={section.href}>
                  <Link href={section.href} className="hover:text-cyan-600 transition-colors hover-lift text-gray-600">
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
           <motion.div className="flex flex-col items-center" variants={itemVariants}>
            <h3 className="font-headline text-lg font-semibold mb-4 text-gray-800">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terminos-y-condiciones" className="hover:text-cyan-600 transition-colors hover-lift text-gray-600">Términos y Condiciones</Link></li>
              <li><Link href="/politica-de-privacidad" className="hover:text-cyan-600 transition-colors hover-lift text-gray-600">Política de Privacidad</Link></li>
              <li><Link href="/politica-de-cookies" className="hover:text-cyan-600 transition-colors hover-lift text-gray-600">Política de Cookies</Link></li>
            </ul>
          </motion.div>
          <motion.div className="flex flex-col items-center" variants={itemVariants}>
            <h3 className="font-headline text-lg font-semibold mb-4 text-gray-800">Síguenos</h3>
            <div className="flex justify-center space-x-4">
              <motion.a 
                href="https://www.facebook.com/profile.php?id=100071055431299" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-cyan-600 transition-colors hover-lift text-gray-600"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Facebook />
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/tobias_makeup95/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-cyan-600 transition-colors hover-lift text-gray-600"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Instagram />
              </motion.a>
              <motion.a 
                href="https://www.tiktok.com/@tobias_makeup95" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-cyan-600 transition-colors hover-lift text-gray-600"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <TikTokIcon />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
        <motion.div 
          className="border-t border-gray-200 pt-8 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p>&copy; {new Date().getFullYear()} Tobias MakeUp. Todos los derechos reservados.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
