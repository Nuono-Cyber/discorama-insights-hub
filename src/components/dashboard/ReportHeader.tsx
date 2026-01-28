import { motion } from 'framer-motion';
import { FileText, User, Award, Calendar } from 'lucide-react';

export function ReportHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      {/* Company Header */}
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Discorama</h1>
            <p className="text-muted-foreground">Dashboard de Analytics</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Relatório Atualizado</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
            <Award className="h-4 w-4" />
            <span>Indicium Tech</span>
          </div>
        </div>
      </div>

      {/* Author Info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-4"
      >
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">Engenheiro de Analytics Responsável</p>
            <h2 className="text-xl font-bold">Gabriel Nunes Barbosa Nogueira</h2>
            <p className="text-sm text-primary">Certificado pela Indicium Tech</p>
          </div>
        </div>
      </motion.div>

      {/* Strategic Context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 rounded-xl border border-border bg-card p-6"
      >
        <h3 className="mb-3 text-lg font-semibold">Contexto Estratégico</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A Discorama é uma loja de DVDs e mídias físicas com aproximadamente 600 clientes 
          e faturamento médio de 2.000 dólares/dia. Os objetivos estratégicos de curto prazo 
          são <span className="text-warning font-medium">aumentar o ticket médio</span> e{' '}
          <span className="text-destructive font-medium">reduzir o atraso médio na devolução</span> dos filmes.
        </p>
      </motion.div>
    </motion.div>
  );
}
