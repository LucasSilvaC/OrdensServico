import React from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-amber-50 py-10 px-4 mt-32 shadow-inner shadow-purple-800/20">
      <div className="flex flex-col items-center max-w-6xl mx-auto gap-10">
        {/* INSTITUIÇÃO */}
        <section className="text-center max-w-xl">
          <h3 className="text-2xl font-bold text-amber-50 mb-2 drop-shadow">
            Escola SENAI Roberto Mange
          </h3>
          <p className="text-lg text-gray-300 mb-4 italic">
            Formando profissionais para o futuro.
          </p>
          <address className="not-italic text-sm leading-relaxed text-gray-400">
            <p>
              <strong className="text-purple-300">Endereço:</strong> Rua Pastor Cícero Canuto de Lima, 71 - Campinas, SP
            </p>
            <p>
              <strong className="text-purple-300">Contato:</strong> (19) 3772-1840 |{" "}
              <a
                href="mailto:contato@senai.com.br"
                className="text-purple-300 hover:underline"
              >
                contato@senai.com.br
              </a>
            </p>
          </address>
        </section>

        {/* REDES SOCIAIS */}
        <section className="text-center">
          <h4 className="text-xl font-semibold text-amber-50 mb-3 drop-shadow">
            Redes Sociais
          </h4>
          <nav className="flex justify-center gap-5">
            {[
              {
                icon: <Facebook size={24} color="white" />,
                href: "https://facebook.com/senairobertomange",
              },
              {
                icon: <Instagram size={24} color="white" />,
                href: "https://instagram.com/senairobertomange",
              },
              {
                icon: <Linkedin size={24} color="white" />,
                href: "https://linkedin.com/senairobertomange",
              },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-purple-400 transition-all hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              >
                {social.icon}
              </a>
            ))}
          </nav>
        </section>
      </div>

      {/* DIREITOS */}
      <div className="border-t border-purple-700 mt-10 pt-4 text-center text-sm text-gray-500 tracking-wide">
        <p>&copy; 2025 SENAI Roberto Mange. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}