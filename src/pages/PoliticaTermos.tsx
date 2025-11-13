import { motion } from "framer-motion";

export default function PoliticaTermos() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Política de Privacidade e Termos de Uso
          </h1>
          <p className="text-slate-600 text-sm">
            Última atualização em 13 de novembro de 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6 text-sm md:text-base text-slate-700"
        >
          {/* 1. Quem somos */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              1. Quem somos
            </h2>
            <p>
              Esta Política de Privacidade e Termos de Uso se aplica ao{" "}
              <strong>Banco de Dados Essencial</strong>, plataforma mantida por{" "}
              <strong>Daiane Alaniz</strong>, voltada para consulta de informações
              sobre óleos essenciais, grupos químicos, conteúdos educativos e
              materiais de apoio.
            </p>
            <p className="mt-2">
              Ao acessar e utilizar o sistema, você declara que leu, entendeu e
              concorda com os termos descritos neste documento.
            </p>
          </section>

          {/* 2. Uso responsável do acesso e do conteúdo */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              2. Uso responsável do acesso e do conteúdo
            </h2>

            <h3 className="font-semibold text-slate-900 mt-2 mb-1">
              2.1. Acesso pessoal e intransferível
            </h3>
            <p>
              <strong>Não compartilhe seu acesso.</strong> O acesso ao banco de
              dados e aos conteúdos é pessoal e intransferível. Compartilhar seu
              login com terceiros (familiares, amigos, grupos, etc.) compromete a
              integridade do material e <strong>não é permitido</strong>. Caso
              sejam identificados acessos suspeitos ou simultâneos incompatíveis
              com o uso individual, o acesso poderá ser suspenso ou cancelado sem
              reembolso, conforme o Código Civil Brasileiro e o Código de Defesa
              do Consumidor.
            </p>

            <h3 className="font-semibold text-slate-900 mt-3 mb-1">
              2.2. Propriedade intelectual e cópia de conteúdo
            </h3>
            <p>
              <strong>Evite copiar o conteúdo.</strong> Todo o conteúdo do Banco
              de Dados Essencial (textos, descrições, tabelas, imagens, exemplos,
              protocolos, textos explicativos e materiais de apoio) é{" "}
              <strong>de uso exclusivo</strong> dos alunos/clientes e protegido
              pela legislação de direitos autorais brasileira (Lei nº 9.610/98).
            </p>
            <p className="mt-2">
              Copiar, reproduzir, distribuir, disponibilizar em grupos, revender
              ou utilizar o conteúdo de forma não autorizada vai contra o espírito
              da comunidade de apoio e aprendizado e pode gerar{" "}
              <strong>responsabilidade civil e criminal</strong>.
            </p>

            <h3 className="font-semibold text-slate-900 mt-3 mb-1">
              2.3. Comunidade de apoio e correção de informações
            </h3>
            <p>
              <strong>Somos uma comunidade que se ajuda.</strong> Caso você
              encontre alguma informação errada, desatualizada ou que mereça
              complemento, entre em contato para que possamos corrigir:
            </p>
            <p className="mt-1">
              E-mail de suporte:{" "}
              <a
                href="mailto:suporte@daianealaniz.com.br"
                className="text-purple-700 underline"
              >
                suporte@daianealaniz.com.br
              </a>
              .
            </p>

            <h3 className="font-semibold text-slate-900 mt-3 mb-1">
              2.4. Complemento com aulas e materiais
            </h3>
            <p>
              <strong>Busque os conteúdos completos nas aulas.</strong> Este
              sistema é um <strong>apoio à consulta</strong>, não substitui as
              aulas, formações e materiais completos. Antes de replicar qualquer
              informação, receita ou ideia daqui, certifique-se de assistir às
              aulas correspondentes e revisar os materiais oficiais do seu curso,
              para entender o contexto completo, as indicações, dosagens e
              contraindicações.
            </p>
          </section>

          {/* 3. Dados pessoais e LGPD */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              3. Dados pessoais e proteção de dados (LGPD)
            </h2>
            <p>
              O tratamento de dados pessoais neste sistema segue a{" "}
              <strong>Lei Geral de Proteção de Dados Pessoais – LGPD (Lei nº 13.709/2018)</strong>.
              Coletamos e utilizamos apenas os dados necessários para execução dos
              serviços oferecidos e para melhoria da sua experiência.
            </p>

            <h3 className="font-semibold text-slate-900 mt-3 mb-1">
              3.1. Quais dados coletamos
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nome e sobrenome</li>
              <li>E-mail de cadastro</li>
              <li>Dados de contato (quando informados, como telefone/WhatsApp)</li>
              <li>
                Dados de acesso ao sistema (datas, páginas acessadas, favoritos,
                buscas, etc.)
              </li>
              <li>
                Dados de pagamento e faturamento podem ser tratados por
                plataformas parceiras (como gateways de pagamento), sempre em
                ambiente seguro.
              </li>
            </ul>

            <h3 className="font-semibold text-slate-900 mt-3 mb-1">
              3.2. Para quais finalidades usamos seus dados
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Permitir seu login e acesso ao banco de dados;</li>
              <li>Gerenciar sua assinatura ou plano de acesso;</li>
              <li>
                Melhorar o conteúdo e a experiência de uso (por exemplo,
                entendendo quais páginas são mais consultadas);
              </li>
              <li>
                Enviar avisos importantes sobre o sistema (notificações,
                mudanças de termos, atualizações relevantes);
              </li>
              <li>
                Cumprir obrigações legais, contábeis e de segurança da
                informação.
              </li>
            </ul>

            <h3 className="font-semibold text-slate-900 mt-3 mb-1">
              3.3. Compartilhamento de dados
            </h3>
            <p>
              Não vendemos seus dados pessoais. Seus dados podem ser
              compartilhados apenas com:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>
                Provedores de hospedagem, infraestrutura e banco de dados;
              </li>
              <li>
                Plataformas de pagamento e faturamento (para processar suas
                compras/assinaturas);
              </li>
              <li>
                Ferramentas de análise e métricas, sempre com foco em melhoria
                do serviço.
              </li>
            </ul>
            <p className="mt-2">
              Em todos os casos, buscamos parceiros que estejam alinhados com as
              boas práticas de segurança da informação e com a LGPD.
            </p>

            <h3 className="font-semibold text-slate-900 mt-3 mb-1">
              3.4. Seus direitos como titular de dados
            </h3>
            <p>
              De acordo com a LGPD, você pode, a qualquer momento, solicitar:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Acesso aos dados pessoais que mantemos sobre você;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>
                Exclusão ou anonimização de dados, quando aplicável e permitido
                por lei;
              </li>
              <li>
                Revogação do consentimento, quando o tratamento for baseado em
                consentimento;
              </li>
              <li>
                Informações sobre o compartilhamento de seus dados com
                terceiros.
              </li>
            </ul>
            <p className="mt-2">
              Para exercer seus direitos, entre em contato pelo e-mail{" "}
              <a
                href="mailto:suporte@daianealaniz.com.br"
                className="text-purple-700 underline"
              >
                suporte@daianealaniz.com.br
              </a>
              .
            </p>
          </section>

          {/* 4. Segurança da informação */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              4. Segurança da informação
            </h2>
            <p>
              Adotamos medidas técnicas e organizacionais razoáveis para
              proteger seus dados, tais como uso de senhas, controle de acesso e
              comunicação segura com o servidor, sempre buscando reduzir riscos
              de acesso não autorizado, vazamento ou perda de informações.
            </p>
            <p className="mt-2">
              Ainda assim, nenhum sistema é 100% imune a riscos. Por isso,
              recomendamos que você:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Use uma senha forte e não a compartilhe com ninguém;</li>
              <li>Evite acessar o sistema em computadores públicos;</li>
              <li>
                Sempre saia (logout) ao terminar o uso, especialmente em
                dispositivos compartilhados.
              </li>
            </ul>
          </section>

          {/* 5. Termos de uso do serviço */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              5. Termos de uso do serviço
            </h2>

            <h3 className="font-semibold text-slate-900 mt-2 mb-1">
              5.1. Natureza educacional e informativa
            </h3>
            <p>
              O Banco de Dados Essencial é uma ferramenta de{" "}
              <strong>consulta educacional</strong>. As informações aqui
              apresentadas não substituem orientação médica, farmacêutica ou de
              outros profissionais de saúde. Sempre consulte um profissional
              habilitado antes de aplicar qualquer protocolo ou indicação em
              pessoas, especialmente em casos de doenças, uso de medicamentos,
              gestantes, crianças, idosos ou pessoas com condições de saúde
              sensíveis.
            </p>

            <h3 className="font-semibold text-slate-900 mt-3 mb-1">
              5.2. Acesso, planos e cancelamento
            </h3>
            <p>
              O acesso ao Banco de Dados Essencial pode estar vinculado a
              cursos, mentorias, assinaturas ou planos específicos. As regras de
              duração, renovação, cancelamento e reembolso seguem as condições
              apresentadas no momento da compra, sempre em conformidade com o{" "}
              <strong>Código de Defesa do Consumidor</strong>.
            </p>
            <p className="mt-2">
              Em caso de dúvida sobre seu acesso, entre em contato pelo e-mail
              de suporte informado neste documento.
            </p>

            <h3 className="font-semibold text-slate-900 mt-3 mb-1">
              5.3. Suspensão ou encerramento de acesso
            </h3>
            <p>
              O acesso poderá ser suspenso ou encerrado nos seguintes casos:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Uso indevido da plataforma ou tentativa de fraude;</li>
              <li>Compartilhamento de login com terceiros;</li>
              <li>Violação de direitos autorais ou uso comercial não autorizado;</li>
              <li>Uso do conteúdo em desacordo com estes termos.</li>
            </ul>
          </section>

          {/* 6. Atualizações desta política */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              6. Atualizações desta Política
            </h2>
            <p>
              Esta Política de Privacidade e Termos de Uso poderá ser atualizada
              periodicamente para refletir melhorias no sistema, mudanças
              legais ou ajustes de segurança. Quando alterações relevantes
              forem realizadas, poderemos avisar por e-mail ou por notificações
              no próprio sistema.
            </p>
            <p className="mt-2">
              Recomendamos que você revise este documento de tempos em tempos
              para se manter informado.
            </p>
          </section>

          {/* 7. Contato */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              7. Contato
            </h2>
            <p>
              Em caso de dúvidas sobre esta política, seus dados pessoais ou o
              uso do sistema, entre em contato:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>
                E-mail:{" "}
                <a
                  href="mailto:suporte@daianealaniz.com.br"
                  className="text-purple-700 underline"
                >
                  suporte@daianealaniz.com.br
                </a>
              </li>
            </ul>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

